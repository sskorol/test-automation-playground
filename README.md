# Test Automation Playground 

[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://goo.gl/9GLmMZ)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20this%20awesome%20test%20automation%20playground:&url=https://github.com/sskorol/test-automation-playground)

This repository was created to help Software Engineers in Test practicing skills in ReactJS apps automation.
Apart from that, some of the modules were designed as a part of [QAFest 18](http://qafest.com) talk's preparation.  
 
There're 3 modules:

 - frontend
 - backend
 - domain   

## Frontend

 Based on [ReactJS](https://github.com/facebook/create-react-app) and [MobX](https://mobx.js.org).
 
 - Chart component is a customized version of [react-stock-charts](https://github.com/rrag/react-stockcharts).
 - Grid component is a customized version of [react-data-grid](https://github.com/adazzle/react-data-grid).
 - Common UI components are based on [Ant Design](https://ant.design), except [DatePicker](https://github.com/Hacker0x01/react-datepicker), which has been chosen for playing with events.
 - [ReactTestUtils](https://reactjs.org/docs/test-utils.html#simulate) was backdoored for demo purposes (events triggering). 
 - Common components have special **data-qa** attributes for easier locators lookup and maintenance.

 Note that Grid component contains several bugs, which were introduced for demo purposes. Try to detect and fix them. ;)

 You can start frontend via the following command:
 
 ```bash
 yarn start
 ```
 
 Also note that Grid and Chart components could be used in a dynamic mode.
 To trigger data refreshing you have to activate the following options from within **./src/constants/index.js**:
 
 ```js
 AUTOUPDATE_CHART=true
 AUTOUPDATE_GRID=true
 ```  

## Backend

 Based on [Spring Boot](https://spring.io/projects/spring-boot) and [MySQL](https://hub.docker.com/r/mysql/mysql-server).
 It's recommended to persist container's DB to avoid loosing data on stopping.
 
 [Liquibase](https://www.liquibase.org) is configured for schema / initial data preparation. By default it populates only roles.
 Users could be created via SignUp form.  
 
 Backend may work in 2 modes: local / docker.
 For local development just import project as a Spring Boot application and create corresponding run configuration.
 Before starting up backend, you have to raise MySQL container:
 
 ```bash
 docker run --name=mysql1 --mount type=bind,src=/path/to/shared/mysql/my.cnf,dst=/etc/my.cnf --mount type=bind,src=/path/to/shared/mysql/datadir,dst=/var/lib/mysql -e MYSQL_DATABASE=test -e MYSQL_ALLOW_EMPTY_PASSWORD=true -e MYSQL_ROOT_HOST=% -p 3306:3306 -d mysql/mysql-server
 ```
 
 Note that **mount** is required for data persistence. Both **my.cnf** and **datadir** must exist before running above command.
 Config may look like the following:
 ```text
 [mysqld]
 user=root
 default_authentication_plugin=mysql_native_password
 block_encryption_mode=aes-256-cbc
 ```
 
 Gradle build file has a special task for creating a docker image with both frontend and backend hosted within a single container.
 Just run the following command to prepare corresponding image:
 
 ```bash
 ./gradlew clean buildDocker
 ```
 
 To start all the containers together (including MySql and [Selenoid](https://github.com/aerokube/selenoid)) use **./docker/docker-compose.yml**:
 
 ```bash
 docker-compose up -d
 ```  
 
 Please note that `docker-compose.yml` uses 2 environment variables: `MYSQL_FOLDER` and `PWD`.
 Former refers to your local MySQL folder for data persistence, and latter should provide an absolute path to `./docker`
 folder for Selenoid mappings. The easiest way to set them up is creating `.env` file in the `./docker` root.  
 
 Similar to frontend side, be aware of the backend bug, which was introduced for demo purposes. Try to detect and fix it. ;)

## Domain

 There're several tests created for Grid and Chart components. Some of them will fail due to application bugs.
 It's recommended to check QAFest 18 video recording first to get an overall idea of the introduced issues' nature,
 and how to fix them.

 Tests can be executed in 2 modes as well: local and docker.

 If you raised docker containers described in a backend section,
 use the following startup command:
 
 ```bash
 ./gradlew clean test -Dsuite=remote -DappHost=react -DappPort=8090
 ```

 For local execution use:

 ```bash
 ./gradlew clean test -Dsuite=local -DappHost=localhost -DappPort=3000
 ```

 A code is based on [Selenide](https://selenide.org) framework. But there's also a custom 
 [webdriver-supplier](https://github.com/sskorol/webdriver-supplier) used for more flexible sessions / capabilities management.

 Please read **webdriver-supplier** requirements first. But basically you'll need the following: 

 - Browser SPI implementation (see **./src/test/resources/META-INF/services/io.github.sskorol.core.Browser** and
  **./src/main/java/io/github/sskorol/browser**).
 - Parameterized suites and `wd.properties` (see **./src/test/resources**).
 
 So depending on execution type, you have to choose between local and remote configuration.

 That's it. My talk's video (RU) and presentation will be available on the official QAFest site. So stay tuned. ;) 
