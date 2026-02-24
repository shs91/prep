const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// 상품 목록 조회
router.get('/products', paymentController.getProducts);

// 결제 요청 (주문 생성)
router.post('/payments', paymentController.createPayment);

// 결제 승인
router.post('/payments/confirm', paymentController.confirmPayment);

// 결제 상태 조회
router.get('/payments/:orderId', paymentController.getPaymentStatus);

module.exports = router;
