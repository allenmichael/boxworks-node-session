'use strict';
const createFolderOrGetExistingID = require('./createFolderOrGetExistingID');
const uploadFileOrGetExistingID = require('./uploadFileOrGetExistingID');
const createCollaborationOrGetExistingID = require('./createCollaborationOrGetExistingID');

const folderName = 'simple-collab';
const parentFolderID = '0';
const role = 'editor';
const type = 'user';

let folderIDToCollab;

module.exports = (serviceAccountClient, userID) => {
  console.log("Starting workflow");
  return createFolderOrGetExistingID(serviceAccountClient, parentFolderID, folderName)
    .then((folderID) => {
      console.log("Created folder");
      folderIDToCollab = folderID;
      return uploadFileOrGetExistingID(serviceAccountClient, folderID);
    })
    .then((fileID) => {
      return createCollaborationOrGetExistingID(serviceAccountClient, type, folderIDToCollab, userID, role, null);
    })
    .then((collabID) => {
      console.log("Collaboration workflow complete.");
      return collabID;
    });
}