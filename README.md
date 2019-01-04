# Tool to export/import Workplace Community users and groups

Right now this CLI only supports changing a user e-mail, but additional features will be available in the future.

## Important:

1. This tool will export all users and groups, except MCGs (Multi Company Groups).
2. The "Default Group" information will be exported, but since this is a read-only group setting, it will not be imported. You need to set it manually as needed.
3. If you are exporting users that are using SSO, don't forget to enable SSO on the target community before running this script.

## The basics

### Download, build and deploy the project

1. [Install Node 6.x](https://nodejs.org), this will be our server environment. Then open up Terminal (or whatever your CLI might be) and make sure you're running the latest version of npm, installed globally (the ```-g``` switch):

    ```
    sudo npm install npm -g
    ```

2. Clone this project and switch into the project directory.

    ```
    git clone https://github.com/saitoapp/wp-exportimport.git
    cd wp-exportimport
    ```

3. Install Node dependencies.

    ```
    npm install
    ```

### Setup your Workplace App on the Source Community

1. In the Company Dashboard, open the Integrations tab.
2. Click on the Create App button.
3. Choose a relevant name and description for the app.
4. Choose the required [permissions](https://developers.facebook.com/docs/workplace/integrations/custom-integrations/permissions) for the app, you will need the "Manage Accounts" and "Read Group Content" permission.
5. Create, Copy and safely store the [access token](https://developers.facebook.com/docs/workplace/integrations/custom-integrations/permissions#appaccesstoken) that's shown to you. You'll need this when making API calls.
6. Configure your environment variables. You will need to set the data on the ```.env``` file in your local wp-exportimport folder. You need 15 tokens so we do not reach API requests limits.

```
NODE_ENV=development
PAGE_ACCESS_TOKEN=Bearer <access token, created on step 6 in the format "Bearer TOKEN">
```

# ⇨ Go to your favorite Terminal and execute

```
    node app.js export-users <exportname>
    node app.js export-users-checkresync <exportname>
    node app.js export-groups <exportname>
    node app.js import-users <importname> <imgpublicrepo>
    node app.js resync-users-photo <importname> <anotherimgpublicrepo>
    node app.js update-managers <importname>
    node app.js import-groups <importname> <imgpublicrepo>
    node app.js delete-users-entitledtodeletion
```
