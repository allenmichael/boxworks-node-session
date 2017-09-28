'use strict';
const box = require('box-node-sdk');
const fs = require('fs');

let configFile = fs.readFileSync('config.json');
configFile = JSON.parse(configFile);

module.exports = (config) => {
  config = config || {};
  let session = box.getPreconfiguredInstance(configFile);
  let client = session.getAppAuthClient('enterprise');
  client._useIterators = config.iterators || false;
  return client;
}