exports.postxmatters = function(path, xmevent){
    console.log('Launch xMatters Event');
    var xmattersPost = http.request({
        'endpoint': 'xMatters',
        'method': 'POST',
        'path': path,
        'headers': {
            'Content-Type': 'application/json'
        }
    });
    
    var payload = {};
    payload.properties = {};
    for (var key in xmevent.properties){
        var attrName = key.replace('#en', '');
        var attrValue = xmevent.properties[key];
        payload.properties[attrName] = attrValue;
    }
    
    var recipients = [];
    payload.recipients = [];
    
    for (var i in xmevent.recipients.data){
        recipients.push({'id': xmevent.recipients.data[i].targetName}); 
    }
    payload.recipients = recipients;
    
    /** Make the request to the external system and verify that it is successful. **/
    var response = xmattersPost.write(payload );
    if (response.statusCode != 202 ) {
        console.log('\nThere was an error updating the external system.\n');
        return;
    }
    
    /** Write the response from the external system to the activity stream. **/
    console.log(JSON.stringify(response));
    
}
