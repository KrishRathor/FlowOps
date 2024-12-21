import { z } from "zod";
import { postgresConfigSchema, SQLDatabases } from "../../api/utils";
import prisma from "../../db/db";
import PostgresClient from "../../services/postgres";

const executeQueryConfigSchema = z.object({
    query: z.string(),
    database: z.enum([
        SQLDatabases.MYSQL,
        SQLDatabases.POSTGRES
    ]),
    name: z.string()
})



export const executeQuery = async (config: any, userId: string) => {
    try {
        const validatedConfig = executeQueryConfigSchema.parse(config);

        const { query, database, name } = validatedConfig;

        const resources = await prisma.resource.findMany({
            where: {
                userId: userId
            }
        })

        const requiredResource = resources.find(resource => resource.name === name);
        if (!requiredResource) {
            return {
                response: 'No Resource found',
                next: false
            }
        }

        switch (database) {
            case SQLDatabases.POSTGRES:
                const { config } = requiredResource;
                const validatedPostgresConfig = postgresConfigSchema.parse(config);

                const pg = new PostgresClient(validatedPostgresConfig);
                const { connected, client, message } = await pg.connect();
                if (!connected) {
                    return {
                        message: `Can't connect to postgres db`
                    }
                }
                const result = await pg.query(query);
                client?.release();
                await pg.close();

                return {
                    message: result
                }

            case SQLDatabases.MYSQL:
                break
            
            default:
                throw new Error(`No Database of Type ${database}`);
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                response: 'Inavlid config type',
                next: false
            }
        }
    } finally {
        await prisma.$disconnect();
    }
}