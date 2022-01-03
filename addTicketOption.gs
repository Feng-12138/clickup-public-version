// helper function:
function getTeamId() {
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
    }
  };
  var jsondata = UrlFetchApp.fetch("https://api.clickup.com/api/v2/team", options);
  var object = JSON.parse(jsondata.getContentText())
  var teamId = object.teams[0].id;
  var teamIdGlobal = parseInt(teamId);
  return teamIdGlobal;
}


function wrapperAddTicketsOptions() {
    if (notify() == false) {
      SetOpenDialogue();
    } else {
      spaceOpenDialogue()
    }
  }

function chooseSpace() {
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
    }
  };
  var teamIdGlobal = getTeamId();
  Logger.log(teamIdGlobal);
  var jsondata = UrlFetchApp.fetch(`https://api.clickup.com/api/v2/team/${teamIdGlobal}/space?archived=false`, options);
  var object = JSON.parse(jsondata.getContentText());
  Logger.log(object);
  var retval = [];
  var idx = 0;
  var lenSpaces = object.spaces.length;
  while (idx < lenSpaces) {
    retval.push(object.spaces[idx].name);
    ++idx;
  }
  Logger.log(retval);
  return retval;
}


function spaceOpenDialogue() {
  PropertiesService.getScriptProperties().setProperty('action', 'add');
  var myHtml = HtmlService.createHtmlOutputFromFile('space')
    .setWidth(300)
    .setHeight(150)
  SpreadsheetApp.getUi().showModelessDialog(myHtml, 'Project Name');
}

function lstOpenDialogue(form) {
  JSON.stringify(form);
  PropertiesService.getScriptProperties().setProperty('projectName', form.mySelect);
  var myHtml = HtmlService.createHtmlOutputFromFile('list')
    .setWidth(300)
    .setHeight(150)
  SpreadsheetApp.getUi().showModelessDialog(myHtml, 'List Name');
}

function chooseList() {
  var space = PropertiesService.getScriptProperties().getProperty('projectName');
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
    }
  };
  var teamIdGlobal = getTeamId();
  Logger.log(teamIdGlobal);
  var jsondata = UrlFetchApp.fetch(`https://api.clickup.com/api/v2/team/${teamIdGlobal}/space?archived=false`, options);
  var object = JSON.parse(jsondata.getContentText())
  var lenSpaces = object.spaces.length;
  var idx = 0;
  var spaceId = 0;
  while (idx < lenSpaces) {
    if (space === object.spaces[idx].name) {
      spaceId = object.spaces[idx].id;
      break
    }
    ++idx;
  }
  PropertiesService.getScriptProperties().setProperty('spaceId', spaceId);
  var jsondataFolder = UrlFetchApp.fetch(`https://api.clickup.com/api/v2/space/${spaceId}/folder?archived=false`, options);
  var objectFolder = JSON.parse(jsondataFolder.getContentText());
  var idxFol = 0;
  var retval = [];
  Logger.log(objectFolder.folders[0].lists);
  while (idxFol < objectFolder.folders.length) {
    var idxLst = 0;
    retval.push(objectFolder.folders[idxFol].name + ' Separator:');
    while (idxLst < objectFolder.folders[idxFol].lists.length) {
      retval.push(objectFolder.folders[idxFol].lists[idxLst].name);
      ++idxLst;
    }
    ++idxFol;
  }
  Logger.log(retval)
  return retval
}

function staOpenDialogue(form) {
  JSON.stringify(form);
  PropertiesService.getScriptProperties().setProperty('List', form.mySelect);
  var action = PropertiesService.getScriptProperties().getProperty('action');
  if (action == 'add') {
    var myHtml = HtmlService.createHtmlOutputFromFile('status')
      .setWidth(300)
      .setHeight(150)
    SpreadsheetApp.getUi().showModelessDialog(myHtml, 'Ticket Status');
  } else {
    var myHtml = HtmlService.createHtmlOutputFromFile('comment')
      .setWidth(300)
      .setHeight(350)
    SpreadsheetApp.getUi().showModelessDialog(myHtml, 'Select Range');
  }
}

function chooseSta() {
  var lst = PropertiesService.getScriptProperties().getProperty('List');
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  var spaceId = PropertiesService.getScriptProperties().getProperty('spaceId');
  var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
    }
  };
  var jsondataFolder = UrlFetchApp.fetch(`https://api.clickup.com/api/v2/space/${spaceId}/folder?archived=false`, options);
  var objectFolder = JSON.parse(jsondataFolder.getContentText());
  var idxFol = 0;
  var retval = [];
  Logger.log(lst);
  var lstId = 0;
  var retval = [];
  while (idxFol < objectFolder.folders.length) {
    var idxLst = 0;
    while (idxLst < objectFolder.folders[idxFol].lists.length) {
      if (lst === objectFolder.folders[idxFol].lists[idxLst].name) {
        PropertiesService.getScriptProperties().setProperty('listId', objectFolder.folders[idxFol].lists[idxLst].id);
        var idx = 0;
        while (idx < objectFolder.folders[idxFol].lists[idxLst].statuses.length) {
          retval.push(objectFolder.folders[idxFol].lists[idxLst].statuses[idx].status);
          ++idx;
          continue; 
        }
        Logger.log(retval);
        return retval;
      }
      ++idxLst;
    }
    ++idxFol;
  }
  return retval;
}

function wrapperCheckStatus(form) {
  var action = PropertiesService.getScriptProperties().getProperty('action');
  Logger.log(action);
  if (action === 'add') {
    addTicketsOption(form);
  } else if (action === 'comment') {
  }
}

function addTicketsOption(form) {
  var status = form.mySelect;
  var firstRow = form.firstRow;
  var lastRow = form.lastRow;
  Logger.log(status);
  Logger.log(firstRow);
  Logger.log(lastRow);
  var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var rowCount = Math.abs(parseInt(firstRow) - parseInt(lastRow)) + 1;
  var nameCol = PropertiesService.getScriptProperties().getProperty('name_idx');
  var desCol = PropertiesService.getScriptProperties().getProperty('des_idx');
  var colCount = Math.abs(parseInt(nameCol) - parseInt(desCol)) + 1;
  var range = sheet.getRange(parseInt(firstRow), Math.min(nameCol, desCol) + 1, rowCount, colCount);
  const allRequests = [];
  const activeRangeValues = range.getValues();
  for (const row of activeRangeValues) {
      var namVal = 0;
      var desVal = 0;
      if (nameCol < desCol) {
        namVal = row[0];
        desVal = row[colCount - 1];
      } else {
        desVal = row[0];
        namVal = row[colCount - 1];
      }
      var body = {
          "name": namVal,
          "description": desVal,
          // "assignees": arr_user_id,
          "status": status
      };
      var list_id = PropertiesService.getScriptProperties().getProperty('listId');
      const request = {
        'url': `https://api.clickup.com/api/v2/list/${list_id}/task`,
        'method': 'post',
        'payload': body,
        "headers": {
          "authorization": clickUp_PersonalKey || "no api key"
        }
      };
      allRequests.push(request)
    }
    try {
      UrlFetchApp.fetchAll(allRequests);
      SpreadsheetApp.getUi().alert("Successfully created new tickets");
    } catch (e) {
      //Logger.log(e);
      SpreadsheetApp.getUi().alert(e);
    }
  }




