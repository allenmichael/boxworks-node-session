'use strict';
const errorHandlers = require('./errorHandlers');
const isConflictError = require('./isConflictError');
const constructPartsForUpload = require('./constructPartsForUpload');

const fs = require('fs');
const filename = 'test.txt';
const preflightCommandOption = '--preflight';
fs.appendFileSync(filename, "I'm testing creating this file.");
let fileData = fs.readFileSync(filename);

module.exports = (serviceAccountClient, parentFolderID) => {
  return serviceAccountClient.files.preflightUploadFile(parentFolderID, { name: filename, size: fileData.size }, null)
    .then((completedCheck) => {
      console.log(completedCheck);
      return serviceAccountClient.wrapWithDefaultHandler(serviceAccountClient.upload)(completedCheck.upload_url, null, constructPartsForUpload(filename, parentFolderID, fileData));
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      if (isConflictError(err)) {
        return errorHandlers.conflictErrorHandler(message);
      } else {
        throw err;
      }
    })
    .then((uploadedFile) => {
      let uploadedFileID;
      if (uploadedFile && uploadedFile.id) {
        uploadedFileID = uploadedFile.entries[0].id;
      } else {
        uploadedFileID = uploadedFile;
      }
      return uploadedFileID;
    })
    .catch((err) => {
      console.log(errorHandlers.errorHandler(err));
    });
}