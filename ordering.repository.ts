import { injectable, inject } from "inversify";
import GlobalTo from "../helpers/to";
import { Result } from "../interfaces/result";
import { OrderingRepositoryImpl } from "../interfaces/ordering-repository-impl";
import {
  IGetOrderingServiceQuery,
  IOrderGroupQueryMM2C,
  IQueryGetProductType,
  IQueryReqSaveOrder,
} from "../interfaces/models/ordering.interface";
import ScriptMysql from "../utils/mysql";
import { TYPES } from "../types";
import {
  GROUP_BY_PRODUCT_TYPE,
  INSERT_ORDER_GROUP,
  SELECT_ORDER_GROUP_LIST,
  SELECT_VENDOR_AVAILABLE_PRODUCT,
  UPDATE_ORDER_STATUS,
} from "../command/mysql";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import OrderedGroup from "../model/ordered-group";
import { ClientSession } from "mongoose";
import { PoolConnection } from "mysql2/promise";
import { SELECT_ORDER_GROUP_MM2C } from "../command/mysqlMM2C";

@injectable()
class OrderingRepository implements OrderingRepositoryImpl {
  constructor(
    @inject(TYPES.scriptMysql)
    private scriptMysql: ScriptMysql
  ) {}

  async getOrderGroupList(
    tableName: string,
    companyId: string,
    storeId: string,
    orderDate: string,
    productType: string
  ): Promise<Result<[IGetOrderingServiceQuery[], ResultSetHeader], Error>> {
    let connection = await this.scriptMysql.getConnection(
      ScriptMysql.getInstance()
    );
    const result = await GlobalTo.to(
      this.scriptMysql.query(
        connection,
        SELECT_ORDER_GROUP_LIST(
          tableName,
          companyId,
          storeId,
          orderDate,
          productType
        )
      )
    );
    this.scriptMysql.release(connection);
    return result;
  }

  async getOrderGroupListMM2C(
    orderDate: string,
    storeId: string
  ): Promise<Result<[IOrderGroupQueryMM2C[], ResultSetHeader], Error>> {
    let connection = await this.scriptMysql.getConnection(
      ScriptMysql.getInstanceMm2c()
    );
    const result = await GlobalTo.to(
      this.scriptMysql.query(
        connection,
        SELECT_ORDER_GROUP_MM2C(orderDate, storeId)
      )
    );

    this.scriptMysql.release(connection);
    return result;
  }

  async insertOrderGroup(
    data: any,
    tableName: string
  ): Promise<Result<[IGetOrderingServiceQuery[], ResultSetHeader], Error>> {
    let connection = await this.scriptMysql.getConnection(
      ScriptMysql.getInstance()
    );
    const result = await GlobalTo.to(
      this.scriptMysql.query(connection, INSERT_ORDER_GROUP(tableName), [data])
    );

    this.scriptMysql.release(connection);
    return result;
  }

  async getOrderProductSupplyUseList(
    companyId: string,
    storeId: string,
    orderDate: string,
    orderGroupCode: string,
    productTypeCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        orderDate: "2023-06-27",
        productTypeCode: "promotion,top,new,normal",
        orderList: [
          {
            orderGroupCode: "FC58603L660500031",
            products: [
              {
                productCode: "9500303",
                productName: "หลอดนม",
                productUnit: "60.00ML.",
                unitCost: 10,
                Order: 5,
              },
              {
                productCode: "9500303",
                productName: "หลอดนม",
                productUnit: "60.00ML.",
                unitCost: 10,
                Order: 5,
              },
            ],
          },
          {
            orderGroupCode: "FC58603L660500032",
            products: [
              {
                productCode: "9500303",
                productName: "หลอดนม",
                productUnit: "60.00ML.",
                unitCost: 10,
                Order: 5,
              },
              {
                productCode: "9500303",
                productName: "หลอดนม",
                productUnit: "60.00ML.",
                unitCost: 10,
                Order: 5,
              },
            ],
          },
        ],
      },
      error: null,
    };
    // return GlobalTo.to('');
  }

  async getOrderProductShortList(
    companyId: string,
    storeId: string,
    orderDate: string,
    orderGroupCode: string,
    productTypeCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: [
        {
          companyId: "1",
          storeId: "16888",
          orderDate: "2023-06-27",
          productTypeCode: "promotion,top,new,normal",
          orderList: [
            {
              orderGroupCode: "FC58603L660500031",
              products: [
                {
                  productCode: "0100001",
                  productName: "ดับเบิ้ลครัวซองค์ไส้กรอกชีส",
                  gondola: "400-01-0001",
                  top: "1-DV",
                  rank: "A",
                  productUnit: "60.00ML.",
                  forecastSale: 2,
                },
                {
                  productCode: "0100002",
                  productName: "โอวัลติน",
                  gondola: "New",
                  top: "1-QC",
                  rank: "B",
                  productUnit: "50.00ML.",
                  forecastSale: null,
                },
              ],
            },
            {
              orderGroupCode: "FC58603L660500032",
              products: [
                {
                  productCode: "2100011",
                  productName: "ข้าวอบขนมแห้ง",
                  gondola: "400-02-0011",
                  top: "2-DV",
                  rank: "A",
                  productUnit: "13.00ML.",
                  forecastSale: 2,
                },
                {
                  productCode: "2100022",
                  productName: "ไส้กรอกชีส",
                  gondola: "400-02-0022",
                  top: "2-QC",
                  rank: "B",
                  productUnit: "6.00ML.",
                  forecastSale: 5,
                },
              ],
            },
          ],
        },
      ],
      error: null,
    };
    // let connection = await this.scriptMysql.getConnection(
    //     ScriptMysql.getInstanceMm2c(),
    // );
    // return await GlobalTo.to(
    //     this.scriptMysql.query(
    //         connection,
    //         SELECT_VENDOR_AVAILABLE_PRODUCT(
    //             storeId,
    //             orderDate,
    //             orderGroupCode,
    //         ),
    //     ),
    // );
  }

  async getOrderProductLongList(
    companyId: string,
    storeId: string,
    orderDate: string,
    orderGroupCode: string,
    productTypeCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        orderDate: "2023-06-27",
        productTypeCode: "promotion,top,new,normal",
        orderList: [
          {
            orderGroupCode: "FC58603L660500031",
            products: [
              {
                productCode: "0100001",
                productName: "ดับเบิ้ลครัวซองค์ไส้กรอกชีส",
                gondola: "612-01-0001",
                top: "1-DV",
                rank: "A",
                productUnit: "60.00ML.",
                forecastSale: 2,
                Meanstock: 3,
                ROP: 3,
                ROPDate: "2023-04-10 03:51:01.450",
                Inventory: 2,
                IO: 2,
                Suggest: 1,
                Order: 5,
              },
              {
                productCode: "0100001",
                productName: "ดับเบิ้ลครัวซองค์ไส้กรอกชีส",
                gondola: "612-01-0001",
                top: "1-DV",
                rank: "A",
                productUnit: "60.00ML.",
                forecastSale: 2,
                Meanstock: 3,
                ROP: 3,
                ROPDate: "2023-04-10 03:51:01.450",
                Inventory: 2,
                IO: 2,
                Suggest: 1,
                Order: 5,
              },
            ],
          },
          {
            orderGroupCode: "FC58603L660500032",
            products: [
              {
                productCode: "0100001",
                productName: "ดับเบิ้ลครัวซองค์ไส้กรอกชีส",
                gondola: "612-01-0001",
                top: "1-DV",
                rank: "A",
                productUnit: "60.00ML.",
                forecastSale: 2,
                Meanstock: 3,
                ROP: 3,
                ROPDate: "2023-04-10 03:51:01.450",
                Inventory: 2,
                IO: 2,
                Suggest: 1,
                Order: 5,
              },
              {
                productCode: "0100001",
                productName: "ดับเบิ้ลครัวซองค์ไส้กรอกชีส",
                gondola: "612-01-0001",
                top: "1-DV",
                rank: "A",
                productUnit: "60.00ML.",
                forecastSale: 2,
                Meanstock: 3,
                ROP: 3,
                ROPDate: "2023-04-10 03:51:01.450",
                Inventory: 2,
                IO: 2,
                Suggest: 1,
                Order: 5,
              },
            ],
          },
        ],
      },
      error: null,
    };
    // return GlobalTo.to('');
  }

  async getForecast4Weeks(
    companyId: string,
    storeId: string,
    orderDate: string,
    orderGroupCode: string,
    productCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        orderDate: "2023-06-28",
        orderGroupCode: "FC58603L660500031",
        saleDate: "2023-06-29",
        endSaleDate: "2023-06-31",
        products: [
          {
            productCode: "0100001",
            forecast: [
              {
                startDate: "2023-06-22",
                endDate: "2023-06-24",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                startDate: "2023-06-15",
                endDate: "2023-06-23",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                startDate: "2023-06-08",
                endDate: "2023-06-16",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                startDate: "2023-06-01",
                endDate: "2023-06-09",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
            ],
          },
        ],
      },
      error: null,
    };
    // return GlobalTo.to('');
  }

  async getForecast7daysPeriod(
    companyId: string,
    storeId: string,
    orderDate: string,
    orderGroupCode: string,
    productCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        orderDate: "2023-06-28",
        orderGroupCode: "FC58603L660500031",
        products: [
          {
            productCode: "0100001",
            forecast: [
              {
                dayDate: "2023-06-26",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                dayDate: "2023-06-25",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                dayDate: "2023-06-24",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                dayDate: "2023-06-23",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                dayDate: "2023-06-22",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                dayDate: "2023-06-21",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
              {
                dayDate: "2023-06-20",
                saleqty: 2,
                Recivetransferqty: 3,
                outofstockqty: 1,
                writeoffReturndiscount: 2,
              },
            ],
          },
        ],
      },
      error: null,
    };
    // return GlobalTo.to('');
  }

  async getProductType(
    companyId: string,
    storeId: string,
    orderDate: string,
    tableName: string
  ): Promise<Result<[IQueryGetProductType[], FieldPacket[]], Error>> {
    const connection = await this.scriptMysql.getConnection(
      ScriptMysql.getInstance()
    );
    const result = await GlobalTo.to(
      this.scriptMysql.query(
        connection,
        GROUP_BY_PRODUCT_TYPE(companyId, storeId, orderDate, tableName)
      )
    );
    this.scriptMysql.release(connection);
    return result;
  }

  async saveOrder(
    companyId: string,
    data: IQueryReqSaveOrder,
    session: ClientSession
  ): Promise<Result<any, Error>> {
    const filter = {
      companyId,
      storeId: data.storeId,
      orderDate: data.orderDate,
      orderGroupCode: data.orderGroupCode,
    };

    let update = {
      $setOnInsert: {
        companyId,
        storeId: data.storeId,
        orderDate: data.orderDate,
        orderGroupCode: data.orderGroupCode,
        vendorCode: data.vendorCode,
        hoFileExt: data.hoFileExt,
        hoDataType: data.hoDataType,
        hoDocNo: data.hoDocNo,
        roundInd: data.roundInd,
      },
      $set: { productList: data.productList },
    };

    const options = {
      upsert: true,
      setDefaultsOnInsert: true,
      session,
    };

    return GlobalTo.to(OrderedGroup.findOneAndUpdate(filter, update, options));
  }

  async updateOrderStatus(
    companyId: string,
    storeId: string,
    orderGroupCode: string,
    orderDate: string,
    sendDate: string,
    tableName: string,
    connection: PoolConnection
  ): Promise<Result<any, Error>> {
    return GlobalTo.to(
      this.scriptMysql.query(
        connection,
        UPDATE_ORDER_STATUS(
          companyId,
          storeId,
          orderGroupCode,
          orderDate,
          sendDate,
          tableName
        )
      )
    );
  }

  async getOrderPromotionList(
    companyId: string,
    storeId: string,
    orderDate: string,
    orderGroupCode: string,
    productCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        orderDate: "2023-06-28",
        orderPromotionList: [
          {
            orderGroupCode: "FC58603L660500031",
            products: [
              {
                productCode: "100001",
                promotionList: [
                  {
                    oldPromotionName: "ซื้อแล้วรวย",
                    effectiveStartDate: "2023-06-20",
                    effectiveEndDate: "2023-06-30",
                    averageSalesQty: 1.76,
                    currentPromotion: [
                      {
                        PromotionName: "ซื้อแล้วรวยกว่า",
                        effectiveStartDate: "2023-07-1",
                        effectiveEndDate: "2023-07-31",
                        averageSalesQty: 1.76,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      error: null,
    };
    // return GlobalTo.to('');
  }

  async getProductDetail(
    companyId: string,
    storeId: string,
    productCode: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        productCode: "0100001",
        unitPrice: 15.0,
        percentGp: 32.0,
        promotion: "P",
        packSize: 1,
        stockMin: 1,
        stockMax: 3,
        age: 15,
        percentWo: 0.0,
      },
      error: null,
    };
    // return GlobalTo.to('');
  }

  async getWeatherTemperature(
    companyId: string,
    storeId: string,
    weatherDate: string
  ): Promise<Result<any, Error>> {
    return {
      data: {
        companyId: "1",
        storeId: "16888",
        weatherDate: "2023-06-30",
        weatherTemperature: [
          {
            weather:
              "https://masterimg-uat.cpall.co.th/image/0100001/0100001.png",
            hitemp: "38",
            lotemp: "34",
          },
        ],
      },
      error: null,
    };
    // return GlobalTo.to('');
  }
}

export { OrderingRepository };
