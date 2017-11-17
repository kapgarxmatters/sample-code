/**
 * Jira Util: All shared functions that access Jira app endpoints.
 */

/**
 * Post an activity to JIRA
 * @param {string} jiraSDMessage: the comment or message payload
 * @param {string} jwt: the token
 * @param {string} localBaseUrl: name to determine which endpoint to use
 * @returns {{}}} jiraSDMessageRequest: the response from the server
 */
exports.addActivity = function ( jiraSDMessage, jwt, localBaseUrl ) {

    var endPoint = "JIRA-Dev";

    if (localBaseUrl) {
        if (localBaseUrl.indexOf("jira-sd.xmatters.com") >= 0) {
            endPoint = "JIRA-Prod";
        } else if (localBaseUrl.indexOf("jira-sd.tst.xmatters.com") >= 0) {
            endPoint = "JIRA-Test";
        }
    }

    // If the room value is set, it's an Invite to HipChat Room. Change the path accordingly.
    var path = '/xmatters-notifications?issue_id=' + jiraSDMessage.issue_id;
    if (jiraSDMessage.room) {
        path = '/invite-to-room?issue_id=' + jiraSDMessage.issue_id;
    }

    var jiraSDMessageRequest = http.request({
        "endpoint": endPoint,
        'method': 'POST',
        'path': path,
        'headers': {
            'Content-type': 'application/json',
            "Authorization": "JWT " + encodeURIComponent(jwt)
        }
    });

    // Submit the request
    return jiraSDMessageRequest.write(jiraSDMessage);
};

/**
 * Build the payload to Jira based on event properties
 * @param {{}} eventProperties: the event properties
 * @returns {{}}} the payload, additional custom fields to be added
 */
exports.buildJiraMessage = function (eventProperties) {
    return {
        "assignee_name": eventProperties.assignee_name,
        "assignee_username": eventProperties.assignee_username,
        "changelog_id": eventProperties.changelog_id,
        "description": eventProperties.description,
        "email_heading": eventProperties.email_heading,
        "instance_name": eventProperties.instance_name,
        "issue_id": eventProperties.issue_id,
        "issue_key": eventProperties.issue_key,
        "issue_url": eventProperties.issue_url,
        "jwt": eventProperties.jwt,
        "local_base_url": eventProperties.local_base_url,
        "priority": eventProperties.priority,
        "project_name": eventProperties.project_name,
        "reporter_name": eventProperties.reporter_name,
        "room": eventProperties.room,
        "status": eventProperties.status,
        "summary": eventProperties.summary,
        "webhook_event": eventProperties.webhook_event
    };
};
