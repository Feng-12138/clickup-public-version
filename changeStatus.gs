function wrapperChangeStatus() {
  if (notify() == false) {
    SetOpenDialogue();
  } else {
    changeStatusOpenDialogue()
  } 
}

function changeStatusOpenDialogue() {
  PropertiesService.getScriptProperties().setProperty('action', 'changeStatus');
  var myHtml = HtmlService.createHtmlOutputFromFile('space')
    .setWidth(300)
    .setHeight(150)
  SpreadsheetApp.getUi().showModelessDialog(myHtml, 'Project Name');
}

function updateStatus(form) {
  var passedStatus = form.mySelect;
  var blockedStatus = form.mySelect_2;
  var failedStatus = form.mySelect_3;
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var firstRow = form.firstRow;
  var lastRow = form.lastRow;
   var rowCount = Math.abs(parseInt(firstRow) - parseInt(lastRow)) + 1;
  var nameCol = PropertiesService.getScriptProperties().getProperty('name_idx');
  var desCol = PropertiesService.getScriptProperties().getProperty('des_idx');
  var resultsCol = PropertiesService.getScriptProperties().getProperty('resultsCol');
  var devicesCol = PropertiesService.getScriptProperties().getProperty('devicesCol');
  var firstCol = Math.min(parseInt(resultsCol), parseInt(nameCol), parseInt(desCol), parseInt(devicesCol));
  var lastCol = Math.max(parseInt(resultsCol), parseInt(nameCol), parseInt(desCol), parseInt(devicesCol));
  var colCount = Math.abs(firstCol - lastCol) + 1;
  var sheetPassed = PropertiesService.getScriptProperties().getProperty('passed');
  var sheetBlocked = PropertiesService.getScriptProperties().getProperty('blocked');
  var sheetFailed = PropertiesService.getScriptProperties().getProperty('failed');
  var range = sheet.getRange(parseInt(firstRow), firstCol + 1, rowCount, colCount);
  const allRequests = [];
  const activeRangeValues = range.getValues();
  var listId = PropertiesService.getScriptProperties().getProperty('listId');
  var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
    }
  };
  var jsondata = UrlFetchApp.fetch(`https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true`, options);
  var content = JSON.parse(jsondata.getContentText());
   for (const row of activeRangeValues) {
      var namVal = row[nameCol - firstCol];
      namVal = namVal.trim().split('\n');
      namVal = namVal.join();
      namVal = namVal.trim().split(' ');
      namVal = namVal.join();
      var idx = 0;
      while (idx < content.tasks.length) {
        var namTask = content.tasks[idx].name;
        namTask = namTask.trim().split('\n');
        namTask = namTask.join();
        namTask = namTask.trim().split(' ');
        namTask = namTask.join();
        var taskId = 0;
        if (namTask == namVal) {
          taskId = content.tasks[idx].id;
          var body = {};
          var resultSheet = row[resultsCol - firstCol];
          resultSheet = resultSheet.trim().toUpperCase();
          if (resultSheet == sheetPassed) {
            body = {
              'status': passedStatus
            };
          }
          if (resultSheet == sheetBlocked) {
            body = {
              'status': blockedStatus
            };
          }
          if (resultSheet == sheetFailed) {
            body = {
              'status': failedStatus
            };
          }
          const request = {
            'url': `https://api.clickup.com/api/v2/task/${taskId}/`,
            'method': 'put',
            'payload': body,
            "headers": {
              "authorization": clickUp_PersonalKey || "no api key",
              }
            };
          allRequests.push(request);
        }
        ++idx;
      }
   }
   Logger.log(content);
   try {
      UrlFetchApp.fetchAll(allRequests);
      SpreadsheetApp.getUi().alert("Successfully updated Comments");
    } catch (e) {
      Logger.log(e)
      SpreadsheetApp.getUi().alert(e);
  }
}