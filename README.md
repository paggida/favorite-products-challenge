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
Start the docker service installed in your environment, after completing, depending on which package manager you chose, run the command below inside the application's root folder.

    yarn docker:server
or

    npm run docker:server

You can interact with the API through an API client software or through the Swagger documentation page available on the console after the application container starts (`Swagger url: http://localhost:3000/api/v1/doc`).

## 🔒️ Authentication
API functionalities are protected by JWT Token in Bearer format with an expiration time of one hour.

To obtain the token, it is necessary to make a post request to the address `/api/v1/session/token` using the access code ( e.g: the default `'fpPrjAccessCode'` )

## 📝 Tests
With the application running and the terminal already pointing to the project's root folder, you can use the command below (It depends on which package manager you chose):

    yarn test
or

    npm run test

The above command will perform the unit and integration tests found within the project using the extension `.spec.ts`

- **Unit tests:** Located in the same directory as the modules to be tested.
- **Integration tests:** Located in `<project folder>/src/shared/tests`

## 📐 Architecture
The project was structured using [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) aiming at the following benefits:
- Easier application of the [SoC(Separation of Concerns)](https://en.wikipedia.org/wiki/Separation_of_concerns#:~:text=In%20computer%20science%2C%20separation%20of,code%20of%20a%20computer%20program) concept.
- Fully isolate the software domain from technical details and even external software/services.
- Improves testability.
- Facility for possible exchanges of peripheral technologies.

The code follows [clean Code](http://cleancoder.com/files/cleanCodeCourse.md) concepts, as much as possible, so that the code could be self-documented.

## 📁Organization
All project modules follow the structure below, and may have fewer folders, in case it is not necessary for your responsibility:

- **config:** Stores the configurations to be followed by all modules belonging to the project.
- **core:** Location of standardization interfaces for services.
- **errors:** Location of error objects that can be launched by the module.
- **infra:** Interface adapters for interacting with entities external to the module.
  - **http:** Structures for interaction via HTTP request.
    - **middlewares:** Validation and adaptation services of received data.
    - **routes:** HTTP request routes.
  - **mongoose:** Structure for interaction with MongoDB database.
    - **schemas:** Location of entities used by the module within MongoDB.
- **services:** All services provided by the module.
- **tests:** Module integration test files.
