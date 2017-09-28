'use strict';
const errorHandlers = require('./errorHandlers');
const isUserAlreadyCollaborator = require('./isUserAlreadyCollaborator');
const filterCollaborationsByUserID = require('./filterCollaborationsByUserID');

module.exports = (serviceAccountClient, collabType, collabItemID, userID, role, options) => {
  options = options || {};
  let itemType = options.type || 'folders';
  collabType = collabType || 'user';
  return serviceAccountClient.collaborations.create({ type: collabType, id: userID }, collabItemID, role, options)
    .then((collab) => {
      return collab.id;
    })
    .catch((err) => {
      let message = errorHandlers.errorHandler(err);
      console.log(message);
      if (isUserAlreadyCollaborator(message)) {
        return serviceAccountClient[itemType].getCollaborations(collabItemID)
          .then((collaborations) => {
            return filterCollaborationsByUserID(collaborations, userID).id;
          });
      } else {
        throw err;
      }
    });
}