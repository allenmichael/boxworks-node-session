'use strict';
const box = require('box-node-sdk');
const { getBoxServiceAccount, errorHandlers, autoPage, filterSearchResultsToManagedUsers, collaborationWorkflow } = require('./util');
const _ = require('lodash');

let serviceAccountClient = getBoxServiceAccount();


module.exports = (filterTerm) => {
  console.log("Starting advanced mode...");
  autoPage.autoPageWithOffset(serviceAccountClient, 'enterprise', 'getUsers', null, { filter_term: filterTerm, fields: 'is_platform_access_only,login,name' })
    .then((filteredUsers) => {
      let user = filterSearchResultsToManagedUsers(filteredUsers);
      let userID;
      if (_.isEmpty(user)) {
        console.log(`No user found, creating managed user with the email ${filterTerm}`);
        return serviceAccountClient.enterprise.addUser(
          filterTerm,
          'BoxWorks User',
          {
            role: serviceAccountClient.enterprise.userRoles.COADMIN,
            address: '555 Box Lane'
          }
        );
      } else {
        return user;
      }
    })
    .then((user) => {
      console.log(`Found user. Using this ID: ${user.id}`);
      return collaborationWorkflow(serviceAccountClient, user.id);
    })
    .then((collabID) => {
      console.log(`Collab ID: ${collabID}`);
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      console.log(message);
    });
}