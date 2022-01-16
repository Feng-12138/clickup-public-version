# Clickup_-_sheets
Let's do it man

This project is for those who feel interested on clickup <> sheet automation process
Feel free to participate in the project if you guys have limited amount of work on hand


Roadmap:

Completed tasks:
Able to upload tickets from spreadsheet to clickup

Users able to set the setting based on their spreadsheets

Users are able to see their current setting before take any actions and able to change thesetting though that pop up window

Upcoming tasks:
Modify the upload ticket function such that a pop up window will allow user to enter thestarting row and ending row of adding tickets, instead of select by mouse

Modify the upload ticket function such that allow users to select which list and which status they want.to add(use htmlservice)

Modify the add comment service

Modify change status service

Add help button to link to readme

Modify setting by adding the add to ticket mode


User guideline(demo of expected final product):
Add on columns contain these items:
Upload comment to ClickUp
Update Status of ClickUp
Add tickets to ClickUp
Setting
Help
For all of  “Upload comment to ClickUp”, “Update Status of ClickUp” and “Add tickets
to ClickUp”, as user clicks on one of them, a notify message will appear and shows user
current setting. If User click on “Yes”, then the function will show next dialogue,
otherwise, users will turn to setting page and modify their settings

1. Add comment to ClickUp:
It will automatically form comment with following format:
Passed QA v(from setting)/Failed QA v(from setting)
Tested Devices: (from setting) and write it in the comment section of tickets which
you would like to add comment on
The user is expected to enter the row number as input of dialogue after clicking on
“Add comment to ClickUp”
A success message will appear if everything goes right

2. Update Status of ClickUp:
Users are expected to select the corresponding status for Passed,
the corresponding status for blocked and the corresponding status for Fail after
clicking on “Update Status of ClickUp”. Same as “Add comment to ClickUp”, users
also are expected to enter the row number as input of dialogue after clicking on
“Update Status of ClickUp”
A success message will appear if everything goes right

3. Add tickets to ClickUp(selection mode):
Users are expected to:
First: enter the rows of spreadsheet which are new tickets
Second: select the button of list to add tickets
Third: Select the button of current status of new tickets
A success message will appear if everything goes right

Add tickets to ClickUp(text input mode):
Users are expected to:
First: enter the rows of spreadsheet which are new tickets
Second: Enter the list id which user wish the ticket to be added to
Third: Enter the status which new tickets will have
A success message will appear if everything goes right

4. Setting
Users are expected to enter following information to the setting and the setting will
maintain unless user clicks on setting again:
ClickUp personal token
Column letter of story title
Column letter of story description
Column letter of tested devices
Column letter of Pass/fail/block
Mode of Add tickets(select the button)

5. Help
User will be guided to github readme file for instructions

Current completed: Add tickets(two ways), update ticket status, add comments to tickets, setting and setting related notifications
Left to do: rewrite readMe, Help
