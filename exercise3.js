'use strict';
// In this exercise, we'll search for an existing Managed User in our Box Enterprise.
// Then, we'll create a new folder in the Service Account and collaborate the Managed User to have "editor" access to the folder.
// Be sure to supply an email address of an existing Managed User when running this exercise. For example, "node exercise3.js agrobelny@box.com"
const { getBoxServiceAccount, errorHandlers, filterSearchResultsToManagedUsers, collaborationWorkflow } = require('./util');
const _ = require('lodash');
const exercise3Advanced = require('./exercise3Advanced');

// Here the SDK setup and initialization is offloaded to a utility method.
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
  // We filter users based on their name or login -- in this case, we're looking for login. In Box, a Managed User's login is an email address.
  // However, App Users often use the "name" field as a place for an email address since the "login" field is auto-generated.

  // We need the "is_platform_access_only" field so that we can differentiate between App Users and Managed Users.
  // So, we use the "fields" option to tell Box which data fields to return about the users.
  // The "is_platform_access_only" field will be set to true for all App Users.
  serviceAccountClient.enterprise.getUsers({ filter_term: filterTerm, fields: 'is_platform_access_only,login,name' })
    .then((filteredUsers) => {
      // Using a utility function, we assess the returned array of users to check for a user whose "login" field matches the email address supplied.
      let user = filterSearchResultsToManagedUsers(filteredUsers);
      if (user && user.id) {
        // If found, we start the collaboration process:
        // 1. Create a folder in the Service Account root folder.
        // 2. Upload our test file to the new folder.
        // 3. Collaborate the Managed User as an "editor" on the folder -- thus granting access to the test file as well.
        // Each step has a utility function that checks for conflicts for an existing folder, an existing file in that folder, and an existing collaboration.
        // The functions are built to recover from each conflict error that may arise from the API for this collaboration process.
        return collaborationWorkflow(serviceAccountClient, user.id);
      } else {
        throw new Error("Couldn't find a user with that filter term.");
      }
    })
    .then((collabID) => {
      // The collaboration ID is logged to the console.
      console.log(`Collab ID: ${collabID}`);
    })
    .catch(err => {
      console.log(errorHandlers.errorHandler(err));
    });
} else {
  // The --advanced version of this will create a new user if one doesn't yet exist.
  exercise3Advanced(filterTerm);
}



