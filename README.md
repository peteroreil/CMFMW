### CMFMW 

### Run locally

#### Requirements


- npm v6.1.0
- node v8.11.3
- mongodb running



#### Install

```
$ npm install
```

#### Start
Will use default configs `./app/config/default.json`

```
$ npm run
```

### Run with Docker
```
$ docker-compose -f ./docker/docker-compose.yml up
```


#### Run Tests

* Note: Tests run against the mongodb instance and must be configured in the `test` 
section of `app/config/default.json` when running locally only *

```
$ npm run integration

``` 

To run against a running `docker-compose` services

```
$ NODE_ENV=docker npm run integration
```