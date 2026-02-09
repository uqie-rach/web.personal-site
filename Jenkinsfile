pipeline {
  agent any

  environment {
    REGISTRY = "uqierach"
    IMAGE = "personal-web"
    TAG = "${env.BUILD_NUMBER}"
    COMPOSE_PATH = "/home/uqie/apps/personal-site"
    DOCKERHUB_CREDS = "2d3f7809-6994-4ef0-a9ad-8dafe2e7cd7b"
  }

  stages {
    stage('Docker Login') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: DOCKERHUB_CREDS,
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )
        ]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
          '''
        }
      }
    }

    stage('Build Image') {
      steps {
        sh '''
          docker build -t $REGISTRY/$IMAGE:$TAG .
        '''
      }
    }

    stage('Push Image') {
      steps {
        sh '''
          docker push $REGISTRY/$IMAGE:$TAG
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          cd $COMPOSE_PATH
          export WEB_TAG=$TAG
          docker compose -f docker-compose.prod.yml pull web
          docker compose -f docker-compose.prod.yml up -d web
        '''
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }

    success {
      echo "Deploy web sukses dengan tag ${TAG}"
    }

    failure {
      echo "Deploy web gagal. Cek stage Docker Login atau Push."
    }
  }
}
