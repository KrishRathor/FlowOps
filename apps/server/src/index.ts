import PostgresClient from "./services/postgres"

const main = async () => {

    const pg = new PostgresClient({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'password',
        database: 'test'
    });

    
    let connect;
    try {
        connect = await pg.connect();
    } catch (error) {
        console.log(error);
    } finally {   
        connect?.client?.release();
        await pg.close()
    }

}

main()