'use strict';
// In this exercise, we'll set up and initialize the Box Node SDK. 
// To verify everything is working after we created our Box applications, we'll log out the Service Account login field.
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
        // We log the Service Account's login information which is a special generated email address.
        // The email address should resemble AutomationUser...@boxdeveloperedition.com
        console.log(serviceAccountUser.login);
    })
    .catch(err => {
        // Check the errorHandler.js file under ./util to see how we handle errors with the Node.js SDK
        console.log(errorHandlers.errorHandler(err));
    });