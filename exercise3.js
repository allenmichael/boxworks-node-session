'use strict';
const { getBoxServiceAccount, errorHandlers, filterSearchResultsToManagedUsers, collaborationWorkflow } = require('./util');
const _ = require('lodash');
const exercise3Advanced = require('./exercise3Advanced');

let serviceAccountClient = getBoxServiceAccount();
let filterTerm = '';
let mode = '--easy';

if (process.argv.length >= 3) {
  filterTerm = process.argv[2];
} else {
  throw new Error("Please provide a filter term for searching Enterprise users.");
}

if (process.argv.length >= 4 && (process.argv[3] === '--easy' || process.argv[3] === '--advanced')) {
  console.log(`Setting mode to ${process.argv[3]}`);
  mode = process.argv[3];
} else {
  console.log("Using easy mode...");
}

if (mode === '--easy') {
  console.log("Starting easy mode...");
  serviceAccountClient.enterprise.getUsers({ filter_term: filterTerm, fields: 'is_platform_access_only,login,name' })
    .then((filteredUsers) => {
      let user = filterSearchResultsToManagedUsers(filteredUsers);
      return collaborationWorkflow(serviceAccountClient, user.id);
    })
    .then((collabID) => {
      console.log(`Collab ID: ${collabID}`);
    })
    .catch(err => {
      console.log(errorHandlers.errorHandler(err));
    });
} else {
  exercise3Advanced(filterTerm);
}



