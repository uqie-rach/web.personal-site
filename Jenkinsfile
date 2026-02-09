pipeline {
  agent any

  environment {
    REGISTRY = "uqierach"
    IMAGE = "personal-web"
    TAG = "${env.BUILD_NUMBER}"
    COMPOSE_PATH = "/home/uqie/apps/personal-site"

    DOCKERHUB_CREDENTIALS = credentials('2d3f7809-6994-4ef0-a9ad-8dafe2e7cd7b')
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
                echo "$DOCKERHUB_CREDENTIALS_PSW" | \
                docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
            '''
        }
    }

    stage('Build & Push') {
      steps {
        sh """
          docker build -t $REGISTRY/$IMAGE:$TAG .
          docker push $REGISTRY/$IMAGE:$TAG
        """
      }
    }

    stage('Deploy') {
      steps {
        sh """
          cd $COMPOSE_PATH
          export WEB_TAG=$TAG
          docker compose -f docker-compose.prod.yml pull web
          docker compose -f docker-compose.prod.yml up -d web
        """
      }
    }
  }
}
