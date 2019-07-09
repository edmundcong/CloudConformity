// load SDK
const AWS = require('aws-sdk');
// set region
AWS.config.update({region: 'us-west-2'});

exports.handler = async (event) => {
    // Create EC2 service object
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    // Retrieve security group descriptions
    const ec2Data = await ec2.describeSecurityGroups({}, (err, data) => {
        if (err) {
            return err;
        } else {
            return data.SecurityGroups;
        }
    });
    const ec2DataPromise = await (ec2Data.promise());
    const response = {
        statusCode: 200,
        body: JSON.stringify(ec2DataPromise),
    };
    return response;
};