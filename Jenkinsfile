pipeline {
  agent any

  environment {
    // no need for IMAGE or TAG since we build & deploy locally
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Muhammadzeeshsn/Todo_Tasks.git', branch: 'main'
      }
    }

    stage('Build & Deploy') {
      steps {
        // go into your project directory
        dir('Todo_Tasks') {
          sh '''
            # Build the image
            docker compose build

            # (Optional) Tear down any existing containers
            docker compose down || true

            # Launch or update containers
            docker compose up -d
          '''
        }
      }
    }
  }
}
