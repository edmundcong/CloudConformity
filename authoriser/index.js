/**
 * A 'dumb' authoriser which will either allow or disallow access to a Lambda based on if we pass in authorize true/false
 * @param event
 * @param context
 * @param callback
 */
exports.handler = (event, context, callback) => {
    // Retrieve request parameters from the Lambda function input:
    const headers = event.headers;
    if (headers.authorized === "true"){ // allow request to pass through if we have authorized head "true"
        // create and return policy to allow request to flow through to lambda
        const policy = createAllowPolicy("apiUser", event.methodArn);
        callback(null, policy);
    }  else {
        // return unauthorized if we haven't gotten the 'authorized' header passed with value "true"
        callback("Unauthorized");
    }
}

/**
 * Help function to generate an 'Allow' IAM policy
 * @param principalId
 * @param resource
 */
const createAllowPolicy = (principalId, resource) => {
    // build up our IAM response object with correct properties for lambda access
    const authResponse = {};
    authResponse.principalId = principalId;
    if (resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = 'Allow';
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}
