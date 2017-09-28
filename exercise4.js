'use strict';
const { getBoxServiceAccount, errorHandlers, filterSearchResultsToManagedUsers, collaborationWorkflow } = require('./util');
const _ = require('lodash');
const fs = require('fs');

const webhookType = "folder";
const webhookURI = "https://amsxbg.ngrok.io";
const triggerTypes = ['FILE.UPLOADED'];

let serviceAccountClient = getBoxServiceAccount();
try {
  let folder = JSON.parse(fs.readFileSync('db.json'));
  serviceAccountClient.webhooks.create(folder.folderID, webhookType, webhookURI, triggerTypes)
    .then((createdWebhook) => {
      console.log(createdWebhook);
      return createdWebhook.id;
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      console.log(message);
      return errorHandlers.conflictErrorHandler(message);
    })
    .then((webhookID) => {
      console.log(webhookID);
    });
} catch (e) {
  console.log("Couldn't process a folder, be sure to run Exercise 3 before moving to Exercise 4.");
  throw e;
}