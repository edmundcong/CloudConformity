# CloudConformity
Employment exercise for CloudConformity
API Gateway + Lambda

* Create a Node.js ES6 module to list all EC2 security groups in an AWS Account.
* Use this module in an AWS Lambda function.
* Make the Lambda function available via an AWS API Gateway endpoint.
* Make response JSON:API 1.0 (https://jsonapi.org/format/1.0/) compatible.
* Wrap the Lambda, API Gateway endpoint, and utility module in a Serverless application. (More info: https://serverless.com/framework/docs/providers/aws/events/apigateway#configuring-endpoint-types)
* Write a unit test for your module by mocking AWS EC2 API.
* Get a code coverage report for your test suite.
* Secure the endpoint using a custom API Gateway Lambda Authoriser (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)

## How to hit the endpoint

* do a `GET` on: https://wdzgnf4au8.execute-api.us-west-2.amazonaws.com/prod/securityGroups
* Make sure your `Content-Type` header is set to `application/vnd.api+json`
* Make sure your `Accept` header (if) set includes `application/vnd.api+json` without any media params
* To test authorization please pass in `Authorization` header with value `true`
* Example: `curl -i -H "Accept: application/vnd.api+json" -H "Content-Type: application/vnd.api+json" -H "Authorization: true" https://wdzgnf4au8.execute-api.us-west-2.amazonaws.com/prod/securityGroups`

File directory:
* _ec2-security-groups_: NPM Module
    * _test/test.js_ : Mocha + Chai + Proxyquire tests 
    * _index.js_ : Module that we imported into our lambda function
* _get-security-groups_: AWS Lambda function
    * _node_modules_
        * _ec2-security-groups_: NPM'd version of module
        * all other modules omitted from repo
    * _index.js_ : `index.js` is our Lambda function (withour our module)
    * _test/test.js_ : Mocha + Chai + Proxyquire tests 
    * _serverless.yml_: Serverless framework yaml file
    
    
Code Coverage reports:

_Lambda function:_
```$xslt


  getSecurityGroups
    ✓ fail as we haven't passed in content-type
    ✓ fail as we have passed in wrong content-type
    ✓ fail as our client submitted correct Accept but wrong content-type
    ✓ should succeed as we've successfully retrieved our security groups from our module
    ✓ should succeed and return an array of size 0
    ✓ should fail as we thrown an error


  6 passing (42ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 index.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|

```
 
 _Node Module_:
 ```$xslt


  fetchSecurityGroups
    ✓ should succeed and return an object of ec2 security groups

  constructSecurityGroupsArray
    ✓ should return a well formatted object
    ✓ should return empty array


  3 passing (41ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 index.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
```