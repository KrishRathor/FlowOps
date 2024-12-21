import express, { type Request, type Response } from "express";
import z from "zod";
import { StatusCode } from "../statusCode";
import prisma from "../../db/db";
import { comparePassword, generateToken, hashPassword } from "../utils";

export const userRouter = express.Router();

const signInSchema = z.object({
    email: z.string().email(), 
    password: z.string().min(6),
});

const signUpSchem = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string()
})

userRouter.post('/signin', async (req: Request, res: Response) => {
   try {

    const validatedBody = signInSchema.parse(req.body);
    const { email, password } = validatedBody;

    console.log(email, password);

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (!user) {
        res.status(StatusCode.NOT_FOUND).json({
            code: StatusCode.NOT_FOUND,
            message: "NOT_FOUND",
            response: null
        })
        return;
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
        res.status(StatusCode.UNAUTHORIZED).json({
            code: StatusCode.UNAUTHORIZED,
            message: "Incorrect Password",
            response: null
        })
        return;
    }

    res.status(StatusCode.OK).json({
        code: StatusCode.OK,
        message: "SignIn Successfull",
        response: {
            token: generateToken({
                userId: user.id,
                email: user.email,
                avatar: user.avatar,
                name: user.name
            })
        }
    })

   } catch (error) {
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

userRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const validatedBody = signUpSchem.parse(req.body);
        const { email, password, name } = validatedBody;

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (user) {
            res.status(StatusCode.BAD_REQUEST).json({
                code: StatusCode.BAD_REQUEST,
                message: 'User Already Exists',
                response: null
            })
            return;
        }

        const hashedPassword = await hashPassword(password);

        const createUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        })

        res.status(StatusCode.OK).json({
            code: StatusCode.OK,
            message: 'User Created Successfully',
            response: createUser
        })
        return;

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

