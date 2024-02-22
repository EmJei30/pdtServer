const sql = require('mssql');

// Define your database configuration
const config = {
  user: 'crystalviewer',
  password: 'crystalviewer',
  server: '192.168.92.3', // IP address of the SQL Server
  database: 'B2020_DynaAX2012R3_CU12_LIVE',
  options: {
    encrypt: false, // Disable encryption
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch((error) => {
    console.error('Error connecting to SQL Server:', error);
  });

module.exports = {
  poolConnect,
  pool,
  sql,
};