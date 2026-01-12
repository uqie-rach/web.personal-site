pipeline {
    agent any

    environment {
        REGISTRY = "uqierach"
        IMAGE_NAME = "v3-personal-site"
        TAG = "latest"

        DOCKERHUB_CREDENTIALS = credentials('2d3f7809-6994-4ef0-a9ad-8dafe2e7cd7b')
        VPS_HOST = "210.79.190.57"
        VPS_USER = "uqie"
        SSH_CREDENTIALS = credentials('vps_ssh_bujang_key')

        CONTAINER_NAME = "v3-personal-site"
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                '''
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                sh '''
                    docker build -t $REGISTRY/$IMAGE_NAME:$TAG .
                    docker push $REGISTRY/$IMAGE_NAME:$TAG
                '''
            }
        }

        stage('Deploy to VPS') {
            steps {
                sshagent (credentials: ['vps_ssh_bujang_key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST '
                            docker pull $REGISTRY/$IMAGE_NAME:$TAG &&
                            docker stop $CONTAINER_NAME || true &&
                            docker rm $CONTAINER_NAME || true &&
                            docker run -d --name $CONTAINER_NAME -p 3000:3000 $REGISTRY/$IMAGE_NAME:$TAG
                        '
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker logout
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Successfully built, pushed, and deployed to $VPS_HOST:$APP_PORT"
        }
        failure {
            echo "❌ Pipeline failed — check Jenkins logs for details."
        }
    }
}
