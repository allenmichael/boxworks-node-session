'use strict';
const _ = require('lodash');

module.exports = (collaborations, userID) => {
  if (collaborations.entries && collaborations.entries.length > 0) {
    let filteredCollaborations = _.filter(collaborations.entries, (entry) => { return entry.accessible_by.id === userID; });
    return _.first(filteredCollaborations);
  } else {
    return {};
  }
}