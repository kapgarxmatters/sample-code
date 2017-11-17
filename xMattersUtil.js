/**
 * xMatters Util: All shared functions that access xM-API endpoints, or prepare the data to do so.
 */

/**
 * Process the payload coming from the third party platform (Jira Service Desk)
 * @param {{}} requestBody - The payload coming in
 * @returns {{}} data - to be sent to the form
 */
exports.processDefaultPayload = function ( requestBody ) {
    var trigger = {
        properties: {
            assignee_name: requestBody.assignee_name,
            assignee_username: requestBody.assignee_username,
            description: requestBody.description,
            instance_name: requestBody.instance_name,
            issue_id: requestBody.issue_id,
            issue_key: requestBody.issue_key,
            issue_url: requestBody.issue_url,
            jwt: requestBody.jwt,
            local_base_url: requestBody.local_base_url,
            message: requestBody.message,
            priority: requestBody.priority,
            project_name: requestBody.project_name,
            reporter_name: requestBody.reporter_name,
            sender_name: requestBody.sender_name,
            status: requestBody.status,
            subject: requestBody.subject,
            summary: requestBody.summary
        }
    };

    return trigger;
};

/**
 * Extract set of recipients from string
 *
 * @param {string} recipientsStr comma-delimited set off recipients
 * @param {boolean} apiLookup when true, look up each recipients in xM-API
 * @returns {Array} set of recipients suitable for form post
 */
exports.getRecipients = function (recipientsStr, apiLookup) {
    apiLookup = !!apiLookup;

    var recipients = [];

    var targetName;
    var arr = recipientsStr.split(',');
    for (var i = 0; i < arr.length; i++) {
        targetName = arr[i].trim();
        if (apiLookup) {
            targetName = this.findxMattersUserByAssigneeName(targetName);
        }

        if (targetName) {
            recipients.push({
                targetName: targetName
            });
        }
    }

    return recipients;
};

/**
 * Look up recipient in xMatters
 * @param {string} assigneeName the assignee username in JIRA
 * @return {string} targetName the recipient username
 */
exports.findxMattersUserByAssigneeName = function( assigneeName ) {
    var targetName = null;

    var xMUserRequest = http.request({
        "endpoint": "xMatters",
        "method": "GET",
        "path": "/api/xm/1/people/" + encodeURIComponent(assigneeName)
    });

    var xMUserResponse = xMUserRequest.write();
    console.log("Search xM UserID == Jira UserID result: " + xMUserResponse.statusCode + " " + xMUserResponse.body);

    if (xMUserResponse.statusCode == 404) {

        // If not found, try to search by custom field.
        var xMJiraUserRequest = http.request({
            "endpoint": "xMatters",
            "method": "GET",
            "path": "/api/xm/1/people?propertyName=" + encodeURIComponent(constants['JIRA Username Field Name']) + "&propertyValue=" + encodeURIComponent(assigneeName)
        });

        var xMJiraUserResponse = xMJiraUserRequest.write();
        console.log("Search xM Jira SD User ID == Jira UserID result: " + xMJiraUserResponse.statusCode + " " + xMJiraUserResponse.body);

        if (xMJiraUserResponse.statusCode >= 200 && xMJiraUserResponse.statusCode < 300) {
            var jiraUserData;
            try {
                jiraUserData = JSON.parse(xMJiraUserResponse.body);
            } catch (e) {
                jiraUserData = xMJiraUserResponse.body;
            }
            if (jiraUserData.data[0]) {
                targetName = jiraUserData.data[0].targetName;
                console.log("xMJiraUserResponse targetName: " + targetName);
            }
        }

    } else {
        var data;
        try {
            data = JSON.parse(xMUserResponse.body);
        } catch (e) {
            data = xMUserResponse.body;
        }
        targetName = data.targetName;
    }

    return targetName;
};

/**
 * Fetch the username in JIRA
 * @param {string} recipientName the recipient username in xM
 * @returns {string} targetName the JIRA name of the user
 */
exports.getJIRAUserName = function( recipientName ) {

    console.log("XM REST API: Attempting query by targetName: " + recipientName);
    var url = "/api/xm/1/people/" + encodeURIComponent(recipientName);

    var jiraSdRequest = http.request({
        "endpoint": "xMatters",
        "method": "GET",
        "path": url
    });

    var jiraSdResponse = jiraSdRequest.write();
    console.log("XM REST API: getPerson (based on targetName) received " + jiraSdResponse.statusCode + " " + jiraSdResponse.body);

    var data;
    try {
        data = JSON.parse(jiraSdResponse.body);
    } catch (e) {
        data = jiraSdResponse.body;
    }
    if (jiraSdResponse.statusCode == 404) {
        return null;
    }

    if (data.properties && data.properties[constants['JIRA Username Field Name']]) {
        return data.properties[constants['JIRA Username Field Name']];
    }

    return data.targetName;
};


/**
 * Find the email addresses by the xMatters user id
 * @param {string} personID: the xMatters user id
 * @returns {[String]}  emailAddresses: an array of email addresses
 */
exports.getEmailAddressByPersonId = function( personID ) {

    var request = http.request({
        "endpoint": "xMatters",
        "path": "/api/xm/1/people/" + personID + "/devices",
        "method": "GET"
    });

    var response = request.write();
    var emailAddresses = [];

    if (response.statusCode == 200) {
        var json;
        try {
            json = JSON.parse( response.body );
        } catch (e) {
            json = response.body;
        }

        console.log("Retrieved  " + json.count + " of " + json.total + " devices.");

        var dataArray = json.data;
        if (dataArray) {
            for (var i in dataArray) {
                if (dataArray[i] && dataArray[i].emailAddress) {
                    emailAddresses.push(dataArray[i].emailAddress);
                }
            }
        }
    }

    return emailAddresses;
};
