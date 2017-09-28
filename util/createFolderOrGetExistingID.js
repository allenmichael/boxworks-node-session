'use strict';
const errorHandlers = require('./errorHandlers');
const isConflictError = require('./isConflictError');
const fs = require('fs');

module.exports = (serviceAccountClient, parentFolderID, folderName) => {
  return serviceAccountClient.folders.create(parentFolderID, folderName)
    .then((createdFolder) => {
      return createdFolder.id;
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      if (isConflictError(err)) {
        console.log("Folder exists...");
        let folderID = errorHandlers.conflictErrorHandler(message);
        console.log(folderID);
        return folderID;
      } else {
        throw err;
      }
    })
    .then((folderID) => {
      console.log("Returning folder ID");
      try {
        fs.readFileSync('db.json');
      } catch (e) {
        fs.writeFileSync('db.json', JSON.stringify({ folderID }));
      }
      return folderID;
    });
}