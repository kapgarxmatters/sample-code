path = '/api/xm/1/events/' + payload.eventIdentifier + '?embed=properties,recipients&targeted=true';
    var xmevent = xmattersLibrary.getevent(path);
    console.log('Event ' + JSON.stringify(xmevent));
    
    var stringtime = xmevent.created;
    console.log('String ' + stringtime);
    
    //var stringtime = "17-11-14 23:07:36.897";
    var timearray1 = stringtime.split('+');
    
    var stime = Date.parse(timearray1[0]);
    console.log('Start Time ' + stime);
    var ctime = Date.now();
    console.log('End Time' + ctime);
    var diftime = ctime - stime;
    console.log("Time " + diftime);
    
    var slatime = constants["expiration_sla"];
    console.log("SLA Time mill " + (slatime * 60000))

    if (diftime > (slatime * 60000) ){
        console.log('Event Expired Recreate Event');
        path = '/api/integration/1/functions/73503e3f-b1b9-4207-9453-5775ddf1fd8e/triggers?apiKey=d0706e7e-33b6-4395-8420-8bb7d9fdf17d';
        xmattersLibrary.postxmatters(path, xmevent);
    
    }
