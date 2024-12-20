import AWS from "aws-sdk";

interface IConfig {
    region: string,
    accessKey: string,
    secretKey: string
}

class DynamoDbClient {

    private client: AWS.DynamoDB.DocumentClient;
    
    constructor() {
        this.client = new AWS.DynamoDB.DocumentClient();
    }

    public async testConnection() {
        const dynamoDB = new AWS.DynamoDB();

        try {
            const result = await dynamoDB.listTables().promise();
            console.log(result);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async putItem(tableName: string, item: Object): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
        const params = {
            TableName: tableName,
            Item: item,
        };
        try {
            const result = await this.client.put(params).promise();
            return result;
        } catch (error) {
            console.error('Error inserting item:', error);
            throw error;
        }
    }

    public async getItem(tableName: string, key: Object): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
        const params = {
            TableName: tableName,
            Key: key,
        };

        try {
            const result = await this.client.get(params).promise();
            if (result.Item) {
                return [result.Item];
            } else {
                console.log('Item not found');
                return [];
            }
        } catch (error) {
            console.error('Error retrieving item:', error);
            throw error;
        }
    }

    public async queryItems(tableName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
        const params = {
            TableName: tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        try {
            const result = await this.client.query(params).promise();
            return result.Items || [];
        } catch (error) {
            console.error('Error querying items:', error);
            throw error;
        }
    }

    public async deleteItem(tableName: string, key: object): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
        const params = {
            TableName: tableName,
            Key: key,
        };

        try {
            const result = await this.client.delete(params).promise();
            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }


}

export default DynamoDbClient;