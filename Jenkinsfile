pipeline {
    agent any

    environment {
        DEPLOY_PATH = '/app/service/prep'
        SERVER_PATH = '/app/service/prep/server'
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
                        # 파일 전송
                        rsync -avz --exclude='node_modules' --exclude='.git' \
                            ./ ${SSH_USER}@${SSH_HOST}:${DEPLOY_PATH}/

                        # 서버에서 npm install 및 PM2 재시작
                        ssh ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
                            cd /app/service/prep/server
                            npm install --production
                            pm2 restart prep || pm2 start src/app.js --name prep
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
