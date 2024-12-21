import express, { type Request, type Response } from "express";
import { isAuthenticated } from "../middlewares/isAuth";
import { StatusCode } from "../statusCode";
import { z } from "zod";
import prisma from "../../db/db";
import { StepType, verifyToken, type Payload } from "../utils";

export const workflowRouter = express.Router();


const createWorkflowSchema = z.object({
    name: z.string(),
    description: z.string(),
    steps: z.array(z.object({
        config: z.any(),
        steptype: z.enum([
            StepType.BRANCH,
            StepType.EXECUTE_QUERY,
            StepType.SEND_EMAIL,
            StepType.SLACK_MESSAGE,
            StepType.REDIS,
            StepType.DYNAMODB,
            StepType.HTTP,
            StepType.AI
        ])
    }))
})

workflowRouter.post('/create', isAuthenticated, async (req: Request, res: Response) => {
    try {

        const validatedBody = createWorkflowSchema.parse(req.body);
        const {
            steps,
            name,
            description
        } = validatedBody;

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(StatusCode.UNAUTHORIZED).json({
                code: StatusCode.UNAUTHORIZED,
                message: "Please login first",
                response: null
            })
            return;
        }

        const verifiedToken = verifyToken(token) as Payload;

        const createWorkflow = await prisma.workflow.create({
            data: {
                name: name,
                description: description,
                userId: verifiedToken.userId
            }
        })

        const workflowId = createWorkflow.id;

        Promise.all(
            steps.map(async (step, index) => {
                const { steptype, config } = step;
                await prisma.workflowStep.create({
                    data: {
                    workflowId: workflowId,
                    config: config,
                    type: steptype,
                    order: index
                    }
                });
            })
        );

        res.status(StatusCode.OK).json({
            code: StatusCode.OK,
            message: "Created Workflow",
            response: createWorkflow
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


workflowRouter.get('/execute', isAuthenticated, async (req: Request, res: Response) => {
    try {

        const workflowId = req.query.id;

        if (!workflowId || typeof workflowId !== "string") {
            res.status(StatusCode.BAD_REQUEST).json({
                code: StatusCode.BAD_REQUEST,
                message: "No Workflow Id Present or incorrect datatype for workflowid",
                response: null
            })
            return;
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId
            }
        })

        if (!workflow) {
            res.status(StatusCode.BAD_REQUEST).json({
                code: StatusCode.BAD_REQUEST,
                message: "Invalid Workflow Id",
                response: null
            })
            return;
        }

        const getAllSteps = await prisma.workflowStep.findMany({
            where: {
                workflowId: workflow.id
            },
            orderBy: { order: 'asc' }
        })

        const results: any[] = []

        getAllSteps.map(step => {

            const { type, config, order } = step;

            let stepResult;

            switch (type) {
                case 'AI':
                    break

                case 'BRANCH':
                    break

                case 'DYNAMODB':
                    break
                
                case 'EXECUTE_QUERY':
                    break

                case "SEND_EMAIL":
                    break

                case "SLACK_MESSAGE":
                    break

                case "REDIS":
                    break

                case "HTTP":
                    break

                default:
                    throw new Error(`Unknown error type ${type}`)
            }

            results.push({ stepId: step.id, result: stepResult });

        })

    }   catch (error) {
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