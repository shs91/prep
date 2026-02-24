const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'riseone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 연결 테스트
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('MariaDB 연결 성공');
        connection.release();
        return true;
    } catch (error) {
        console.error('MariaDB 연결 실패:', error.message);
        return false;
    }
}

module.exports = { pool, testConnection };
