'use strict';
const ITEM_LIMIT = 100;
const Promise = require('bluebird');
const asyncFunc = Promise.coroutine;

class BoxAutoPageUtilities {

  static autoPageWithOffset(client, manager, methodName, id, options) {
    return asyncFunc(function* () {
      let collection = [];
      options = options || {};
      options.offset = options.offset || 0;
      options.limit = options.limit || ITEM_LIMIT;
      return yield continuePagingWithOffset(client, manager, methodName, id, options, collection, options.offset);
    })();

    function continuePagingWithOffset(client, manager, methodName, id, options, collection, offset) {
      return asyncFunc(function* () {
        var keepGoing = true;
        options.offset = offset;
        let results;
        if (id) {
          results = yield client[manager][methodName](id, options);
        } else {
          results = yield client[manager][methodName](options);
        }
        let entries = results.entries || results.item_collection.entries;
        collection = collection.concat(entries);
        offset += options.limit;
        keepGoing = entries.length >= options.limit;
        if (keepGoing) {
          return yield continuePagingWithOffset(client, manager, methodName, id, options, collection, offset);
        } else {
          return { entries: collection, total_count: collection.length };
        }
      })();
    }
  }
}

module.exports = BoxAutoPageUtilities;