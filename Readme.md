## Nest API boilerplate

This Nest boilerplate contains:

- Log rotation(via **winston**)
- JWT auth (via **passport**)
- Mysql database support(via **typeorm**)
- Emails support (via **node-mailer**)
- Automated API documentation based on **Swagger**
- Validation based on **Joi** package
- Configured testing environment (via **Jest**)


> This API based on [Nest 6](https://docs.nestjs.com/v6) framework and [Mysql 5.*](https://www.mysql.com/) database. Authorization is based on [JWT](https://jwt.io/) bearer tokens. You can find Swagger API documentation by open `/api-doc` path of the deployed API instance 

#### Developer Deploy notes *(using Docker)*

1. First of all you should install **docker** and **docker-compose** on your machine.
2. Clone the repo and open dir`cd optionhouse-backend`
3. Copy *.env.example* to *.env* config file
4. Open **docker** folder
5. Run `docker-compose up` to build and run the project
6. Application should start on port **8080**. If you wish to change port please update it in *./docker/docker-compose.yml*

#### Developer Deploy notes *(without Docker)*

1. You should already have `Node JS 8+` and `Mysql` database instance before run this api
2. Clone the repo and open dir`cd optionhouse-backend`
3. Copy *.env.example* to *.env* config file
4. Set your Mongo host, user, and password into the *.env*
5. Run `yarn` to build dependecies
6. Run `yarn start` to build and start API
7. Application by default start on port **8080**. If you wish to change port please set *API_PORT* const in the *.env* file

#### Production deploy notes

1. Clone the repo and open dir`cd optionhouse-backend`
2. Copy *.env.example* to *.env* config file
> It's strictly recommended to set JWT_PRIVATE_KEY int .env file
3. Build app `yarn && yarn build` Build will appear in the */dist* folder
4. You can serve this build by node: `yarn prod` or use **pm2** or the others;
> Notice that *.env* file and */logs* dir will be outside the */dist* folder

#### Testing
> Before all you should create test database. It's name by default *test* but you can specify it by MYSQL_TEST_DATABASE parameter of te .env file
- You can run tests inside the **web** container `docker-compose exec web bash` by running `yarn test`(unit and integration tests) and `yarn test-e2e`(end to end tests)
