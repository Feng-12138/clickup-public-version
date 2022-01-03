function notify() {
  var name = PropertiesService.getScriptProperties().getProperty('name_idx');
  if (name == null) {
    name = 'no entered value';
  } else {
    name = String.fromCharCode(parseInt(name) + 65);
  }
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  if (clickUp_PersonalKey == null) {
    clickUp_PersonalKey = 'no entered value';
  }
  Logger.log(clickUp_PersonalKey)
  var description = PropertiesService.getScriptProperties().getProperty('des_idx');
  if (description == null) {
    description = 'no entered value';
  } else {
    description = String.fromCharCode(parseInt(description) + 65);
  }
  var devices = PropertiesService.getScriptProperties().getProperty('devicesCol');
  if (devices == null) {
    devices = 'no entered value';
  } else {
    devices = String.fromCharCode(parseInt(devices) + 65);
  }
  var results = PropertiesService.getScriptProperties().getProperty('resultsCol');
  if (results == null) {
    results = 'no entered value';
  } else {
    results = String.fromCharCode(parseInt(results) + 65);
  }
  var version = PropertiesService.getScriptProperties().getProperty('version');
  if (version == null) {
    version = 'no entered value';
  }
  var passed = PropertiesService.getScriptProperties().getProperty('passed');
  if (passed == null) {
    passed = 'no entered value';
  }
  var blocked = PropertiesService.getScriptProperties().getProperty('blocked');
  if (blocked == null) {
    blocked = 'no entered value';
  }
  var failed = PropertiesService.getScriptProperties().getProperty('failed');
  if (failed == null) {
    failed = 'no entered value';
  }
  var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
    }
  };
  var jsondata = '';
  var object = {};
  var UserName = '';
  try {
    jsondata = UrlFetchApp.fetch("https://api.clickup.com/api/v2/user", options);
    object = JSON.parse(jsondata.getContentText());
    UserName = object.user.username;
  } catch(e) {
    UserName = "Invalid User or User does not exist";
  }
  let output = "Current User: " + UserName + "\n" +
    "Column of Story Name: " + name + '\n' + "Column of Story Description: " + description + '\n' +
    "Column of Tested Devices: " + devices + '\n' + 'Column of Test Results: ' + results + '\n' + 
    'Current Build Version: ' + version +'\n' + '\n' + "The word correponds to Passed: " + passed + '\n'
    + "The word correponds to Blocked: " + blocked + '\n' + "The word correponds to Failed: " + failed + '\n' + '\n'
    + '\n' + '\n' + '\n' + "Is current setting information CORRECT?";
  Logger.log(output);
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Current Setting', output, ui.ButtonSet.YES_NO);
  if (response == ui.Button.NO) {
    return false
  } else {
    return true
  }
};





