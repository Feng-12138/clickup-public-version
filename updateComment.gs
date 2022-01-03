function wrapperUpdateComments() {
  if (notify() == false) {
    SetOpenDialogue();
  } else {
    commentOpenDialogue()
  }
}

function commentOpenDialogue() {
  PropertiesService.getScriptProperties().setProperty('action', 'comment');
  var myHtml = HtmlService.createHtmlOutputFromFile('space')
    .setWidth(300)
    .setHeight(150)
  SpreadsheetApp.getUi().showModelessDialog(myHtml, 'Project Name');
}

function updateComments(form) {
  var firstRow = form.firstRow;
  var lastRow = form.secondRow;
  chooseSta();
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var version = PropertiesService.getScriptProperties().getProperty('version');
  var rowCount = Math.abs(parseInt(firstRow) - parseInt(lastRow)) + 1;
  var nameCol = PropertiesService.getScriptProperties().getProperty('name_idx');
  var desCol = PropertiesService.getScriptProperties().getProperty('des_idx');
  var resultsCol = PropertiesService.getScriptProperties().getProperty('resultsCol');
  var devicesCol = PropertiesService.getScriptProperties().getProperty('devicesCol');
  var firstCol = Math.min(parseInt(resultsCol), parseInt(nameCol), parseInt(desCol), parseInt(devicesCol));
  var lastCol = Math.max(parseInt(resultsCol), parseInt(nameCol), parseInt(desCol), parseInt(devicesCol));
  var colCount = Math.abs(firstCol - lastCol) + 1;
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
  Logger.log(content);
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
          var comment = '';
          if (row[devicesCol - firstCol] != '') {
            comment = row[resultsCol - firstCol] + " QA " + version + "\nTested Devices:\n" + row[devicesCol - firstCol];
          } else {
            comment = row[resultsCol - firstCol] + " QA " + version + "\n No devices tested yet"
          }
          var body = {
            'comment_text': comment
            };
          const request = {
            'url': `https://api.clickup.com/api/v2/task/${taskId}/comment`,
            'method': 'post',
            'payload': body,
            "headers": {
              "authorization": clickUp_PersonalKey || "no api key",
              }
            };
          allRequests.push(request)
        }
        ++idx;
        continue;
      }
    }
    try {
      UrlFetchApp.fetchAll(allRequests);
      SpreadsheetApp.getUi().alert("Successfully updated Tickets' Statuses");
    } catch (e) {
      Logger.log(e)
      SpreadsheetApp.getUi().alert(e);
  }
}