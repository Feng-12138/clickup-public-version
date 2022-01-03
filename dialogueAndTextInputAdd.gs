function onOpen(e) {
  // Create menu options
  SpreadsheetApp.getUi().createAddonMenu()
    .addItem("Upload Comments from Sheet", "wrapperUpdateComments")
    .addItem("Update Story Status from Sheet", "wrapperChangeStatus")
    .addSeparator()
    .addItem("Add tickets to clickup(text input)", "wrapperAddTickets")
    .addItem("Add tickets to clickup(options)", "wrapperAddTicketsOptions")
    .addSeparator()
    .addItem("Setting", 'SetOpenDialogue')
    .addItem("Remove API Key", "deleteAPIKey")
    .addToUi();
};

function SetOpenDialogue() {
  var myHtml = HtmlService.createHtmlOutputFromFile('setting')
    .setWidth(400)
    .setHeight(350);
  SpreadsheetApp.getUi().showModelessDialog(myHtml, 'Settings');
}


function Set_Properties(input) {
  JSON.stringify(input)
  var personal_token = input.token;
  var story_name = input.title;
  var story_description = input.description;
  var name_1 = story_name.trim().toUpperCase();
  var des_1 = story_description.trim().toUpperCase();
  var devices = input.devices.trim().toUpperCase();
  var results = input.results.trim().toUpperCase();
  var version = input.version.trim();
  var passed = input.passed.trim().toUpperCase();
  var blocked = input.blocked.trim().toUpperCase();
  var failed = input.failed.trim().toUpperCase();
  Logger.log(personal_token)
  if (personal_token.length > 0) {
    PropertiesService.getScriptProperties().setProperty('clickUp_PersonalKey', personal_token);
  }
  if (name_1.length > 0) {
    PropertiesService.getScriptProperties().setProperty('name_idx', Math.floor(name_1.charCodeAt() - 'A'.charCodeAt()));
  }
  if (des_1.length > 0) {
    PropertiesService.getScriptProperties().setProperty('des_idx', Math.floor(des_1.charCodeAt() - 'A'.charCodeAt()));
  }
  if (devices.length > 0) {
    PropertiesService.getScriptProperties().setProperty('devicesCol', Math.floor(devices.charCodeAt() - 'A'.charCodeAt()));
  }
  if (results.length > 0) {
    PropertiesService.getScriptProperties().setProperty('resultsCol', Math.floor(results.charCodeAt() - 'A'.charCodeAt()));
  }
  if (version.length > 0) {
    PropertiesService.getScriptProperties().setProperty('version', version);
  }
  if (passed.length > 0) {
    PropertiesService.getScriptProperties().setProperty('passed', passed);
  }
  if (blocked.length > 0) {
    PropertiesService.getScriptProperties().setProperty('blocked', blocked);
  }
  if (failed.length > 0) {
    PropertiesService.getScriptProperties().setProperty('failed', failed);
  }
}

function deleteAPIKey() {
    PropertiesService.getScriptProperties().deleteProperty('clickUp_PersonalKey');
}
  
  
  function openDialogForApiKeyInput() {
    //Call the HTML file and set the width and height
    // var html = HtmlService.createHtmlOutputFromFile("APIKeyDialog")
    //   .setWidth(450)
    //   .setHeight(300);
  
    // //Display the dialog
    // var dialog = ui.showModalDialog(html, "Select the relevant module and unit");
  
    var ui = SpreadsheetApp.getUi();
    var response = ui.prompt('Please Enter your ClickUp Details', 'Please Enter your ClickUp API Key', ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() == ui.Button.OK) {
      const apiKey = response.getResponseText()
      Logger.log('The user\'s API KEY is %s.', apiKey);
      // Set ClickUp API Key to Sheets Property (like a global variable)
      PropertiesService.getScriptProperties().setProperty('clickUp_PersonalKey', apiKey);
    } else {
      Logger.log('The user clicked the close button in the dialog\'s title bar.');
    }
  };

  function wrapperAddTickets() {
    if (notify() == false) {
      SetOpenDialogue();
      // Utilities.sleep(360000)
    } else {
      get_list_id()
    }
  }

  function get_row() {
    var ui = SpreadsheetApp.getUi();
    let retval = [];
    var response = ui.prompt("Starting Row(Included)",
        "Please Enter the First Row Number which You Want to Include", ui.ButtonSet.OK)
    if (response.getSelectedButton() == ui.Button.OK) {
      const first_row = response.getResponseText();
      retval.push(first_row);
      var response_2 = ui.prompt("Ending Row(Included)", 
        "Please Enter the Last Row Number which You Want to Include", ui.ButtonSet.OK)
      if (response_2.getSelectedButton() == ui.Button.OK) {
        const last_row = response_2.getResponseText();
        retval.push(last_row);
      }
    }
    return retval;
  }


  
  function get_list_id() {
    var ui = SpreadsheetApp.getUi();
    var firstRow = 0;
    var secondRow = 0;
    var firstRowResponse = ui.prompt("Please Enter the First Row Number", "Row Number of First Row", ui.ButtonSet.OK_CANCEL);
    if (firstRowResponse.getSelectedButton() == ui.Button.OK) {
      firstRow = firstRowResponse.getResponseText();
    } else {
      return;
    }
    var secondRowResponse = ui.prompt("Please Enter the Second Row Number", "Row Number of Last Row", ui.ButtonSet.OK_CANCEL);
    if (secondRowResponse.getSelectedButton() == ui.Button.OK) {
      secondRow = secondRowResponse.getResponseText();
    } else {
      return;
    }
    var response = ui.prompt("Please Enter your ClickUp Details", "Please enter your list id", ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() == ui.Button.OK) {
      const list_id = response.getResponseText();
      Logger.log('The list which new cards are added to is %s.', list_id);
      var response_2 = ui.prompt("Please Enter your ClickUp Details", "Please enter the status", ui.ButtonSet.OK_CANCEL);
      var response_3 = ui.prompt("Please Enter your ClickUp Details", "Please enter the assignees",
                                  ui.ButtonSet.OK_CANCEL);
      if (response_2.getSelectedButton() == ui.Button.OK && response_3.getSelectedButton() == ui.Button.OK) {
          const task_status = response_2.getResponseText();
          const assignees = response_3.getResponseText();
          const assignees_arr = assignees.split(', ');
          add_tickets(list_id, task_status, assignees_arr, firstRow, secondRow);
      } else if (response_2.getSelectedButton() == ui.Button.OK) {
        const task_status = response_2.getResponseText();
        add_tickets(list_id, task_status, [], firstRow, secondRow);
      } else if (response_3.getSelectedButton() == ui.Button.OK) {
        const assignees = response_3.getResponseText();
        const assignees_arr = assignees.split(', ')
        add_tickets(list_id, "", assignees_arr, firstRow, secondRow);
      } else {
        add_tickets(list_id, "", [], firstRow, secondRow);
      }
    } else {
      Logger.log('The user clicked the close button in the dialog\'s title bar.');
    }
  };
  
  function add_tickets(list_id, task_status, assignees_name, startRow, endRow) {
    var clickUp_PersonalKey = PropertiesService.getScriptProperties().getProperty('clickUp_PersonalKey');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var rowCount = Math.abs(parseInt(endRow) - parseInt(startRow)) + 1;
    var name = PropertiesService.getScriptProperties().getProperty('name_idx');
    var description = PropertiesService.getScriptProperties().getProperty('des_idx');
    Logger.log(description);
    var colCount = Math.abs(parseInt(name) - parseInt(description)) + 1;
    var range = sheet.getRange(parseInt(startRow), Math.min(name, description) + 1, rowCount, colCount);
    const allRequests = [];
    var options = {
    "method": "GET",
    "headers": {
      "authorization": clickUp_PersonalKey || "no api key",
      }
    };
    var jsondata = UrlFetchApp.fetch('https://api.clickup.com/api/v2/team', options);
    //Logger.log(JSON.parse(jsondata.getContentText()));
    var content = JSON.parse(jsondata.getContentText());
    var idx_1 = 0;
    var arr_user_id = [];
    while (idx_1 < content.teams[0].members.length) { //find assignees
      var idx_2 = 0;
      while (idx_2 < assignees_name.length) {
        if (assignees_name[idx_2] === content.teams[0].members[idx_1].user.username) {
          let str = String(content.teams[0].members[idx_1].user.id);
          let num = Number(str);
          arr_user_id.push(num);
          Logger.log(content.teams[0].members[idx_1].user.username);
        }
        ++idx_2;
        continue;
      }
      ++idx_1;
      continue;
    }
    const activeRangeValues = range.getValues();
    Logger.log(activeRangeValues)
    Logger.log(activeRangeValues)
    for (const row of activeRangeValues) {
      var namVal = 0;
      var desVal = 0;
      if (name < description) {
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
          "status": task_status
      };
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
    Logger.log(allRequests);
    try {
      UrlFetchApp.fetchAll(allRequests);
      SpreadsheetApp.getUi().alert("Successfully created new tickets");
    } catch (e) {
      //Logger.log(e);
      SpreadsheetApp.getUi().alert(e);
    }
  }

//add_tickets('104146392', 'open', 'eff', '3','7');
  
  
  
  // function openDialogForFolderUrlInput(apiKey) {
  //   var ui = SpreadsheetApp.getUi();
  //   var response = ui.prompt('Please Enter Project Details', 'What is the URL for the Folder you want stories from?', ui.ButtonSet.OK_CANCEL);
  //   if (response.getSelectedButton() == ui.Button.OK) {
  //     const folderURL = response.getResponseText()
  //     Logger.log('The user\'s FOLDER URL is is %s.', folderURL);
  //     openDialogForColumnNameToImportFrom(apiKey, folderURL)
  //   } else {
  //     Logger.log('The user clicked the close button in the dialog\'s title bar.');
  //   }
  // };
  // function openDialogForColumnNameToImportFrom(apiKey, folderURL) {
  //   var ui = SpreadsheetApp.getUi();
  //   var response = ui.prompt('Please Enter Sprint Details', 'What is the name of the Column you want stories from?', ui.ButtonSet.OK_CANCEL);
  //   if (response.getSelectedButton() == ui.Button.OK) {
  //     const folderName = response.getResponseText()
  //     Logger.log('The user\'s FOLDER URL is is %s.', folderURL);
  //     // open folder function and pass api key to that
  //     Logger.log(importClickup(apiKey, folderURL, folderName))
  //   } else {
  //     Logger.log('The user clicked the close button in the dialog\'s title bar.');
  //   }
  // };
  
  
  
  