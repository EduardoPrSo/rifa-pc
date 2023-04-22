const mysql = require('mysql2/promise');

const database = async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    return connection;
}

export { database };