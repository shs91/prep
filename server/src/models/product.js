const { pool } = require('../config/database');

/**
 * 모든 활성 상품 조회
 */
async function getAllActiveProducts() {
    const [rows] = await pool.execute(
        'SELECT id, name, price, description FROM products WHERE is_active = TRUE ORDER BY id'
    );
    return rows;
}

/**
 * 상품 ID로 조회
 */
async function getProductById(id) {
    const [rows] = await pool.execute(
        'SELECT id, name, price, description FROM products WHERE id = ? AND is_active = TRUE',
        [id]
    );
    return rows[0] || null;
}

module.exports = {
    getAllActiveProducts,
    getProductById
};
