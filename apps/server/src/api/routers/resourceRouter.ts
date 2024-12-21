import express, { type Request, type Response } from "express";
import { StatusCode } from "../statusCode";
import { z } from "zod";
import prisma from "../../db/db";
import {    
    dynamodbConfigSchema,
    mongodbConfigSchema,
    mysqlConfigSchema,
    postgresConfigSchema,
    redisConfigSchema,
    Resources, 
    verifyToken,
    type Payload} from "../utils";
import { isAuthenticated } from "../middlewares/isAuth";
import PostgresClient from "../../services/postgres";

export const resourceRouter = express.Router();

const loadResourceSchema = z.object({
    name: z.string(),
    type: z.enum([
        Resources.DYNAMODB,
        Resources.MONGODB,
        Resources.MYSQL,
        Resources.POSTGRES,
        Resources.REDIS
    ]),
    config: z.object({
        dynamodb: dynamodbConfigSchema.optional(),
        mongodb: mongodbConfigSchema.optional(),
        mysql: mysqlConfigSchema.optional(),
        postgres: postgresConfigSchema.optional(),
        redis: redisConfigSchema.optional()
    })
})

resourceRouter.post('/loadResource', isAuthenticated, async (req: Request, res: Response) => {
    try {

        const validatedBody = loadResourceSchema.parse(req.body);
        const { config, type, name } = validatedBody;

        let specificConfig;

        switch (type) {
            case Resources.DYNAMODB:
                specificConfig = config.dynamodb;
                break;
            case Resources.MONGODB:
                specificConfig = config.mongodb;
                break;
            case Resources.MYSQL:
                specificConfig = config.mysql;
                break
            case Resources.POSTGRES:
                specificConfig = config.postgres;
                if (!specificConfig) return;
                const pg = new PostgresClient(specificConfig);
                const { connected, message, client } = await pg.connect();
                if (!connected) {
                    res.status(StatusCode.BAD_REQUEST).json({
                        code: StatusCode.BAD_REQUEST,
                        message: "Error in connecting to database",
                        response: message
                    })
                    return;
                }
                client?.release();
                await pg.close();
                break;
            case Resources.REDIS:
                specificConfig = config.redis;
                break;
            default:
                break
        }

        if (!specificConfig) {
            res.status(StatusCode.BAD_REQUEST).json({
                code: StatusCode.BAD_REQUEST,
                message: "BAD_REUQEST",
                response: null
            })
            return;
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token || typeof token !== "string") {
            res.status(StatusCode.UNAUTHORIZED).json({
                code: StatusCode.UNAUTHORIZED,
                message: "Login first",
                response: null
            })
            return;
        }
        const details = verifyToken(token) as Payload;

        const createResource = await prisma.resource.create({
            data: {
                userId: details.userId,
                type: type,
                config: specificConfig,
                name: name
            }
        })

        res.status(StatusCode.OK).json({
            code: StatusCode.OK,
            message: "loaded resource",
            response: createResource
        })

    }  catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            res.status(StatusCode.BAD_REQUEST).json({
                code: StatusCode.BAD_REQUEST,
                message: "BAD_REUQEST",
                response: error
            })
            return;
        }
    
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            code: StatusCode.INTERNAL_SERVER_ERROR,
            message: "INTERNAL_SERVER_ERROR",
            response: error
        })
    
    } finally {
        await prisma.$disconnect();
    }
})