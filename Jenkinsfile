
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Getting project source code'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Syntax Testing') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Complete') {
            steps {
                echo 'Student Attendance Management System build completed successfully!'
            }
        }
    }
}
