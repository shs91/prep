pipeline {
    agent any

    environment {
        DEPLOY_PATH = '/app/service/prep'
        SSH_HOST = '115.68.179.155'
        SSH_USER = 'ec2-user'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['prep-dev-deploy-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
                            set -e

                            DEPLOY_PATH=/app/service/prep

                            # .git 폴더 존재 여부로 판단
                            if [ -d "$DEPLOY_PATH/.git" ]; then
                                cd $DEPLOY_PATH
                                git fetch origin
                                git reset --hard origin/develop
                            else
                                # 디렉토리 정리 후 clone
                                rm -rf $DEPLOY_PATH/*
                                rm -rf $DEPLOY_PATH/.* 2>/dev/null || true
                                git clone -b develop https://github.com/shs91/prep.git $DEPLOY_PATH
                            fi

                            # .env 파일 생성
                            cat > $DEPLOY_PATH/server/.env << 'ENVEOF'
# 서버
PORT=3001
NODE_ENV=development

# MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_USER=dwmaster
DB_PASSWORD=aws190131!
DB_NAME=riseone

# 토스 페이먼츠
TOSS_CLIENT_KEY=test_ck_jExPeJWYVQxQJlloAjJo349R5gvN
TOSS_SECRET_KEY=test_sk_vZnjEJeQVxGXqW9LJvlD3PmOoBN0

# 이메일 (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=eomgevent@gmail.com
SMTP_PASS=gfkbxpefmhkanlug
ENVEOF

                            # npm install 및 PM2 재시작
                            cd $DEPLOY_PATH/server
                            npm install --omit=dev
                            pm2 restart prep || pm2 start $DEPLOY_PATH/server/src/app.js --name prep
ENDSSH
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '배포 성공!'
        }
        failure {
            echo '배포 실패!'
        }
    }
}
