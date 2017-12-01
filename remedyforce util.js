/**
 *  Usage:
 *  <pre>
 *  var remedyforceClient = require('RemedyforceClient');
 *  var response1 = remedyforceClient.assignToUser(incidentId, callback.targetName);
 *  var response2 = remedyforceClient.addNote(parentId, note);</pre>
 *  
 *  @module RemedyforceClient
 */

/**
 * Assign an incident to Remedyforce user identified by username
 * 
 * @param {string} incidentId of Remedyforce incident
 * @param {string} username of assignee
 * @return {bool} true on success; false otherwise
 */
 

 exports.createTicket = function(callback) {  
     console.log('Create Remedyforce Ticket');
    console.log('Assigning incident to ' + callback.recipient + '@harriscomputer.com.ssotest');
    //var userId = this.getUserId("pg14728" + '@harriscomputer.com.ssotest');
    var userId = this.getUserId(callback.recipient + '@harriscomputer.com.ssotest');
    if (userId === null) {
        return false;
    }
  
      var description = "*Solarwinds Alert* \n";
      description += "*Alert ID*:"          + callback.eventProperties['alert_id']        + "\n";
      description += "*Object Type*:"           + callback.eventProperties['objecttype']                  + "\n";
      description += "*Severity*:"              + callback.eventProperties['severity']                 + "\n";
      description += "*Alert Name*:"            + callback.eventProperties['alert_name']                + "\n";
      description += "*Node Name*:"            + callback.eventProperties['node_name']          + "\n";
      description += "*Location*:"          + callback.eventProperties['location']        + "\n";
      description += "*Details*:"      + callback.eventProperties['details']    + "\n";
      
      var payload = {
            "BMCServiceDesk__FKClient__c" : userId,
            "BMCServiceDesk__FKCategory__c": "a1D0j0000008cZAEAY",
            "BMCServiceDesk__incidentDescription__c" : description,
            "BMCServiceDesk__contactType__c" : "Own observation"
            };
        
        var resp = http.request({ 
          method: 'POST',
          endpoint: 'Remedyforce',
          path: '/services/data/v22.0/sobjects/BMCServiceDesk__Incident__c/'
        }).write(payload);
        
        console.log(JSON.stringify(resp));
        
        // verify we received a successful (2xx) HTTP response
        if (resp.statusCode >= 200 && resp.statusCode < 300) {
            return true;
        }
        
        return false;
};

exports.updateTicket = function(callback) {  
     console.log('Create Remedyforce Ticket');

  
      var description = "*Solarwinds Alert* \n";
      description += "*Alert ID*:"          + callback.eventProperties['alert_id']        + "\n";
      description += "*Object Type*:"           + callback.eventProperties['objecttype']                  + "\n";
      description += "*Severity*:"              + callback.eventProperties['severity']                 + "\n";
      description += "*Alert Name*:"            + callback.eventProperties['alert_name']                + "\n";
      description += "*Node Name*:"            + callback.eventProperties['node_name']          + "\n";
      description += "*Location*:"          + callback.eventProperties['location']        + "\n";
      description += "*Details*:"      + callback.eventProperties['details']    + "\n";
      
      var payload = {
            //"BMCServiceDesk__StandardDescription__c": description,
            //"StandardDescription" : description,
            //"IncidentSource": "Own observation",
            //"BMCServiceDesk__Category__c": "Applications"
            //"Category": "Applications",
            //"OwnderId" : ""
            
            //"BMCServiceDesk__FKCategory__c" : "Applications",
            "BMCServiceDesk__FKClient__c" : "0051I000001bhay",
            //"BMCServiceDesk__clientId__c" : "charlotte.harris.7zzxlhjudiif.vhmdfg5hbmt0.bdczcdrf4xvz@bmcremedyforce.com",
            //"BMCServiceDesk__FKClient__r.Username" : "",
            //"BMCServiceDesk__FKCategory__c": "a211I0000007VWRQA2",
            //"BMCServiceDesk__incidentDescription__c" : description,
            //"BMCServiceDesk__contactType__c" : "Own observation"
            
            };
        
        var resp = http.request({ 
          method: 'PATCH',
          endpoint: 'Remedyforce_Kristin',
          //path: '/services/apexrest/BMCServiceDesk/1.0/Incident'
          //path: '/services/data/v22.0/sobjects/Incident'
          path: '/services/data/v22.0/sobjects/BMCServiceDesk__Incident__c/a2U1I000000MbioUAC'
          //path: '/services/data/v20.0/sobjects/BMCServiceDesk__Incident__c'
        }).write(payload);
        
        console.log(JSON.stringify(resp));
        
        // verify we received a successful (2xx) HTTP response
        if (resp.statusCode >= 200 && resp.statusCode < 300) {
            return true;
        }
        
        return false;
};

exports.assignToUser = function(incidentId, username) {    
    console.log('Assigning incident to ' + username);
    var userId = this.getUserId(username);
    if (userId === null) {
        return false;
    }
    
    var payload = {
        "BMCServiceDesk__FKOpenBy__c": userId
    };
    
    var resp = http.request({ 
      method: 'PATCH',
      endpoint: 'Remedyforce',
      path: '/services/data/v22.0/sobjects/BMCServiceDesk__Incident__c/' + incidentId
    }).write(payload);
    
    console.log(JSON.stringify(resp));
    
    // verify we received a successful (2xx) HTTP response
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
        return true;
    }
    
    return false;
};

/**
 * Given a username, retrieve Id from Remedyforce
 * 
 * @param {string} username to look up
 * @return {string|null} user id from Remedyforce, if found
 */
exports.getUserId = function(username) {
    console.log('Retrieving Remedyforce user for ' + username);
    
    var queryParams = encodeURI("select Id, Username from User where Username='" + username + "'");
    //var queryParams = encodeURI("select Id, Username from User");
  
    var response = http.request({
        method: 'GET',
        endpoint: 'Remedyforce',
        path: '/services/data/v22.0/query?q=' + queryParams
    }).write();
    
    var users = JSON.parse(response.body);
    if (users.totalSize > 0) {
        console.log('Found user: ' + JSON.stringify(users.records[0]));
        return users.records[0].Id;
    }
    
    console.log('No user could be found for ' + username);
    return null;
};

/**
 * Creates a Salesforce note object related to another record
 * 
 * @param {string} parentId     The Id of the record to relate the note to
 * @param {string} note         The note body to create
 * @param {null|string} title   Optional title of the note, up to 80 characters. Will default
 *                                  to the first 80 characters of the note variable 
 * @returns {boolean} true if the response status code is in the success range
 */
exports.addNote = function(parentId, note, title) {
    console.log( 'Adding a note "' + note + '" to Remedyforce');
    
    if(!title) {
        title = note.length > 80 ? note.substring(0, 80) : note;
    }
    
    var payload = {
       ParentId: parentId,
       Title: title,
       Body: note        
    };
    
    var req = http.request({
        method: 'POST',
        endpoint: 'Remedyforce',
        path: "/services/data/v22.0/sobjects/Note/" 
    });
    
    var resp = req.write( payload );
    // verify we received a successful (2xx) HTTP response
    return resp.statusCode >= 200 && resp.statusCode < 300;
};

