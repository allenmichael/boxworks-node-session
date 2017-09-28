'use strict';
const box = require('box-node-sdk');
const fs = require('fs');
const { errorHandlers } = require('./util');

// Load and parse the auto-generated config file from creating your Box Application in the Developer Console
let configFile = fs.readFileSync('config.json');
configFile = JSON.parse(configFile);

// Initialize Box Node SDK with the parsed config file and create a client scoped to the Service Account
// The Service Account is created within a Box Enterprise when you install your Box Application
// The Service Account is similar to a co-admin account but is purely accessed through App Auth with JWT
let session = box.getPreconfiguredInstance(configFile);
let serviceAccountClient = session.getAppAuthClient('enterprise');

// You can see here that the Service Account is itself a user, so it can do similar things to what a user can.
// A Service Account can own content, be collaborated on content, and do admin level actions like create metadata templates and users.
// The Service Account also serves as the backbone of your application and is often used to manage both App and Managed users in your Box Enterprise.
serviceAccountClient.users.get('me', null)
    .then((serviceAccountUser) => {
        // We log 
        console.log(serviceAccountUser.login);
    })
    .catch(err => {
        console.log(errorHandlers.errorHandler(err));
    });