import { MongoClient } from 'mongodb';

interface IMongoConfig {
    uri: string;
    dbName: string;
}

class MongoDBClient {
    private client: MongoClient;
    private dbName: string;

    constructor(config: IMongoConfig) {
        this.client = new MongoClient(config.uri);
        this.dbName = config.dbName;
    }

    public async connect(): Promise<{ client: MongoClient | null; connected: boolean; message: any }> {
        try {
          await this.client.connect();
          return {
            client: this.client,
            connected: true,
            message: `Connected to MongoDB database ${this.dbName}`,
          };
        } catch (error) {
          console.error('Error while connecting to MongoDB:', error);
          return {
            client: null,
            connected: false,
            message: error,
          };
        }
    }

    public async query(collectionName: string, query: object) {
        try {
          const db = this.client.db(this.dbName);
          const collection = db.collection(collectionName);
          const result = await collection.find(query).toArray();
          return result;
        } catch (error) {
          console.error('Error while querying MongoDB:', error);
          throw error;
        }
    }

    public async close(): Promise<void> {
        try {
          await this.client.close();
          console.log('MongoDB connection closed');
        } catch (error) {
          console.error('Error while closing MongoDB connection:', error);
          throw error;
        }
    }

}

export default MongoDBClient;