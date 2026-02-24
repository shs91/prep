-- Prep 데이터베이스 및 사용자 초기화
-- 실행: mysql -u root -p < init.sql

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS prep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 (비밀번호는 실제 운영 환경에서 변경 필요)
CREATE USER IF NOT EXISTS 'prep' @'localhost' IDENTIFIED BY 'prep1234!';

-- 권한 부여
GRANT ALL PRIVILEGES ON prep.* TO 'prep' @'localhost';

-- 권한 적용
FLUSH PRIVILEGES;

-- 확인
SHOW GRANTS FOR 'prep' @'localhost';