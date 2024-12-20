import { Pool, type PoolClient, type QueryResult } from "pg";

interface IConfig {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
}

interface IConnectResponse {
    client: PoolClient | null,
    connected: boolean,
    message: string | any
}

class PostgresClient {
    private pool: Pool;

    constructor(config: IConfig) {
        this.pool = new Pool(config);
    }

    public async connect(): Promise<IConnectResponse> {
        try {
            const client = await this.pool.connect();
            return {
                client: client,
                connected: true,
                message: 'Connected'
            }
        } catch (error) {
            console.log(`Error while connecting to databse ${error}`);
            return {
                client: null,
                connected: false,
                message: error
            }
        }
    }

    public async query(text: string, params?: any[]): Promise<QueryResult> {
        try {
            return await this.pool.query(text, params);
        } catch (error) {
            console.log(`Error while querying database: ${error}`);
            throw error
        }
    }

    public async close(): Promise<void> {
        try {
            await this.pool.end();
            console.log(`Connection with Postgres closed!!`);
        } catch (error) {
            console.log(`Error while closing the databse ${error}`);
            throw error;
        }
    }

}

export default PostgresClient;