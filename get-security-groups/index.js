const {fetchSecurityGroups, constructSecurityGroupsArray} = require('ec2-security-groups');

exports.handler = async (event, ctx) => {
    try {
        // Get awsRequestId and use as ID for json-api response via destructuring
        const {awsRequestId} = ctx;
        let data = (await fetchSecurityGroups()).SecurityGroups;
        data = constructSecurityGroupsArray(data);
        if (data.length === 0) {
            return {
                statusCode: 200,
                headers: {"Content-Type": "application/vnd.api+json"},
                body: []
            }
        } else {
            return {
                statusCode: 200,
                headers: {"Content-Type": "application/vnd.api+json"},
                body: JSON.stringify({id: awsRequestId, data, type: "array"})
            }
        }
    } catch (error) {
        const statusCode = error.code || "500";
        const detail  = error.message || "Internal Server Error.";
        return {
            statusCode,
            headers: {"Content-Type": "application/vnd.api+json"},
            body: JSON.stringify({errors: [{status: statusCode, detail}]})
        }
    }
};