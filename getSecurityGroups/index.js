// load SDK
const AWS = require('aws-sdk');
// set region
AWS.config.update({region: 'us-west-2'});

/**
 * Utility function which maps an array of SecurityGroup objects and returns an array of strings with each entry being
 * the SecurityGroup name
 * @param secGroupArr SecurityGroup object's array of SecurityGroups
 * @returns {String[]}
 */
const constructSecurityGroupsArray = (secGroupArr) => secGroupArr.map(secGroup => {
    return { id: secGroup.GroupId, type: "GroupObject", attributes: { GroupName: secGroup.GroupName }}
});

exports.handler = async (event, ctx) => {
    try {
        // Create EC2 service object
        const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
        // Get awsRequestId and use as ID for json-api response via destructuring
        const {awsRequestId} = ctx
        // Retrieve security group descriptions. Note that this returns an AWS.request object (not a promise)
        const ec2GroupsRequests = ec2.describeSecurityGroups({});
        // await thennable promise of describeSecurityGroup request
        const ec2DataPromise = await (ec2GroupsRequests.promise());
        if (ec2DataPromise.length == 0) {
            return {id: awsRequestId, data: [], type: "array"}
        } else {
            return {id: awsRequestId, data: constructSecurityGroupsArray(ec2DataPromise.SecurityGroups), type: "array"};
        }
    } catch (error) {
        let status = error.code || "500";
        let detail  = error.message || "Internal Server Error.";
        return {errors: [{status, detail}]};
    }
};