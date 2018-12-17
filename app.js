var config = require("./config/config"),
    account = require("./app/models/account"),
    group = require("./app/models/group"),
    member = require("./app/models/member"),
    community = require("./app/models/community"),
    program = require("commander"),
    fs = require("fs"),
    https = require("https");

program
.version("0.0.1")
.command("update-email <email> <newEmail>")
.description("Update an user's email")
.action(function(email, newEmail){
  console.log("About to change e-mail from " + email + " to " + newEmail);
    account.updateUserEmail(email, newEmail)
    .then(user => {
        console.log("SUCCESS updating email from " +  email + " to " + newEmail);
    }).catch(error=>{
        console.log("ERROR updating email from " +  email + " to " + newEmail + "Error: " + error);
    });
});
program
.version("0.0.1")
.command("update-locale <email> <locale>")
.description("Update an user's locale")
.action(function(email, locale){
  console.log("About to change locale for user " + email + " to " + locale);
    account.updateUserLocale(email, locale)
    .then(user => {
        console.log("SUCCESS updating locale for " +  email + " to " + locale);
    }).catch(error=>{
        console.log("ERROR updating locale for " +  email + " to " + locale + "Error: " + error);
    });
});
program
.version("0.0.1")
.command("create-group <name> <description> <privacy>")
.description("Create a group using the informed name, description, privacy (OPEN, CLOSED, SECRET)")
.action(function(name, description, privacy, members, admins){
    //console.log("About to create group " + name + " description " + description + " and privacy " + privacy);
    community.createNewGroup(name, description, privacy)
    .then(newgroup => {
        console.log(JSON.parse(newgroup).id);
    }).catch(error=>{
        console.log("ERROR creating group " + name + " description " + description + " and privacy " + privacy + " Error: " + error);
    });
});
program
.version("0.0.1")
.command("add-member <groupid> <member>")
.description("Add a new member in a existing group ")
.action(function(groupid, member){
  console.log("About to add member  " + member + " id " + groupid);
    group.addMemberToGroupByEmail(groupid, member).then(result => {
        console.log("SUCCESS adding member  " + member +  " id " + groupid);
    }).catch(error=>{
        console.log("ERROR adding member  " + member +  " id " + groupid + " Error: " + error);
    });
});
program
.version("0.0.1")
.command("remove-member <groupid> <member>")
.description("Remove a member in a existing group ")
.action(function(groupid, member){
  console.log("About to remove member  " + member + " id " + groupid);
    group.removeMemberToGroupByEmail(groupid, member).then(result => {
        console.log("SUCCESS removing member  " + member +  " id " + groupid);
    }).catch(error=>{
        console.log("ERROR removing member  " + member +  " id " + groupid + " Error: " + error);
    });
});
program
.version("0.0.1")
.command("remove-all-member <groupid>")
.description("Remove all members in a existing group ")
.action(function(groupid){
    console.log("About to all members from id " + groupid);
    group.getAllMembers(groupid, member.getAvailableMemberFields()).then(members => {
        members.forEach(m => {
            group.removeMemberToGroupByEmail(groupid, m.email).then(result => {
                console.log("SUCCESS removing member  " + m.email +  " id " + groupid);
            }).catch(error=>{
                console.log("ERROR removing member  " + m.email +  " id " + groupid + " Error: " + error);
            });
        });    
    }).then(() => console.log("FINISH!"));      
});

program
.version("0.0.1")
.command("add-admin <groupid> <admin>")
.description("Add a new admin in a existing group ")
.action(function(groupid, admin){
  console.log("About to add admin  " + admin + " id " + groupid);
    member.getSingleMember(admin).then(adm => {
        console.log(adm);
        group.promoteMemberToAdmin(groupid, adm.id).then(result => {
            console.log("SUCCESS adding admin  " + admin +  " id " + groupid);
        }).catch(error=>{
            console.log("ERROR adding admin  " + admin +  " id " + groupid + " Error: " + error);
        });
    });
});
program
.version("0.0.1")
.command("list-groups")
.description("List all groups")
.action(function(){
    community.getAllGroups(group.getAvailableGroupFields())
    .then((groups) => {
        groups.forEach(g => {
            console.log("\"" + g.name + "\" ," + g.id + ", \"" + g.privacy + "\"");
        });
    });
});
program
.version("0.0.1")
.command("update-workanniversary <email> <startDate>")
.description("Update an user's startDate")
.action(function(email, startDate){
  console.log("About to update work anniversary of " + email + " to " + startDate);
    account.updateWorkAnniversary(email, startDate)
    .then(user => {
        console.log("SUCCESS updating work anniversary from " +  email + " to " + startDate);
    }).catch(error=>{
        console.log("ERROR updating work anniversary from " +  email + " to " + startDate + " Error: " + error);
    });
});
program
.version("0.0.1")
.command("update-userauthmethod <email> <sso>")
.description("Update an user's Authentication Method (sso or password)")
.action(function(email, method){
  console.log("About to update authentication method of " + email + " to " + method);
    account.updateUserAuthMethod(email, method)
    .then(user => {
        console.log("SUCCESS updating authentication method of " +  email + " to " + method);
    }).catch(error=>{
        console.log("ERROR updating authentication method of " +  email + " to " + method + " Error: " + error);
    });
});
program
.version("0.0.1")
.command("group-members")
.description("List group members")
.action(function(id, only_claimed){
    var isClaimed = (only_claimed == "true");
    group.getAllMembers(id, member.getAvailableMemberFields()).then(members => {
        members.forEach(m => {
            if (!isClaimed || m.account_claim_time) {
                console.log("\"" + m.email + "\"");
            }
        });    
    });
});
program
.version("0.0.1")
.command("update-manager <email> <manager_email>")
.description("Update an user's Manager")
.action(function(email, manager_email){
  console.log("About to update manager of " + email + " to " + manager_email);
    account.updateUserManager(email, manager_email)
    .then(user => {
        console.log("SUCCESS updating manager of " +  email + " to " + manager_email);
    }).catch(error=>{
        console.log("ERROR updating manager of " +  email + " to " + manager_email + " Error: " + error);
    });
});
program
  .version("0.0.1")
  .command("export-users <exportname>")
  .description("Export all users and their profile photos")
  .action(function(exportname){
    console.log("About to export all users to " + exportname);

    let users = [];
    /*
    account.getAllUsers(1, users)
      .then(users => {
        console.log("USERS: " + users.length);
      });
      */

    community.getAllMembers(member.getAvailableMemberFields())
      .then(users => {
        // Create folders
        let basedir = "./" + exportname;
        if (!fs.existsSync(basedir)){
          fs.mkdirSync(basedir);
        }
        if (!fs.existsSync(basedir + "/users")){
          fs.mkdirSync(basedir + "/users");
        }
        let picturedir = "./" + exportname + "/users/pictures";
        if (!fs.existsSync(picturedir)){
          fs.mkdirSync(picturedir);
        }

        // Get user info
        users.forEach(u => {
          account.getUserById(u.id)
            .then(userscim => {
              fs.writeFile(basedir + "/users/user_" + u.id + "_scim.json", userscim, (err) => {
                if (err) throw err;
                //console.log('SUCCESS exporting users (SCIM) to ' + exportname);
              });
            });
          if (u.picture.data.url) {
            // Get large picture
            account.getUserPicture(u.id, "large")
              .then(picture => {
                //console.log("Picture: " + picture);
                picture = JSON.parse(picture);
                let fextension = picture.data.url.match(/\.(png|jpg)/gi);
                let file = fs.createWriteStream(picturedir + "/" + u.id + fextension);
                https.get(picture.data.url, function(response) {
                  response.pipe(file);
                });
              });
          }
        });

        // Save to file
        let users_json = JSON.stringify(users);
        fs.writeFile(basedir + "/users/users.json", users_json, (err) => {
          if (err) throw err;
          console.log("SUCCESS exporting users (GRAPH) to " + exportname);
        });
      }).catch(error=>{
      console.log("ERROR exporting all users to " +  exportname + " Error: " + error);
    });

  });
program
  .version("0.0.1")
  .command("export-groups <exportname>")
  .description("Export all groups and their members")
  .action(function(exportname){
    console.log("About to export all groups to " + exportname);
    community.getAllGroups(group.getAvailableGroupFields())
      .then(groups => {
        //console.log(JSON.stringify(groups));

        // Create folders
        var basedir = "./" + exportname;
        if (!fs.existsSync(basedir)){
          fs.mkdirSync(basedir);
        }
        if (!fs.existsSync(basedir + "/groups")){
          fs.mkdirSync(basedir + "/groups");
        }
        var picturedir = "./" + exportname + "/groups/pictures";
        if (!fs.existsSync(picturedir)){
          fs.mkdirSync(picturedir);
        }

        // Get pictures, members, owners
        groups.forEach(g => {
          if (g.cover && g.cover.source) {
            let fextension = g.cover.source.match(/\.(png|jpg)/gi);
            let file = fs.createWriteStream(picturedir + "/" + g.id + "_cover" + fextension);
            https.get(g.cover.source, function(response) {
              response.pipe(file);
            });
          }
          if (g.icon) {
            let fextension = g.icon.match(/\.(png|jpg)/gi);
            let file = fs.createWriteStream(picturedir + "/" + g.id + "_icon" + fextension);
            https.get(g.icon, function(response) {
              response.pipe(file);
            });
          }

          // Get admins
          /*
          group.getAllAdmins(g.id, "")
            .then(admins => {
              //console.log('Admin for group ' + g.id + ' are ' + JSON.stringify(admins));
              let groupsadmins_json = JSON.stringify(admins);
              fs.writeFile(basedir + "/groups/" + g.id + "_admins.json", groupsadmins_json, (err) => {
                if (err) throw err;
                //console.log('SUCCESS exporting groups admins to folder ' + exportname);
              });
            });
            */
          // Get members
          group.getAllMembers(g.id, "")
            .then(members => {
              //console.log('Members for group ' + g.id + ' are ' + JSON.stringify(members));
              let groupsmembers_json = JSON.stringify(members);
              fs.writeFile(basedir + "/groups/" + g.id + "_members.json", groupsmembers_json, (err) => {
                if (err) throw err;
                //console.log('SUCCESS exporting groups members to folder ' + exportname);
              });
            });
        });

        // Save to file
        var groups_json = JSON.stringify(groups);
        fs.writeFile(basedir + "/groups/groups.json", groups_json, (err) => {
          if (err) throw err;
          console.log("SUCCESS exporting groups to folder " + exportname);
        });
      }).catch(error=>{
      console.log("ERROR exporting all groups to " +  exportname + " Error: " + error);
    });
  });
program
  // Checklist
  // - Make sure export files looks good
  // - Configure SSO
  // - Enable email-less
  // - Save images to a public website, like S3 Bucket
  .version("0.0.1")
  .command("import-users <importname> <imgpublicrepo>")
  .description("Import all users and their profile photos. Make sure you are using the target community's access token.")
  .action(function(importname, imgpublicrepo){
    console.log("About to import all users from " + importname);
    let basedir = "./" + importname;

    // Get users
    let filecontent = fs.readFileSync(basedir + "/users/users.json", "utf8");
    let users = JSON.parse(filecontent);
    for(let i=0; i<users.length; i++) {
      //console.log(i + " USER: " + JSON.stringify(users[i]));

      // Get User SCIM
      let filecontent = fs.readFileSync(basedir + "/users/user_" + users[i].id + "_scim.json", "utf8");
      let user_scim = JSON.parse(filecontent);
      delete user_scim.id;
      //delete user_scim.externalId;

      // Username change
      if(user_scim.userName) {
        user_scim.userName = user_scim.userName + ".changeme2";
      }

      // External ID change (email-less unclaimed)
      if(user_scim.externalId) {
        user_scim.externalId = user_scim.externalId + ".changeme2";
      }

      // For testing purposes, disable SSO
      if(user_scim["urn:scim:schemas:extension:facebook:auth_method:1.0"].auth_method) {
        user_scim["urn:scim:schemas:extension:facebook:auth_method:1.0"].auth_method = "password";
      }

      // Delete OLD Access Code
      if(user_scim["urn:scim:schemas:extension:facebook:accountstatusdetails:1.0"].accessCode) {
        delete user_scim["urn:scim:schemas:extension:facebook:accountstatusdetails:1.0"].accessCode;
        delete user_scim["urn:scim:schemas:extension:facebook:accountstatusdetails:1.0"].accessCodeExpirationDate;
      }

      // Add picture
      let fextension = users[i].picture.data.url.match(/\.(png|jpg)/gi);
      let photo = "{ \"value\": \"" + imgpublicrepo + "/" + users[i].id + fextension + "\",\"type\": \"profile\", \"primary\": true }";
      photo = JSON.parse(photo);
      user_scim.photos= [];
      user_scim.photos.push(photo);
      //console.log(JSON.stringify(user_scim));

      // Create user
      account.createUser(user_scim)
        .then(user => {
          // Save new file the the new account
          fs.writeFile(basedir + "/users/user_" + users[i].id + "_new_scim.json", user, (err) => {
            if (err) throw err;
            //console.log("SUCCESS exporting groups to folder " + exportname);
          });
        });

      // Update picture
      /*
      let fextension = users[i].picture.data.url.match(/\.(png|jpg)/gi);
      account.updateUserPhoto(user.id, imgpublicrepo + "/" + users[i] + fextension)
        .catch(error=>{
          console.log("ERROR updating picture of user " +  user.id + " Error: " + error);
        });
        */
    }
  });
program
  // Checklist
  // - Make sure export files looks good and users are indeed created on the new community.
  .version("0.0.1")
  .command("update-managers <importname>")
  .description("Update people'' manager. Make sure you are using the target community's access token.")
  .action(function(importname) {
    console.log("About to update user's manager based on " + importname);
    let basedir = "./" + importname;

    // Get users new scim
    let users_newscim = [];
    let previous_manager = [];
    let filecontent = fs.readFileSync(basedir + "/users/users.json", "utf8");
    let users = JSON.parse(filecontent);
    for (let i = 0; i < users.length; i++) {
      let filecontent = fs.readFileSync(basedir + "/users/user_" + users[i].id + "_scim.json", "utf8");
      let user_oldscim = JSON.parse(filecontent);

      filecontent = fs.readFileSync(basedir + "/users/user_" + users[i].id + "_new_scim.json", "utf8");
      let user_newscim = JSON.parse(filecontent);

      users_newscim[users[i].id] = user_newscim.id;

      if(user_oldscim["urn:scim:schemas:extension:enterprise:1.0"] && user_oldscim["urn:scim:schemas:extension:enterprise:1.0"].manager) {
        previous_manager[users[i].id] = user_oldscim["urn:scim:schemas:extension:enterprise:1.0"].manager;
      }

      //console.log("User " + users[i].id + " is now " + users_newscim[users[i].id]);
      //console.log("User " + users[i].id + " had " + JSON.stringify(previous_manager[users[i].id]) + " as a manager.");
    }

    // Updating manager info
    for (let i = 0; i < users.length; i++) {
      if (previous_manager[users[i].id]) {
        // New user id
        let userid = users_newscim[users[i].id]

        // New manager
        let manager = users_newscim[previous_manager[users[i].id].managerId];

        //console.log("New manager: " + JSON.stringify(manager) + " for user " + userid);

        // Update
        account.updateUserManagerByid(userid, manager)
          .then(user => {
            console.log("SUCCESS updating manager of " +  userid + " to " + manager);
          }).catch(error=>{
            console.log("ERROR updating manager of " +  userid + " to " + manager + " Error: " + error);
        });
      }
    }
  });
program
// Checklist
// - Make sure export files looks good
// - Configure SSO
// - Enable email-less
// - Save images to a public website, like S3 Bucket
  .version("0.0.1")
  .command("import-groups <importname> <imgpublicrepo>")
  .description("Import all groups and their cover. Make sure you are using the target community's access token. You need to manually set DEFAULT groups!")
  .action(function(importname, imgpublicrepo) {
    console.log("About to import all groups from " + importname);
    let basedir = "./" + importname;

    // Get users new scim
    let users_newscim = [];
    let filecontent = fs.readFileSync(basedir + "/users/users.json", "utf8");
    let users = JSON.parse(filecontent);
    for (let i = 0; i < users.length; i++) {
      let filecontent = fs.readFileSync(basedir + "/users/user_" + users[i].id + "_new_scim.json", "utf8");
      let user_newscim = JSON.parse(filecontent);

      users_newscim[users[i].id] = user_newscim.id;
      //console.log(i + " USER " + users[i].id + " is now " + JSON.stringify(users_newscim[users[i].id]));
    }

    // Get groups
    filecontent = fs.readFileSync(basedir + "/groups/groups.json", "utf8");
    let groups = JSON.parse(filecontent);
    for (let i = 0; i < groups.length; i++) {
      //console.log(i + " GROUP: " + JSON.stringify(groups[i]));

      // Create Group
      community.createNewGroup(groups[i])
        .then(newgroup => {
          newgroup = JSON.parse(newgroup);
          groups[i].newid = newgroup.id;
          console.log("SUCCESS creating group " + groups[i].newid + ", old ID was " + groups[i].id);

          // Add Image
          if (groups[i].cover && groups[i].cover.source) {
            let fextension = groups[i].cover.source.match(/\.(png|jpg)/gi);
            let imgfilename = imgpublicrepo + "/" + groups[i].id + "_cover" + fextension;

            group.updateCover(groups[i].newid, imgfilename)
              .then(img => {
                console.log("SUCCESS updating cover of " + groups[i].newid + " to " + imgfilename);
              }).catch(error => {
                console.log("ERROR updating cover of " + groups[i].newid + " to " + imgfilename + " Error: " + error);
            });
          }

          // Add Members
          filecontent = fs.readFileSync(basedir + "/groups/" + groups[i].id + "_members.json", "utf8");
          let oldmembers = JSON.parse(filecontent);
          for (let j = 0; j < oldmembers.length; j++) {
            group.addMemberToGroupById(groups[i].newid, users_newscim[oldmembers[j].id])
              .then(newmember => {
                console.log("SUCCESS adding " + users_newscim[oldmembers[j].id] + " (OLD: " + oldmembers[j].id + ") to " + groups[i].newid);
                // Promote admins
                if (oldmembers[j].administrator) {
                  group.promoteMemberToAdmin(groups[i].newid, users_newscim[oldmembers[j].id])
                    .then(admin => {
                      console.log("SUCCESS promoting " + users_newscim[oldmembers[j].id] + " (OLD: " + oldmembers[j].id + ") to ADMIN of " + groups[i].newid);
                    }).catch(error => {
                      console.log("ERROR promoting " + users_newscim[oldmembers[j].id] + " (OLD: " + oldmembers[j].id + ") to ADMIN of " + groups[i].newid + " Error: " + error);
                  });
                }
              }).catch(error => {
              console.log("ERROR adding " + users_newscim[oldmembers[j].id] + " (OLD: " + oldmembers[j].id + ") to " + groups[i].newid + " Error: " + error);
            });
          }
        }).catch(error => {
          console.log("ERROR while creating a new group for (Old) " + groups[i].id + " Error: " + error);
      });
    }
  });



      /*
      // Get User SCIM
      let filecontent = fs.readFileSync(basedir + "/users/user_" + users[i].id + "_scim.json", "utf8");
      let user_scim = JSON.parse(filecontent);
      delete user_scim.id;
      //delete user_scim.externalId;

      // Username change
      if(user_scim.userName) {
        user_scim.userName = user_scim.userName + ".changeme2";
      }

      // External ID change (email-less unclaimed)
      if(user_scim.externalId) {
        user_scim.externalId = user_scim.externalId + ".changeme2";
      }

      // For testing purposes, disable SSO
      if(user_scim["urn:scim:schemas:extension:facebook:auth_method:1.0"].auth_method) {
        user_scim["urn:scim:schemas:extension:facebook:auth_method:1.0"].auth_method = "password";
      }

      // Delete OLD Access Code
      if(user_scim["urn:scim:schemas:extension:facebook:accountstatusdetails:1.0"].accessCode) {
        delete user_scim["urn:scim:schemas:extension:facebook:accountstatusdetails:1.0"].accessCode;
        delete user_scim["urn:scim:schemas:extension:facebook:accountstatusdetails:1.0"].accessCodeExpirationDate;
      }

      // Add picture
      let fextension = users[i].picture.data.url.match(/\.(png|jpg)/gi);
      let photo = "{ \"value\": \"" + imgpublicrepo + "/" + users[i].id + fextension + "\",\"type\": \"profile\", \"primary\": true }";
      photo = JSON.parse(photo);
      user_scim.photos= [];
      user_scim.photos.push(photo);
      //console.log(JSON.stringify(user_scim));

      // Create user
      account.createUser(user_scim)
        .then(user => {
          // Save new file the the new account
          fs.writeFile(basedir + "/users/user_" + users[i].id + "_new_scim.json", user, (err) => {
            if (err) throw err;
            //console.log("SUCCESS exporting groups to folder " + exportname);
          });
        });
       */
program.parse(process.argv);
