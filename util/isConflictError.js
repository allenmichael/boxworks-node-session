'use strict';
const _ = require('lodash');
module.exports = (err) => {
  let conflictID;
  if (err.response && err.response.body && err.response.body.context_info && err.response.body.context_info.conflicts && _.isArray(err.response.body.context_info.conflicts)) {
    conflictID = _.first(err.response.body.context_info.conflicts).id;
  }
  if (err.response && err.response.body && err.response.body.context_info && err.response.body.context_info.conflicts && err.response.body.context_info.conflicts.id) {
    conflictID = err.response.body.context_info.conflicts.id;
  }
  return !(_.isEmpty(conflictID));
}