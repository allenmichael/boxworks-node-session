'use strict';
// In this exercise, we'll upload a file to the root folder of the Service Account.
// If the file already exists, we'll recover from the error and upload a new version of the file instead.
const box = require('box-node-sdk');
const fs = require('fs');
const { errorHandlers, isConflictError, constructPartsForUpload } = require('./util');
const uploadWithPreflight = require('./exercise2Advanced');

// This section creates a file to upload to Box.
// If you're running this exercise multiple times, you can change the filename string to avoid duplicate filename errors from Box
// Otherwise, this code handles conflicts and uploads a new version of the file if a name conflict is encountered.
const filename = 'test.txt';
// 0 is the root folder of any user in Box -- in this case, the Service Account's root folder. 
const parentFolderID = '0';
const preflightCommandOption = '--preflight';
fs.appendFileSync(filename, "I'm testing creating this file.");
let fileData = fs.readFileSync(filename);

// Again, the same setup for the SDK is used here to initialize a session with the Service Account.
// We'll offload this to a utility function in the next exercise.
let configFile = fs.readFileSync('config.json');
configFile = JSON.parse(configFile);
let session = box.getPreconfiguredInstance(configFile);
let serviceAccountClient = session.getAppAuthClient('enterprise');

// Add the --preflight argument to utilize Box's preflight upload check to verify a file is eligible for upload
if (process.argv.length >= 3 && process.argv[2] === '--preflight') {
  uploadWithPreflight();
} else {
  uploadFile();
}

function uploadFile() {
  // Using the primary SDK method for upload, supply the parent folder ID, file name, and the bytes of the file to upload.
  return serviceAccountClient.files.uploadFile(parentFolderID, filename, fileData)
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      // Here we check if there is a naming conflict error returned.
      if (isConflictError(err)) {
        // A common response to a conflict error would be to upload a new version of the file.
        // Below, I've outlined how to upload a new version.
        return handleConflictError(message);
      }
      console.log(message);
    })
    .then((uploadedFile) => {
      // Once file upload completes successfully, the function below logs info about the current version of the file.
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
  // Using the errorHandlers.js utility, I pull the file ID from the conflict error. 
  let fileID = errorHandlers.conflictErrorHandler(message);
  if (fileID !== '') {
    // Using the file ID from the conflict error, the SDK has a method for uploading a new version.
    return serviceAccountClient.files.uploadNewFileVersion(fileID, fileData);
  } else {
    throw new Error("An unknown error occured while retrieving this file's ID to upload a new version.");
  }
}