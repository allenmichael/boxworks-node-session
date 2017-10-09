'use strict';
// In this exercise, we'll create a webhook on the folder we just created. 
// To trigger the webhook, you can use the Managed User collaborated on the folder to upload files to this folder.
// Once the webhook is created, you can run the webhook listener to view notifications sent by Box for the trigger we register.
// Alternatively, you can use a service like RequestBin simply to capture info for the notification.
const { getBoxServiceAccount, errorHandlers, filterSearchResultsToManagedUsers, collaborationWorkflow } = require('./util');
const _ = require('lodash');
const fs = require('fs');

// We're setting a webhook on a folder
const webhookType = "folder";
// You'll need to replace this URL with the URL of your own ngrok URL or RequestBin URL.
const webhookURI = "https://amsxbg.ngrok.io";
// You can change the trigger, but we'll activate this webhook by uploading 
const triggerTypes = ['FILE.UPLOADED'];

let serviceAccountClient = getBoxServiceAccount();
try {
  // After running Exercise 3, the created folder's ID is stored in a JSON file. 
  // db.json only has a "folderID" field. For example: {"folderID":"38209889442"}
  let folder = JSON.parse(fs.readFileSync('db.json'));
  // Using the folder ID that your Managed User was added to and the webhook type, URI, and trigger, we use the SDK method to register the webhook.
  serviceAccountClient.webhooks.create(folder.folderID, webhookType, webhookURI, triggerTypes)
    .then((createdWebhook) => {
      console.log(createdWebhook);
      return createdWebhook.id;
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      console.log(message);
      // In case the webhook already exists, we handle the conflict error.
      return errorHandlers.conflictErrorHandler(message);
    })
    .then((webhookID) => {
      console.log(webhookID);
    });
} catch (e) {
  console.log("Couldn't process a folder, be sure to run Exercise 3 before moving to Exercise 4.");
  throw e;
}