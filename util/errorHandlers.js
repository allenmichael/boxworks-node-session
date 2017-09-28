'use strict';
const _ = require('lodash');

module.exports = {
  errorHandler: (err) => {
    let message;
    if (err.response && err.response.body) {
      message = err.response.body;
    } else {
      message = err.toString();
    }
    return message;
  },
  conflictErrorHandler: (body) => {
    let conflictItemId = '';
    if (body && body.context_info && body.context_info.errors) {
      let message = _.first(body.context_info.errors).message;
      let temp = message.split(":")[1];
      conflictItemId = _.first(temp.split(" "));
    }
    if (body && body.context_info && body.context_info.conflicts && _.isArray(body.context_info.conflicts)) {
      conflictItemId = _.first(body.context_info.conflicts).id;
    }
    if (body && body.context_info && body.context_info.conflicts && body.context_info.conflicts.id) {
      conflictItemId = body.context_info.conflicts.id;
    }
    return conflictItemId;
  }
}