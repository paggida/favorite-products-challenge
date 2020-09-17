<h1 align="center">
  <img alt="Favorite Products" src="assets/logo.png" style="border-radius: 10px"/>
</h1>

<p align="center">This project is based on the management of each customer's favorite products for generating marketing reports.</p>

## 💻 Technologies used
- [NodeJs](https://nodejs.org/en/) in API.
- [Typescript](https://www.typescriptlang.org/) in code.
- [MongoDB](https://www.mongodb.com/) in data base.
- [Docker](https://www.docker.com/) for infrastructure.
- [Jest](https://jestjs.io/en/) for tests.
- [Swagger](https://swagger.io/) for documentation.

## ✋🏻 Prerequisite
To execute this project you will need to have the following components in your environment.
### **Docker**
To activate the application containers you must use the Docker based on your operating system used:
- [Windows](https://docs.docker.com/docker-for-windows/install/)
- [Mac](https://docs.docker.com/docker-for-mac/install/)
- [Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
### **Docker-compose**
To activate all the interacting containers together, you must use [Docker-compose](https://docs.docker.com/compose/install/)
### **Package Manager**
It'll be responsible for the commands to start the application. You can choose your preference:
- [NPM](https://www.npmjs.com/get-npm)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

## 👨‍💻 Running the application
Start the docker service installed in your environment, after completing, depending on which package manager you chose, run both respective commands below inside the application's root folder.

    yarn

    yarn start-docker
or

    npm install

    npm run start-docker

You can interact with the API through an API client software or through the Swagger documentation page available on the console after the application container starts (`Swagger url: http://localhost:3000/api/v1/doc`).


## 📝 Tests
With the application running, execute the command below:

    docker exec -it favorite_products_prj yarn test

If the terminal is already pointing to the project's root folder, you can use the shorter command below (It depends on which package manager you chose):

    yarn test-docker
or

    npm run test-docker

## 📐 Architecture
TBD

## 📁Organization
TBD
