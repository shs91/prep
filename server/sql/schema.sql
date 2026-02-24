-- Prep 결제 모듈 데이터베이스 스키마
-- 실행: mysql -u root -p prep < schema.sql

CREATE TABLE IF NOT EXISTS tb_prep_products (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '상품 ID',
    name VARCHAR(200) NOT NULL COMMENT '상품명 (강의명)',
    price INT NOT NULL COMMENT '가격',
    description TEXT COMMENT '상품 설명',
    is_active BOOLEAN DEFAULT TRUE COMMENT '판매 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시'
) COMMENT '상품 테이블';

CREATE TABLE IF NOT EXISTS tb_prep_payments (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '결제 ID',
    order_id VARCHAR(64) NOT NULL UNIQUE COMMENT '주문번호 (토스용)',
    payment_key VARCHAR(200) COMMENT '토스 결제키',
    product_id INT NOT NULL COMMENT '상품 ID',
    amount INT NOT NULL COMMENT '결제 금액',
    customer_name VARCHAR(50) NOT NULL COMMENT '고객 이름',
    customer_phone VARCHAR(20) NOT NULL COMMENT '고객 휴대폰번호',
    customer_email VARCHAR(100) NOT NULL COMMENT '고객 이메일',
    customer_birth VARCHAR(10) NOT NULL COMMENT '고객 생년월일 (YYYY-MM-DD)',
    status ENUM(
        'PENDING',
        'DONE',
        'CANCELED',
        'FAILED'
    ) DEFAULT 'PENDING' COMMENT '결제 상태',
    paid_at TIMESTAMP NULL COMMENT '결제 완료 시간',
    canceled_at TIMESTAMP NULL COMMENT '취소 시간',
    toss_response JSON COMMENT '토스 API 응답 전체 저장',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    FOREIGN KEY (product_id) REFERENCES products (id)
) COMMENT '결제 테이블';

-- 인덱스
CREATE INDEX idx_payments_status ON tb_prep_payments (status);

CREATE INDEX idx_payments_email ON tb_prep_payments (customer_email);

CREATE INDEX idx_payments_phone ON tb_prep_payments (customer_phone);

-- 샘플 상품 데이터
INSERT INTO
    tb_prep_products (name, price, description)
VALUES (
        '웹개발 기초 강의',
        50000,
        'HTML, CSS, JavaScript 기초부터 실전 프로젝트까지'
    ),
    (
        'React 완벽 가이드',
        80000,
        'React 18 최신 기능과 실무 패턴 학습'
    ),
    (
        'Node.js 백엔드 마스터',
        70000,
        'Express, MongoDB, REST API 구축 완벽 가이드'
    );