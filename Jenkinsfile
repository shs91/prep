pipeline {
    agent any

    environment {
        DEPLOY_PATH = '/var/www/prep'
        SERVER_PATH = '/var/www/prep/server'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('server') {
                    sh 'npm install --production'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    # 프론트엔드 파일 배포
                    sudo mkdir -p ${DEPLOY_PATH}
                    sudo cp -r index.html payment.html payment-success.html payment-fail.html ${DEPLOY_PATH}/
                    sudo cp -r css js images ${DEPLOY_PATH}/ 2>/dev/null || true
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    # 백엔드 배포
                    sudo mkdir -p ${SERVER_PATH}
                    sudo cp -r server/src server/package.json server/package-lock.json ${SERVER_PATH}/

                    # PM2로 서버 재시작
                    cd ${SERVER_PATH}
                    sudo npm install --production
                    pm2 restart prep || pm2 start src/app.js --name prep
                '''
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
