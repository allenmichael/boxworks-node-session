'use strict';
const USER_ALREADY_COLLABORATOR = 'user_already_collaborator';

module.exports = (body) => {
  if(body && body.code && body.code === USER_ALREADY_COLLABORATOR) {
    return true;
  } else {
    return false;
  }
}