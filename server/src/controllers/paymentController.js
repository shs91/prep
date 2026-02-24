const productModel = require('../models/product');
const paymentModel = require('../models/payment');
const tossPayments = require('../services/tossPayments');
const emailService = require('../services/emailService');

/**
 * 상품 목록 조회
 */
async function getProducts(req, res, next) {
    try {
        const products = await productModel.getAllActiveProducts();
        res.json({ success: true, products });
    } catch (error) {
        next(error);
    }
}

/**
 * 결제 요청 (주문 생성)
 */
async function createPayment(req, res, next) {
    try {
        const { productId, customerName, customerPhone, customerEmail, customerBirth } = req.body;

        // 필수 필드 검증
        if (!productId || !customerName || !customerPhone || !customerEmail || !customerBirth) {
            return res.status(400).json({
                success: false,
                message: '필수 정보를 모두 입력해주세요.'
            });
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            return res.status(400).json({
                success: false,
                message: '올바른 이메일 주소를 입력해주세요.'
            });
        }

        // 전화번호 형식 검증
        const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
        if (!phoneRegex.test(customerPhone.replace(/-/g, ''))) {
            return res.status(400).json({
                success: false,
                message: '올바른 휴대폰 번호를 입력해주세요.'
            });
        }

        // 상품 조회
        const product = await productModel.getProductById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '상품을 찾을 수 없습니다.'
            });
        }

        // 주문번호 생성
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // 주문 저장
        await paymentModel.createPayment({
            orderId,
            productId,
            amount: product.price,
            customerName,
            customerPhone,
            customerEmail,
            customerBirth
        });

        res.json({
            success: true,
            orderId,
            amount: product.price,
            orderName: product.name
        });
    } catch (error) {
        next(error);
    }
}

/**
 * 결제 승인
 */
async function confirmPayment(req, res, next) {
    try {
        const { paymentKey, orderId, amount } = req.body;

        // 필수 필드 검증
        if (!paymentKey || !orderId || !amount) {
            return res.status(400).json({
                success: false,
                message: '결제 정보가 올바르지 않습니다.'
            });
        }

        // 주문 정보 조회
        const payment = await paymentModel.getPaymentByOrderId(orderId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: '주문 정보를 찾을 수 없습니다.'
            });
        }

        // 금액 검증
        if (payment.amount !== parseInt(amount)) {
            return res.status(400).json({
                success: false,
                message: '결제 금액이 일치하지 않습니다.'
            });
        }

        // 이미 처리된 결제인지 확인
        if (payment.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: '이미 처리된 결제입니다.'
            });
        }

        // 토스 페이먼츠 결제 승인
        const result = await tossPayments.confirmPayment(paymentKey, orderId, parseInt(amount));

        if (!result.success) {
            await paymentModel.updatePaymentFailed(orderId, result.error);
            return res.status(400).json({
                success: false,
                message: result.error.message || '결제 승인에 실패했습니다.'
            });
        }

        // 결제 완료 업데이트
        await paymentModel.updatePaymentConfirmed(orderId, paymentKey, result.data);

        // 이메일 발송 (비동기 - 실패해도 결제는 성공 처리)
        emailService.sendPaymentConfirmationEmail({
            customerName: payment.customer_name,
            customerEmail: payment.customer_email,
            productName: payment.product_name,
            amount: payment.amount,
            orderId,
            paidAt: new Date()
        }).catch(err => console.error('이메일 발송 실패:', err));

        res.json({
            success: true,
            message: '결제가 완료되었습니다.'
        });
    } catch (error) {
        next(error);
    }
}

/**
 * 결제 상태 조회
 */
async function getPaymentStatus(req, res, next) {
    try {
        const { orderId } = req.params;

        const payment = await paymentModel.getPaymentByOrderId(orderId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: '주문 정보를 찾을 수 없습니다.'
            });
        }

        res.json({
            success: true,
            payment: {
                orderId: payment.order_id,
                productName: payment.product_name,
                amount: payment.amount,
                status: payment.status,
                customerName: payment.customer_name,
                paidAt: payment.paid_at
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts,
    createPayment,
    confirmPayment,
    getPaymentStatus
};
