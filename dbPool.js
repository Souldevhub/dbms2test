import { createPool } from "mariadb"

const pool = createPool({
    host: 'anatoliiu2306851.westeurope.cloudapp.azure.com',
    user: 'anatolii',
    password: 'password1',
    database: 'test',
    connectionLimit: 10,
    connectTimeout: 5000,
});
   
pool.getConnection()
.then(conn => {
    console.log('Connected successfully');
    conn.release();
})


export default Object.freeze({
    pool: pool
})