pipeline {
  agent any

  environment {
    IMAGE = '03195832603/todoapp'
    TAG   = "v${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Muhammadzeeshsn/Todo_Tasks.git', branch: 'main'
      }
    }

    stage('Build Image') {
      steps {
        script {
          docker.build("${IMAGE}:${TAG}")
        }
      }
    }

    stage('Push Image') {
      steps {
        script {
          docker.withRegistry('', 'dockerhub-creds') {
            docker.image("${IMAGE}:${TAG}").push()
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker compose down || true
          sed -i "s|image:.*|image: ${IMAGE}:${TAG}|" docker-compose.yml
          docker compose up -d
        '''
      }
    }
  }
}
