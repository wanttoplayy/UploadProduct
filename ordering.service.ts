import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { OrderingRepository } from '../repository/ordering.repository';
import {
    DatabaseErrorException,
    WriteFileErrorException,
} from '../exceptions/base.exception';
import { IResultService } from '../interfaces/service.interface';
import { SUCCESS_CODE, SUCCESS_MESSAGE } from '../exceptions/success-code';
import { NotFoundException } from '../exceptions/ordering.exception';
import {
    IBodySaveOrder,
    IGetForecast7daysPeriod,
    IGetOrderProductLongListResult,
    IGetOrderProductShortListResult,
    IGetOrderProductSupplyUseListResult,
    IGetOrderPromotionList,
    IGetOrderingServiceQuery,
    IGetOrderingServiceResult,
    IGetProductDetail,
    IGetProductType,
    IGetWeatherTemperature,
    IOrderList,
    IQueryReqSaveOrder,
    IOrderGroupQueryMM2C,
    ISaveOrder,
    ISaveOrderProduct,
} from '../interfaces/models/ordering.interface';
import { convertDate } from '../utils/convert-date';
import { createOrderPattern } from '../utils/order-pattern';
import * as fs from 'fs/promises';
import GlobalTo from '../helpers/to';
import MongoDb from '../utils/mongo-db';
import ScriptMysql from '../utils/mysql';

@injectable()
class OrderingService {
    constructor(
        @inject(TYPES.orderingRepositoryImpl)
        private orderingRepository: OrderingRepository,

        @inject(TYPES.mongoDb)
        private mongoDb: MongoDb,

        @inject(TYPES.scriptMysql)
        private scriptMysql: ScriptMysql,
    ) {}
    public async getOrderGroupList(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        productType: string,
    ): Promise<IResultService<IGetOrderingServiceResult>> {
        const tableNumber = Math.floor((Number(storeId) - 1) / 1000) + 1;
        const tableName = 'order_group_' + String(tableNumber).padStart(3, '0');
        let query: any;
        query = await this.orderingRepository.getOrderGroupList(
            tableName,
            companyId,
            storeId,
            orderDate,
            productType,
        );
        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (!query.data[0].length) {
            throw new NotFoundException({});
        }

        const result: any = {};

        query.data[0].forEach((item: IGetOrderingServiceQuery) => {
            if (!result[item.vendorId]) {
                result[item.vendorId] = {
                    supplierCode: item.vendorId,
                    supplierName: item.vendorName,
                    hoFileExt: item.hoFileExtend1,
                    hoDataType: item.hoDataType,
                    hoDocNo: item.hoDocumentNo,
                    orderGroupList: [],
                };
            }

            result[item.vendorId].orderGroupList.push({
                orderNumber: item.orderNumber,
                orderGroupCode: item.orderGroupCode,
                orderGroupName: item.orderGroupName,
                cufOffTime: item.orderCutoffTime,
                startPeriodForecast: item.startPeriodForecast,
                stopPeriodForecast: item.stopPeriodForecast,
                status: '',
                orderDateSend: '',
                topAllQty: 0,
                topNorDerQty: 0,
            });
        });

        const response: IGetOrderingServiceResult = {
            companyId,
            storeId,
            orderDate,
            productType,
            vendorList: Object.values(result),
        };

        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: response,
            },
        };
    }

    public async getOrderProductSupplyUseList(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        orderGroupCode: string,
        productTypeCode: string,
    ): Promise<IResultService<IGetOrderProductSupplyUseListResult>> {
        const query =
            await this.orderingRepository.getOrderProductSupplyUseList(
                companyId,
                storeId,
                orderDate,
                orderGroupCode,
                productTypeCode,
            );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }

    public async getOrderProductShortList(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        orderGroupCode: string,
        productTypeCode: string,
    ): Promise<IResultService<IGetOrderProductShortListResult>> {
        const query = await this.orderingRepository.getOrderProductShortList(
            companyId,
            storeId,
            orderDate,
            orderGroupCode,
            productTypeCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data[0].length === 0) {
            throw new NotFoundException({});
        }

        // let returnData: IGetOrderProductShortListResult = {
        //     companyId,
        //     storeId,
        //     orderDate,
        //     productTypeCode,
        //     orderList: []
        // }

        // query.data[0].forEach(())

        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data[0],
            },
        };
    }

    public async getOrderProductLongList(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        orderGroupCode: string,
        productTypeCode: string,
    ): Promise<IResultService<IGetOrderProductLongListResult>> {
        const query = await this.orderingRepository.getOrderProductLongList(
            companyId,
            storeId,
            orderDate,
            orderGroupCode,
            productTypeCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }

    public async getForecast4Weeks(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        orderGroupCode: string,
        productCode: string,
    ): Promise<IResultService<IGetOrderingServiceResult>> {
        const query = await this.orderingRepository.getForecast4Weeks(
            companyId,
            storeId,
            orderDate,
            orderGroupCode,
            productCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }

    public async getForecast7daysPeriod(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        orderGroupCode: string,
        productCode: string,
    ): Promise<IResultService<IGetForecast7daysPeriod>> {
        const query = await this.orderingRepository.getForecast7daysPeriod(
            companyId,
            storeId,
            orderDate,
            orderGroupCode,
            productCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }

    public async getProductType(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
    ): Promise<IResultService<IGetProductType>> {
        const tableName =
            'order_group_' +
            String(Math.floor((parseInt(storeId) - 1) / 1000) + 1).padStart(
                3,
                '0',
            );

        let query = await this.orderingRepository.getProductType(
            companyId,
            storeId,
            orderDate,
            tableName,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }

        if (query.data[0].length === 0) {
            const queryMM2C =
                await this.orderingRepository.getOrderGroupListMM2C(
                    orderDate,
                    storeId,
                );

            if (queryMM2C.error) {
                throw new DatabaseErrorException(queryMM2C.error);
            }

            if (!queryMM2C.data[0].length) {
                throw new NotFoundException({});
            }

            const list = queryMM2C.data[0].map((item: IOrderGroupQueryMM2C) => {
                return [
                    companyId,
                    item.STORE_ID,
                    item.ORDER_GRP_CD,
                    item.ORDER_GRP_NAME,
                    item.VENDOR_NAME,
                    item.VENDOR_ID,
                    item.VENDOR_SUB_ID,
                    item.ORDER_SUNDAY,
                    item.ORDER_MONDAY,
                    item.ORDER_TUESDAY,
                    item.ORDER_WEDNESDAY,
                    item.ORDER_THURSDAY,
                    item.ORDER_FRIDAY,
                    item.ORDER_SATURDAY,
                    item.ORDER_DAY,
                    item.Datepart,
                    item.ORDER_GROUP_TYPE_1,
                    item.HO_FILE_EXTEND_1,
                    item.HO_DATA_TYPE,
                    item.HO_DOCUMENT_NO,
                    item.ORDER_CYCLE,
                    item.ORDER_DATE,
                    item.ORDER_CUTOFF_TIME,
                    item.RECEIVE_DT,
                    item.SALE_DT,
                    item.RECEIVE_OFFSET_HOURS,
                    item.NEXT_ORDER_DT,
                    item.NEXT_RECEIVE_DT,
                    item.NEXT_SALE_DT,
                    item.NEXT_RECEIVE_OFFSET_HOURS,
                    item.START_PERIOD_FORCAST,
                    item.STOP_PREIOD_FORCAST,
                    item.RANGE_PREIOD_FORCAST,
                    item.ORDER_STATUS,
                    item.SEND_ORDER_DT,
                    item.DESTINATION_RECEIVE_STATUS,
                    item.STORE_CREDIT_LIMIT,
                ];
            });

            const insert = await this.orderingRepository.insertOrderGroup(
                list,
                tableName,
            );

            if (insert.error) {
                throw new DatabaseErrorException(insert.error);
            }

            query = await this.orderingRepository.getProductType(
                companyId,
                storeId,
                orderDate,
                tableName,
            );

            if (query.error) {
                throw new DatabaseErrorException(query.error);
            }
        }

        const productType = [
            {
                productTypeCode: '001',
                productTypeName: 'L',
                orderGroupQty: 0,
                orderedQty: 0,
                sentQty: 0,
                status: false,
            },
            {
                productTypeCode: '002',
                productTypeName: 'S',
                orderGroupQty: 0,
                orderedQty: 0,
                sentQty: 0,
                status: false,
            },
            {
                productTypeCode: '003',
                productTypeName: 'U',
                orderGroupQty: 0,
                orderedQty: 0,
                sentQty: 0,
                status: false,
            },
        ];

        query.data[0].forEach((row) => {
            let all = 0;
            let sent = 0;
            let ordered = 0;

            switch (row.destinationReceiveStatus) {
                case 'Y':
                    all = all + row.count;
                    ordered = ordered + row.count;
                    sent = sent + row.count;
                    break;
                default:
                    switch (row.orderStatus) {
                        case 'Y':
                            all = all + row.count;
                            ordered = ordered + row.count;
                            break;
                        default:
                            all = all + row.count;
                    }
            }

            switch (row.orderGroupType1) {
                case 'L':
                    productType[0].orderGroupQty =
                        productType[0].orderGroupQty + all;
                    productType[0].orderedQty =
                        productType[0].orderedQty + ordered;
                    productType[0].sentQty = productType[0].sentQty + sent;
                    break;
                case 'S':
                    productType[1].orderGroupQty =
                        productType[1].orderGroupQty + all;
                    productType[1].orderedQty =
                        productType[1].orderedQty + ordered;
                    productType[1].sentQty = productType[1].sentQty + sent;
                    break;
                case 'U':
                    productType[2].orderGroupQty =
                        productType[2].orderGroupQty + all;
                    productType[2].orderedQty =
                        productType[2].orderedQty + ordered;
                    productType[2].sentQty = productType[2].sentQty + sent;
            }
        });

        if (productType[0].orderGroupQty == productType[0].sentQty) {
            productType[0].status = true;
        }
        if (productType[1].orderGroupQty == productType[1].sentQty) {
            productType[1].status = true;
        }
        if (productType[2].orderGroupQty == productType[2].sentQty) {
            productType[2].status = true;
        }

        const returnData = {
            companyId,
            storeId,
            orderDate,
            productType,
        };

        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: returnData,
            },
        };
    }

    public async saveOrder(
        requestId: string,
        companyId: string,
        body: IBodySaveOrder,
    ): Promise<IResultService<ISaveOrder>> {
        let connection = await this.scriptMysql.getConnection(
            ScriptMysql.getInstance(),
        );

        const tableName =
            'order_group_' +
            String(
                Math.floor((parseInt(body.storeId) - 1) / 1000) + 1,
            ).padStart(3, '0');
        const orderByOrderGroup: IQueryReqSaveOrder[] = [];
        body.orderList.forEach((order: IOrderList) => {
            orderByOrderGroup.push({
                companyId,
                storeId: body.storeId,
                orderDate: body.orderDate,
                ...order,
            });
        });

        await this.scriptMysql.beginTransaction(connection);
        const session = await this.mongoDb.startSession();
        this.mongoDb.startTransaction(session);
        try {
            for (const order of orderByOrderGroup) {
                let hoFileData = '';
                const dataList: any = [];

                const date = new Date();
                const convertedDate = convertDate(order.orderDate);
                const fileName =
                    convertedDate.month + convertedDate.day + order.storeId;
                const orderPattern = createOrderPattern(order.vendorCode);
                const createDate = `${date.getFullYear()}-${String(
                    date.getMonth() + 1,
                ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

                // order.productList.map((product: ISaveOrderProduct) => {
                //     const lineHoFile = `${order.hoDataType}|${order.storeId}|${
                //         convertedDate.convertedDate
                //     }|${order.hoDocNo.padEnd(
                //         10,
                //         ' ',
                //     )}|000001|${product.productCode.padEnd(12, ' ')}|${String(
                //         product.orderQty,
                //     ).padStart(9, '0')}|000000000|${orderPattern}|N|0`;

                //     if (hoFileData === '') hoFileData = hoFileData + lineHoFile;
                //     else hoFileData = hoFileData + '\n' + lineHoFile;

                //     dataList.push({
                //         PROD_CD: product.productCode,
                //         ORDER_QTY: product.orderQty,
                //     });
                // });

                // hoFileData =
                //     hoFileData +
                //     `\ntotalrecord${String(order.productList.length).padStart(
                //         7,
                //         '0',
                //     )}`;

                // const writeHoFileResult = GlobalTo.to(
                //     fs.writeFile(
                //         fileName + '.' + order.hoFileExt,
                //         hoFileData,
                //         'utf8',
                //     ),
                // );

                // if (writeHoFileResult.error) {
                //     throw new WriteFileErrorException(writeHoFileResult.error);
                // }

                // const kafkaMessage = {
                //     cmd: 'update',
                //     version: '1.0.0.1',
                //     createDate,
                //     createTime: `${String(date.getUTCHours()).padStart(
                //         2,
                //         '0',
                //     )}:${String(date.getUTCMinutes() + 1).padStart(
                //         2,
                //         '0',
                //     )}:${String(date.getUTCSeconds()).padStart(2, '0')}`,
                //     lotId: `${date.getFullYear()}${String(
                //         date.getMonth() + 1,
                //     ).padStart(2, '0')}${String(date.getDate()).padStart(
                //         2,
                //         '0',
                //     )}${String(date.getUTCHours()).padStart(2, '0')}${String(
                //         date.getUTCMinutes() + 1,
                //     ).padStart(2, '0')}${String(date.getUTCSeconds()).padStart(
                //         2,
                //         '0',
                //     )}`,
                //     messageSequence: 1,
                //     totalMessages: 1,
                //     conditionDate: date
                //         .toISOString()
                //         .replace('T', ' ')
                //         .replace('Z', ''),
                //     storeId: order.storeId,
                //     source: 'aiorder',
                //     data: {
                //         header: {
                //             STORE_CD: order.storeId,
                //             ORDER_DT: order.orderDate.replace('-', '/'),
                //             VENDOR_CD: order.vendorCode,
                //             EXT_FILE: order.hoFileExt,
                //             ROUND_IND: order.roundInd,
                //         },
                //         dataList: dataList,
                //     },
                // };

                // const writeTxtFileResult = GlobalTo.to(
                //     fs.writeFile(
                //         fileName + '.txt',
                //         JSON.stringify(kafkaMessage),
                //         'utf8',
                //     ),
                // );

                // if (writeTxtFileResult.error) {
                //     throw new WriteFileErrorException(writeTxtFileResult.error);
                // }

                const query = await this.orderingRepository.saveOrder(
                    companyId,
                    order,
                    session,
                );

                if (query.error) {
                    throw new DatabaseErrorException(query.error);
                }

                const updateOrderStatus =
                    await this.orderingRepository.updateOrderStatus(
                        companyId,
                        order.storeId,
                        order.orderGroupCode,
                        order.orderDate,
                        createDate,
                        tableName,
                        connection,
                    );

                if (updateOrderStatus.error) {
                    throw new DatabaseErrorException(updateOrderStatus.error);
                }
            }

            await this.mongoDb.commitTransaction(session);
            await this.scriptMysql.commit(connection);

            return {
                status: 200,
                data: {
                    status: {
                        requestId: requestId,
                        isSuccess: true,
                        code: SUCCESS_CODE.DEFAULT_SUCCESS,
                        message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                    },
                    data: {
                        companyId,
                        storeId: body.storeId,
                        orderDate: body.orderDate,
                        orderReceiptNo: '06281688801',
                        sendDataDateTime: '2023-06-28:16:50:00',
                    },
                },
            };
        } catch (error: any) {
            await this.mongoDb.abortTransaction(session);
            await this.scriptMysql.rollback(connection);
            throw error;
        } finally {
            this.mongoDb.endSession(session);
            this.scriptMysql.release(connection)
        }
    }

    public async getOrderPromotionList(
        requestId: string,
        companyId: string,
        storeId: string,
        orderDate: string,
        orderGroupCode: string,
        productCode: string,
    ): Promise<IResultService<IGetOrderPromotionList>> {
        const query = await this.orderingRepository.getOrderPromotionList(
            companyId,
            storeId,
            orderDate,
            orderGroupCode,
            productCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }

    public async getProductDetail(
        requestId: string,
        companyId: string,
        storeId: string,
        productCode: string,
    ): Promise<IResultService<IGetProductDetail>> {
        const query = await this.orderingRepository.getProductDetail(
            companyId,
            storeId,
            productCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }

    public async getWeatherTemperature(
        requestId: string,
        companyId: string,
        storeId: string,
        productCode: string,
    ): Promise<IResultService<IGetWeatherTemperature>> {
        const query = await this.orderingRepository.getWeatherTemperature(
            companyId,
            storeId,
            productCode,
        );

        if (query.error) {
            throw new DatabaseErrorException(query.error);
        }
        if (query.data.length === 0) {
            throw new NotFoundException({});
        }
        return {
            status: 200,
            data: {
                status: {
                    requestId: requestId,
                    isSuccess: true,
                    code: SUCCESS_CODE.DEFAULT_SUCCESS,
                    message: SUCCESS_MESSAGE.DEFAULT_SUCCESS,
                },
                data: query.data,
            },
        };
    }
}

export default OrderingService;
