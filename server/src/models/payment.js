const { pool } = require('../config/database');

/**
 * 주문 생성 (결제 전)
 */
async function createPayment(paymentData) {
    const { orderId, productId, amount, customerName, customerPhone, customerEmail, customerBirth } = paymentData;

    const [result] = await pool.execute(
        `INSERT INTO tb_prep_payments (order_id, product_id, amount, customer_name, customer_phone, customer_email, customer_birth)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, productId, amount, customerName, customerPhone, customerEmail, customerBirth]
    );

    return result.insertId;
}

/**
 * 주문번호로 결제 조회
 */
async function getPaymentByOrderId(orderId) {
    const [rows] = await pool.execute(
        `SELECT p.*, pr.name as product_name
         FROM tb_prep_payments p
         JOIN tb_prep_products pr ON p.product_id = pr.id
         WHERE p.order_id = ?`,
        [orderId]
    );
    return rows[0] || null;
}

/**
 * 결제 승인 완료 업데이트
 */
async function updatePaymentConfirmed(orderId, paymentKey, tossResponse) {
    const [result] = await pool.execute(
        `UPDATE tb_prep_payments
         SET payment_key = ?, status = 'DONE', paid_at = NOW(), toss_response = ?
         WHERE order_id = ?`,
        [paymentKey, JSON.stringify(tossResponse), orderId]
    );
    return result.affectedRows > 0;
}

/**
 * 결제 실패 업데이트
 */
async function updatePaymentFailed(orderId, tossResponse) {
    const [result] = await pool.execute(
        `UPDATE tb_prep_payments
         SET status = 'FAILED', toss_response = ?
         WHERE order_id = ?`,
        [JSON.stringify(tossResponse), orderId]
    );
    return result.affectedRows > 0;
}

/**
 * 결제 취소 업데이트
 */
async function updatePaymentCanceled(orderId, tossResponse) {
    const [result] = await pool.execute(
        `UPDATE tb_prep_payments
         SET status = 'CANCELED', canceled_at = NOW(), toss_response = ?
         WHERE order_id = ?`,
        [JSON.stringify(tossResponse), orderId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    createPayment,
    getPaymentByOrderId,
    updatePaymentConfirmed,
    updatePaymentFailed,
    updatePaymentCanceled
};
