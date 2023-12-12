import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import {
    GetForecast4WeeksSchema,
    GetOrderGroupListSchema,
    GetOrderProductShortListSchema,
    GetOrderProductSupplyUseListSchema,
    GetProductDetailSchema,
    GetProductTypeSchema,
    GetWeatherTemperatureSchema,
    SaveOrderSchema,
} from '../../schema/ordering.schema';
import ValidateSchema from '../../middlewares/validate-schema';
import OrderingService from '../../services/ordering.service';
import { IBodySaveOrder } from '../../interfaces/models/ordering.interface';

@injectable()
class OrderingController implements Controller {
    path: string = '/ordering-service';
    router: Router = Router();

    constructor(
        @inject(TYPES.orderingService)
        private orderingService: OrderingService,
    ) {
        this.initRouter();
    }
    private initRouter() {
        this.router.get(
            '/order-group',
            ValidateSchema(GetOrderGroupListSchema),
            this.getOrderGroupList.bind(this),
        );
        this.router.get(
            '/order-product-supply',
            ValidateSchema(GetOrderProductSupplyUseListSchema),
            this.getOrderProductSupplyUseList.bind(this),
        );
        this.router.get(
            '/order-product-short',
            ValidateSchema(GetOrderProductShortListSchema),
            this.getOrderProductShortList.bind(this),
        );
        this.router.get(
            '/order-product-long',
            ValidateSchema(GetOrderProductSupplyUseListSchema),
            this.getOrderProductLongList.bind(this),
        );
        this.router.get(
            '/forecast4weeks',
            ValidateSchema(GetForecast4WeeksSchema),
            this.getForecast4Weeks.bind(this),
        );
        this.router.get(
            '/forecast7daysPeriod',
            ValidateSchema(GetForecast4WeeksSchema),
            this.getForecast7daysPeriod.bind(this),
        );
        this.router.get(
            '/product-type',
            ValidateSchema(GetProductTypeSchema),
            this.getProductType.bind(this),
        );
        this.router.post(
            '/save-order',
            ValidateSchema(SaveOrderSchema),
            this.saveOrder.bind(this),
        );
        this.router.get(
            '/order-promotion',
            ValidateSchema(GetForecast4WeeksSchema),
            this.getOrderPromotionList.bind(this),
        );
        this.router.get(
            '/get-product-detail',
            ValidateSchema(GetProductDetailSchema),
            this.getProductDetail.bind(this),
        );
        this.router.get(
            '/weather-temperature',
            ValidateSchema(GetWeatherTemperatureSchema),
            this.getWeatherTemperature.bind(this),
        );
    }

    private async getOrderGroupList(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const productType: string = req.query.productType as string;

            const requestId: string = req.requestId;
            const result = await this.orderingService.getOrderGroupList(
                requestId,
                companyId,
                storeId,
                orderDate,
                productType,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getOrderProductSupplyUseList(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const orderGroupCode: string = req.query.orderGroupCode as string;
            const productTypeCode: string = req.query
                .productTypeCode as string;

            const requestId: string = req.requestId;

            const result =
                await this.orderingService.getOrderProductSupplyUseList(
                    requestId,
                    companyId,
                    storeId,
                    orderDate,
                    orderGroupCode,
                    productTypeCode,
                );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getOrderProductShortList(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const orderGroupCode: string = req.query.orderGroupCode as string;
            const productTypeCode: string = req.query
                .productTypeCode as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getOrderProductShortList(
                requestId,
                companyId,
                storeId,
                orderDate,
                orderGroupCode,
                productTypeCode,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getOrderProductLongList(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const orderGroupCode: string = req.query.orderGroupCode as string;
            const productTypeCode: string = req.query
                .productTypeCode as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getOrderProductLongList(
                requestId,
                companyId,
                storeId,
                orderDate,
                orderGroupCode,
                productTypeCode,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getForecast4Weeks(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const orderGroupCode: string = req.query.orderGroupCode as string;
            const productCode: string = req.query.productCode as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getForecast4Weeks(
                requestId,
                companyId,
                storeId,
                orderDate,
                orderGroupCode,
                productCode,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getForecast7daysPeriod(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const orderGroupCode: string = req.query.orderGroupCode as string;
            const productCode: string = req.query.productCode as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getForecast7daysPeriod(
                requestId,
                companyId,
                storeId,
                orderDate,
                orderGroupCode,
                productCode,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getProductType(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const requestId: string = req.requestId;

            const result = await this.orderingService.getProductType(
                requestId,
                companyId,
                storeId,
                orderDate,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async saveOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const body: IBodySaveOrder = req.body;
            const requestId: string = req.requestId;

            const result = await this.orderingService.saveOrder(
                requestId,
                companyId,
                body,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getOrderPromotionList(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const orderDate: string = req.query.orderDate as string;
            const orderGroupCode: string = req.query.orderGroupCode as string;
            const productCode: string = req.query.productCode as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getOrderPromotionList(
                requestId,
                companyId,
                storeId,
                orderDate,
                orderGroupCode,
                productCode,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getProductDetail(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const productCode: string = req.query.productCode as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getProductDetail(
                requestId,
                companyId,
                storeId,
                productCode,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }

    private async getWeatherTemperature(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const companyId: string = req.headers['company-id'] as string;
            const storeId: string = req.query.storeId as string;
            const weatherDate: string = req.query.weatherDate as string;

            const requestId: string = req.requestId;

            const result = await this.orderingService.getWeatherTemperature(
                requestId,
                companyId,
                storeId,
                weatherDate,
            );

            res.status(result.status).send(result.data);
        } catch (error) {
            next(error);
        }
    }
}

export default OrderingController;
