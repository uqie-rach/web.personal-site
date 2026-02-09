pipeline {
  agent any

  environment {
    REGISTRY = "uqierach"
    IMAGE_NAME = "personal-web"
    TAG = "latest"

    DOCKERHUB = credentials('2d3f7809-6994-4ef0-a9ad-8dafe2e7cd7b')

    VPS_USER = "uqie"
    VPS_HOST = "43.133.58.35"
    SSH_KEY  = "vps_ssh_uqie_key"

    APP_DIR = "/personal-site"
    SERVICE = "web"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Docker Login') {
      steps {
        sh '''
          echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin
        '''
      }
    }

    stage('Build & Push Image') {
      steps {
        sh '''
          docker build -t $REGISTRY/$IMAGE_NAME:$TAG .
          docker push $REGISTRY/$IMAGE_NAME:$TAG
        '''
      }
    }

    stage('Deploy Web') {
      steps {
        sh """
            cd /home/uqie/apps/personal-site
            docker compose pull web
            docker compose up -d web
        """
      }
    }
  }

  post {
    success {
      echo "✅ Web deployed successfully"
    }
    failure {
      echo "❌ Web deployment failed"
    }
  }
}
