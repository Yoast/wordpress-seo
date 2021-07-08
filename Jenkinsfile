pipeline {
    agent {
        docker {
            image 'ubuntu-latest'
        }
    }
    stages {
        stage('Install composer dependencies') {
            steps {
                sh 'composer install'
            }
        }
        stage('Install Yarn dependencies') {
            steps {
                sh 'yarn'
            }
        }
        stage('Build the plugin') {
            steps {
                sh 'grunt build'
            }
        }
    }
}
