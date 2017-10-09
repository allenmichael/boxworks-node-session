# BoxWorks Node SDK Quickstart
## Introduction
This Box Node SDK Quickstart will walk you through creating your first Box application and running some exercises for common actions taken with a Box Service Account.


For more information on using Box as a developer, visit our [Box Developer site](https://developer.box.com/)
#### Step 1. Create a Box application
1. Log into the [Box Developer Console](https://developers.box.com) in your Box developer account
2. Select "Create New App"
    * Select "Custom App" and press "Next"
    * Select "OAuth 2.0 with JWT (Server Authentication)" and press "Next"
    * Name the application "BoxWorks Node SDK Quickstart - YOUR NAME"
        * *Application names must be unique across Box*
    * Press "Create App" and then "View Your App"
3. Press "Generate a Public/Private Keypair"
    * *You may need to enter a 2-factor confirmation code*
    * Save the JSON config file, which contains your application's secret key

#### Step 2. Authorize the application into your Box account
1. Log into your Box developer account as an admin and go to the [Apps Tab](https://app.box.com/master/settings/openbox) of Enterprise Settings
    * *Applications that use Server Authentication must be authorized by the admin of the enterprise*
2. Under "Custom Applications", press "Authorize New App"
3. Enter your "Client ID" from the developer console in the "API Key" field
4. Your application is now authorized to access your Box account!

#### Step 3. Run the exercises
1. Make sure you've installed [Node.js](https://nodejs.org)
2. Add your Box configuration file and name is `config.json`.
3. Run each exercise with Node. For example, `node exercise1.js`.

Support
-------

Need to contact us directly? You can post to the
[Box Developer Forum](https://community.box.com/t5/Developer-Forum/bd-p/DeveloperForum);
please be sure to mention the Node.js SDK in the subject.

Copyright and License
---------------------

Copyright 2017 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.