'use strict';
const box = require('box-node-sdk');
const fs = require('fs');
const { errorHandlers, isConflictError, constructPartsForUpload, getBoxServiceAccount } = require('./util');

const filename = 'test.txt';
const parentFolderID = '0';
const preflightCommandOption = '--preflight';
fs.appendFileSync(filename, "I'm testing creating this file.");
let fileData = fs.readFileSync(filename);

let serviceAccountClient = getBoxServiceAccount();

function handleUploadSuccess(uploadedFile) {
  console.log(uploadedFile);
  console.log("Current version info:");
  console.log(uploadedFile.entries[0].file_version);
}

function handleConflictError(message) {
  let fileID = errorHandlers.conflictErrorHandler(message);
  if (fileID !== '') {
    return serviceAccountClient.files.uploadNewFileVersion(fileID, fileData);
  } else {
    throw new Error("An unknown error occured while retrieving this file's ID to upload a new version.");
  }
}

module.exports = () => {
  return serviceAccountClient.files.preflightUploadFile(parentFolderID, { name: filename, size: fileData.size }, null)
    .then((completedCheck) => {
      console.log(completedCheck);
      return serviceAccountClient.wrapWithDefaultHandler(serviceAccountClient.upload)(completedCheck.upload_url, null, constructPartsForUpload(filename, parentFolderID, fileData));
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      if (isConflictError(err)) {
        return handleConflictError(message);
      }
      console.log(message);
    })
    .then((uploadedFile) => {
      handleUploadSuccess(uploadedFile);
    })
    .catch((err) => {
      console.log(errorHandlers.errorHandler(err));
    });
}