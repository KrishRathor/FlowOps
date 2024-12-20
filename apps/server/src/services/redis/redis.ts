import Redis, { Redis as RedisClient } from "ioredis";

interface IConfig {
    host: string,
    port: number,
    username?: string,
    password?: string,
    db?: number,
}

interface IConnectResponse {
    client: RedisClient | null,
    connected: boolean,
    message: string | any
}

class RedisClientWrapper {
    private client: RedisClient;
    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
        this.client = new RedisClient(config);
    }

    public async connect(): Promise<IConnectResponse> {
        try {
            await this.client.connect();
            return {
                client: this.client,
                connected: true,
                message: 'Connected to Redis',
            };
        } catch (error) {
            console.error(`Error while connecting to Redis: ${error}`);
            return {
                client: null,
                connected: false,
                message: error,
            };
        }
    }

    public async set(key: string, value: string): Promise<void> {
        try {
            await this.client.set(key, value);
        } catch (error) {
            console.error(`Error setting key in Redis: ${error}`);
            throw error;
        }
    }

    public async get(key: string): Promise<string | null> {
        try {
            const value = await this.client.get(key);
            return value;
        } catch (error) {
            console.error(`Error getting key from Redis: ${error}`);
            throw error;
        }
    }

    public async testConnection(): Promise<boolean> {
        try {
            const pong = await this.client.ping();
            console.log('Redis connection test successful:', pong);
            return pong === 'PONG';
        } catch (error) {
            console.error('Error testing Redis connection:', error);
            return false;
        }
    }

    public async close(): Promise<void> {
        try {
            await this.client.quit();
            console.log('Connection with Redis closed');
        } catch (error) {
            console.error(`Error while closing Redis connection: ${error}`);
            throw error;
        }
    }
}

export default RedisClientWrapper;