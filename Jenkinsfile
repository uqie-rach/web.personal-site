pipeline {
  agent any

  environment {
    REGISTRY = "uqierach"
    IMAGE = "personal-web"
    TAG = "${env.BUILD_NUMBER}"
    COMPOSE_PATH = "/home/uqie/apps/personal-site"
  }

  stages {
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
