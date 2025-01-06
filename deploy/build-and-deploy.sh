source .env
npm run build
scp -P $SSH_SERVER_PORT -r dist/* ${SSH_SERVER_USERNAME}@${SSH_SERVER_HOST}:${DEPLOY_PATH}