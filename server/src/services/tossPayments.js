const axios = require('axios');

const TOSS_API_URL = 'https://api.tosspayments.com/v1';

/**
 * 토스 페이먼츠 결제 승인 요청
 */
async function confirmPayment(paymentKey, orderId, amount) {
    const secretKey = process.env.TOSS_SECRET_KEY;
    const encodedKey = Buffer.from(secretKey + ':').toString('base64');

    try {
        const response = await axios.post(
            `${TOSS_API_URL}/payments/confirm`,
            {
                paymentKey,
                orderId,
                amount
            },
            {
                headers: {
                    'Authorization': `Basic ${encodedKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('토스 결제 승인 오류:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || { message: '결제 승인 중 오류가 발생했습니다.' }
        };
    }
}

/**
 * 결제 취소 요청
 */
async function cancelPayment(paymentKey, cancelReason) {
    const secretKey = process.env.TOSS_SECRET_KEY;
    const encodedKey = Buffer.from(secretKey + ':').toString('base64');

    try {
        const response = await axios.post(
            `${TOSS_API_URL}/payments/${paymentKey}/cancel`,
            {
                cancelReason
            },
            {
                headers: {
                    'Authorization': `Basic ${encodedKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('토스 결제 취소 오류:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || { message: '결제 취소 중 오류가 발생했습니다.' }
        };
    }
}

module.exports = {
    confirmPayment,
    cancelPayment
};
