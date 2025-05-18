pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Muhammadzeeshsn/Todo_Tasks.git', branch: 'main'
            }
        }

        stage('Build & Deploy') {
            steps {
                dir('Todo_Tasks') {
                    sh '''
                        docker compose build
                        docker compose down || true
                        docker compose up -d
                    '''
                }
            }
        }
    }
}
