import { ConnectionPool, type IResult } from "mssql"

interface IConfig {
    server: string,
    port: number,
    user: string,
    password: string,
    database: string
}

interface IConnectResponse {
    client: ConnectionPool | null,
    connected: boolean,
    message: string | any
}

class MySqlClient {

    private pool: ConnectionPool | null = null;
    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
    }

    public async connect(): Promise<IConnectResponse> {
        try {
            this.pool = await new ConnectionPool(this.config);
            await this.pool.connect()
            return {
                client: this.pool,
                connected: true,
                message: 'Connected'
            };
        } catch (error) {
            console.log(`Error while connecting to the database: ${error}`);
            return {
                client: null,
                connected: false,
                message: error
            };
        }
    }

    public async query(queryText: string) {
        if (!this.pool) {
            throw new Error("Not connected to the database");
        }

        try {
            const connection = await this.pool.request().query(queryText);
            const result = connection.output;
            console.log(result);
        } catch (error) {
            console.log(`Error while querying database: ${error}`);
            throw error;
        }
    }

    public async close(): Promise<void> {
        if (this.pool) {
            await this.pool.close();
            console.log(`Connection with SQL Server closed!!`);
        }
    }

}

export default MySqlClient;