# If you config docker app as a service see ./docker-compose-app.service
# You can use this sample to deploy updates
# Please check that your project root is /var/optionhouse/optionhouse-backend or change this to your path

systemctl stop docker-compose-app
cd /var/optionhouse/optionhouse-backend && git pull
systemctl start docker-compose-app
