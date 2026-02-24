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
                            cd /app/service/prep

                            # Git pull
                            if [ -d ".git" ]; then
                                git pull origin develop
                            else
                                git clone -b develop https://github.com/shs91/prep.git .
                            fi

                            # npm install 및 PM2 재시작
                            cd /app/service/prep/server
                            npm install --production
                            pm2 restart prep || pm2 start /app/service/prep/server/src/app.js --name prep
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
