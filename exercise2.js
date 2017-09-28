'use strict';
const box = require('box-node-sdk');
const fs = require('fs');
const { errorHandlers, isConflictError, constructPartsForUpload } = require('./util');
const uploadWithPreflight = require('./exercise2Advanced');

const filename = 'test6.txt';
const parentFolderID = '0';
const preflightCommandOption = '--preflight';
fs.appendFileSync(filename, "I'm testing creating this file.");
let fileData = fs.readFileSync(filename);

let configFile = fs.readFileSync('config.json');
configFile = JSON.parse(configFile);
let session = box.getPreconfiguredInstance(configFile);
let serviceAccountClient = session.getAppAuthClient('enterprise');

if (process.argv.length >= 3 && process.argv[2] === '--preflight') {
  uploadWithPreflight();
} else {
  uploadFile();
}

function uploadFile() {
  return serviceAccountClient.files.uploadFile(parentFolderID, filename, fileData)
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
    });;
}

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