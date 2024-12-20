import MongoDBClient from "./services/mongodb";

const main = async () => {
    const mongoClient = new MongoDBClient({
      uri: 'mongodb://localhost:27017',
      dbName: 'test',
    });
  
    try {
      const connection = await mongoClient.connect();
      console.log(connection.message);
  
      // Query example
      const result = await mongoClient.query('users', { name: 'John Doe' });
      console.log('Query Result:', result);
  
      await mongoClient.close();
    } catch (error) {
      console.error(error);
    }
  };
  
  main();
  