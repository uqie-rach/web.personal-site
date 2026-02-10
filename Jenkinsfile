pipeline {
  agent any

  environment {
    REGISTRY = "uqierach"
    IMAGE = "personal-web"
    TAG = "${env.BUILD_NUMBER}"
    COMPOSE_PATH = "/home/uqie/apps/personal-site"
    DOCKERHUB_CREDS = "2d3f7809-6994-4ef0-a9ad-8dafe2e7cd7b"
    VPS_HOST = "43.133.58.35"
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
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
        }
      }
    }

    stage('Build & Push Image') {
      steps {
        withCredentials([file(credentialsId: 'personal-web-env', variable: 'ENV_FILE')]) {
          sh "cp \$ENV_FILE .env.production" // Copy secret file ke workspace
          sh "docker build -t $REGISTRY/$IMAGE:$TAG ."
        }
      }
    }

    stage('Deploy via SSH') {
      steps {
        sshagent(credentials: ['vps-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no uqie@$VPS_HOST '
              cd $COMPOSE_PATH &&
              
              # 1. Update WEB_TAG di file .env agar state tersimpan permanen
              # Jika WEB_TAG belum ada, command ini tidak akan error jika file .env ada
              sed -i "s/^WEB_TAG=.*/WEB_TAG=$TAG/" .env || echo "WEB_TAG=$TAG" >> .env
              
              # 2. Pull image terbaru yang baru saja di-push
              docker pull $REGISTRY/$IMAGE:$TAG &&
              
              # 3. Jalankan Docker Compose up hanya untuk service web
              # --no-deps: Tidak akan merestart service api/postgres meskipun ada depends_on
              docker compose -f docker-compose.prod.yml up -d --no-deps web
              
              # 4. Cleanup image lama yang tidak terpakai (optional tapi disarankan)
              docker image prune -f
            '
          """
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
    success {
      echo "✅ Deploy web sukses dengan tag ${TAG}"
    }
    failure {
      echo "❌ Deploy web gagal. Cek log pada stage Build atau SSH."
    }
  }
}