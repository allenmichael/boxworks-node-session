const _ = require('lodash');

module.exports = (results) => {
  if (results.entries && results.entries.length > 0) {
    let managedUsersOnly = _.filter(results.entries, (entry) => { return entry.is_platform_access_only === false; });
    return _.first(managedUsersOnly);
  } else {
    return {};
  }
}