exports.handler = async (event, ctx) => {
    try {
        // Get awsRequestId and use as ID for json-api response via destructuring
        const {awsRequestId} = ctx;
        let data = await fetchSecurityGroups();
        data = constructSecurityGroupsArray(data);
        if (ec2DataPromise.length == 0) {
            return {id: awsRequestId, data: [], type: "array"}
        } else {
            return {id: awsRequestId, data, type: "array"};
        }
    } catch (error) {
        const status = error.code || "500";
        const detail  = error.message || "Internal Server Error.";
        return {errors: [{status, detail}]};
    }
};