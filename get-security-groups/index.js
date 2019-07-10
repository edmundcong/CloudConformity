const {fetchSecurityGroups, constructSecurityGroupsArray} = require('ec2-security-groups');

exports.handler = async (event, ctx) => {
    // Get awsRequestId and use as ID for json-api response via destructuring
    const {awsRequestId} = ctx;
    const jsonApiHeaders = {"Content-Type": "application/vnd.api+json"};

    // client's requests need to specify the content type, and that content type needs to be vnd.api+json
    if (!event.headers ||
        event.headers["Content-Type"] !== "application/vnd.api+json") {
        return {
            statusCode: "415", headers: jsonApiHeaders,
            body: JSON.stringify({errors: [{status: "415", detail: "Unsupported Media Type"}]})
        };
    }
    // regex for finding json api header with 0 or more whitespace then a ; after it (i.e. media params)
    let acceptMediaParamsRegex = /application\/vnd\.api\+json(?!\s*;)/;
    // if a client requests with accept header then they must not have any appended media params
    if (event.headers["Accept"] && !acceptMediaParamsRegex.test(event.headers["Accept"])) {
        return {
            statusCode: "406", headers: jsonApiHeaders,
            body: JSON.stringify({errors: [{status: "406", detail: "Not Acceptable"}]})
        };
    }
    try {
        // call our module so we can extract only the parts of the security group's records we want (id, name, etc)
        let data = (await fetchSecurityGroups()).SecurityGroups;
        data = constructSecurityGroupsArray(data);
        if (data.length === 0) {
            return {
                statusCode: 200,
                headers: jsonApiHeaders,
                body: []
            }
        } else {
            return {
                statusCode: 200,
                headers: jsonApiHeaders,
                body: JSON.stringify({id: awsRequestId, data, type: "array"})
            }
        }
    } catch (error) {
        // if we're not provided any error code/message just default to 500 internal server error
        const statusCode = error.code || "500";
        const detail = error.message || "Internal Server Error.";
        return {
            statusCode,
            headers: jsonApiHeaders,
            body: JSON.stringify({errors: [{status: statusCode, detail}]})
        }
    }
};