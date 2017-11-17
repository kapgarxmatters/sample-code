var summary = "SPLUNK ALERT: " + callback.eventProperties['name'];
  
  var description = "*SPLUNK ALERT* \n";
  description += "*alert.expires*:"          + callback.eventProperties['alert.expires']        + "\n";
  description += "*app*:"                    + callback.eventProperties['app']                  + "\n";
  description += "*name*:"                   + callback.eventProperties['name']                 + "\n";
  description += "*owner*:"                  + callback.eventProperties['owner']                + "\n";
  description += "*result.host*:"            + callback.eventProperties['result.host']          + "\n";
  description += "*result.source*:"          + callback.eventProperties['result.source']        + "\n";
  description += "*result.sourcetype*:"      + callback.eventProperties['result.sourcetype']    + "\n";
  description += "*result.splunk_server*:"   + callback.eventProperties['result.splunk_server'] + "\n";
  description += "*results_link*:"           + callback.eventProperties['results_link']         + "\n";
  description += "*search*:"                 + callback.eventProperties['search']               + "\n"; 
