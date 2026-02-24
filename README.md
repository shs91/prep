# Prep 결제 모듈

토스페이먼츠 연동 결제 모듈

## 서버 환경 설정 (115.68.179.155)

### 1. 필수 패키지 설치

```bash
# Git 설치
sudo yum install -y git

# Node.js 20.x 설치
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# 설치 확인
git --version
node --version
npm --version
pm2 --version
```

### 2. 배포 디렉토리 생성

```bash
sudo mkdir -p /app/service/prep
sudo chown -R ec2-user:ec2-user /app/service/prep
```

### 3. 환경 변수 설정

```bash
cp /app/service/prep/server/.env.example /app/service/prep/server/.env
vi /app/service/prep/server/.env
```

```env
# 서버
PORT=3000
NODE_ENV=production

# MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_USER=prep
DB_PASSWORD=your_password
DB_NAME=prep

# 토스 페이먼츠
TOSS_CLIENT_KEY=your_client_key
TOSS_SECRET_KEY=your_secret_key

# 이메일 (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Nginx 설정

기존 nginx 설정 파일에 아래 location 블록 추가:

```nginx
server {
    listen 80;
    server_name 115.68.179.155;

    # ... 기존 설정 (jenkins, n8n 등) ...

    # Prep 정적 파일 (CSS)
    location /prep/css/ {
        alias /app/service/prep/css/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Prep 정적 파일 (JS)
    location /prep/js/ {
        alias /app/service/prep/js/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Prep 정적 파일 (이미지)
    location /prep/images/ {
        alias /app/service/prep/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Prep API (Node.js 서버로 프록시)
    location /prep/api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Prep 메인 페이지
    location /prep/ {
        alias /app/service/prep/;
        index index.html;
        try_files $uri $uri/ /prep/index.html;
    }
}
```

### Nginx 설정 적용

```bash
# 설정 테스트
sudo nginx -t

# 설정 적용
sudo systemctl reload nginx
```

## PM2 설정

### 서버 시작

```bash
cd /app/service/prep/server
pm2 start src/app.js --name prep
```

### PM2 명령어

```bash
# 상태 확인
pm2 status

# 로그 확인
pm2 logs prep

# 재시작
pm2 restart prep

# 중지
pm2 stop prep

# 서버 재부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

## CI/CD (Jenkins)

develop 브랜치에 push하면 자동 배포됩니다.

### 배포 흐름
1. GitHub develop 브랜치 push
2. Jenkins Webhook 트리거
3. 서버에서 git pull
4. npm install
5. PM2 재시작

## 로컬 개발

```bash
cd server
npm install
npm run dev
```
