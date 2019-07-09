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

File directory:
* _ec2-security-groups_: NPM Module

* _get-security-groups_: AWS Lambda function
    * _node_modules_
        * _ec2-security-groups_: NPM'd version of module
        * all other modules omitted from repo
    * _serverless.yml_: Serverless framework yaml file
 