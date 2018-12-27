
var rp = require("request-promise"),
    config = require("../../config/config.js"),
    common = require("./common.js");

var scimApi = rp.defaults({
  baseUrl: "https://www.facebook.com/scim/v1/Users",
  headers: {
    "Authorization": config.page_access_token,
    "Content-Type": "application/json",
    "User-Agent": "wp-xplat-cli",
  },
});
var graphApi = rp.defaults({
  baseUrl: "https://graph.facebook.com/",
  headers: {
    "Authorization": config.page_access_token,
    "Content-Type": "application/json",
    "User-Agent": "wp-xplat-cli",
  },
});

module.exports = {

  "__getAllData": function __getAllData(options, data) {
    let deferred = Promise.defer();
    request(options).then(res => {
      var response = JSON.parse(res);

      data = data.concat(response.data);
      if (response.paging && response.paging.next){
        options.url = response.paging.next;
        __getAllData(options, data)
          .then(function() {
            deferred.resolve(data);
          });
      } else {
        deferred.resolve(data);
      }
    }).catch(err => {
      deferred.reject(err);
    });
    return deferred.promise;
  },
  /*
  "getAllUsers": function getAllUsers(index, data) {
    //let users = [];
    //return common.__getAllSCIMData(common.createGetSCIMOptions("https://www.facebook.com/scim/v1/Users", 1), users);

    let deferred = Promise.defer();

    let options = {
      url: "/",
      qs: {
        "startIndex": index,
      },
    };

    // API Call
    scimApi(options)
      .then(responseraw => {
        let response = JSON.parse(responseraw);
        let newindex = response.startIndex + response.itemsPerPage;

        console.log("NEW INDEX: " + newindex);
        //console.log("RESOURCES: " + response.Resources);

        data = data.concat(response.Resources);

        console.log(data.length);

        if(newindex < response.totalResults) {
          getAllUsers(newindex, data)
            .then(function() {
              deferred.resolve(data);
            });
        } else {
          deferred.resolve(data);
        }
      }).catch(err => {
      deferred.reject(err);
    });
    return deferred.promise;
  },
  */
  "getUserByEmail": function getUserByEmail(email) {
    let options = {
      url: "/",
      qs: {
        "filter": "userName eq \"" + email + "\"",
      },
    };
    return scimApi(options);
  },
  "getUserById": function getUserById(id) {
    let options = {
      url: "/" + id,
      qs: {
      },
    };
    return scimApi(options);
  },
  "createUser": function createUser(user) {
    let options = {
      url: "/",
      method: "POST",
    };
    options.body = JSON.stringify(user);
    return scimApi(options);
  },
  "getUserPicture": function getUserPicture(id, size) {
    var _include_headers = function(body, response, resolveWithFullResponse) {
      return {'headers': response.headers, 'data': body};
    };
    let options = {
      url: "/" + id + "/picture?type=" + size + "&redirect=false",
      qs: {
      },
      transform: _include_headers, 
    };
    
    return graphApi(options);
  },
  
  "updateUserEmail": function updateUserEmail(originalEmail, updatedEmail) {
    return this.getUserByEmail(originalEmail).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + originalEmail);
      }
      let options = {
        url: "/" + newUser.id,
        method: "PUT",
      };
      newUser.userName = updatedEmail;
      options.body = JSON.stringify(newUser);
      return scimApi(options);  
    }).catch(error => {
      throw error;
    });
  },
  "updateWorkAnniversary": function updateWorkAnniversary(email, workAnniversary) {
    let unixWorkAnniversary = Date.parse(workAnniversary) / 1000;
    return this.getUserByEmail(email).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + email);
      }
      let options = {
        url: "/" + newUser.id,
        method: "PUT",
      };
      newUser["urn:scim:schemas:extension:facebook:starttermdates:1.0"].startDate = unixWorkAnniversary;
      options.body = JSON.stringify(newUser);
      return scimApi(options);  
    }).catch(error => {
      throw error;
    });
  },
  "updateUserLocale": function updateUserLocale(email, locale) {
    return this.getUserByEmail(email).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + email);
      }
      let options = {
        url: "/" + newUser.id,
        method: "PUT",
      };
      newUser.locale = locale;
      options.body = JSON.stringify(newUser);
      return scimApi(options);  
    }).catch(error => {
      throw error;
    });
  },
  "updateUserAuthMethod": function updateUserAuthMethod(email, method) {
    return this.getUserByEmail(email).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + email);
      }
      let options = {
        url: "/" + newUser.id,
        method: "PUT",
      };
      newUser['urn:scim:schemas:extension:facebook:auth_method:1.0'].auth_method = method;
      options.body = JSON.stringify(newUser);
      return scimApi(options);  
    }).catch(error => {
      throw error;
    });
  },
  /*
  "updateUserPhoto": function updateUserPhoto(id, url) {
    return this.getUserById(id).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + id);
      }
      let options = {
        url: "/" + newUser.id,
        method: "PUT",
      };

      let photo = `
          {
            "value": "` + url + `",
            "type": "profile",
            "primary": true
          },`;
      photo = JSON.parse(photo);
      newUser.photos.push(photo);
      options.body = JSON.stringify(newUser);
      return scimApi(options);
    }).catch(error => {
      throw error;
    });
  },


  "getUsersManagerList": function getUsersManagerList(importname) {
    return this.getUserById(id).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + id);
      }
      let options = {
        url: "/" + newUser.id,
        method: "PUT",
      };

      let photo = `
          {
            "value": "` + url + `",
            "type": "profile",
            "primary": true
          },`;
      photo = JSON.parse(photo);
      newUser.photos.push(photo);
      options.body = JSON.stringify(newUser);
      return scimApi(options);
    }).catch(error => {
      throw error;
    });
  },
  */
  "updateUserManager": function updateUserManager(email, manager_email) {
    return this.getUserByEmail(email).then(user => {
      let newUser = JSON.parse(user).Resources[0];
      if (!newUser){
        throw new Error("Could not find " + email);
      }
      if (manager_email===""){
        if (newUser['urn:scim:schemas:extension:enterprise:1.0'] !== undefined && newUser['urn:scim:schemas:extension:enterprise:1.0'].manager !== undefined){
          delete newUser['urn:scim:schemas:extension:enterprise:1.0'].manager.managerId;
          let options = {
            url: "/" + newUser.id,
            method: "PUT",
          };
          options.body = JSON.stringify(newUser);
          return scimApi(options);  
        }
      } else {
        let manager = this.getUserByEmail(manager_email).then(m => {
          newUser['urn:scim:schemas:extension:enterprise:1.0'].manager = {"managerId": JSON.parse(m).Resources[0].id};
          let options = {
            url: "/" + newUser.id,
            method: "PUT",
          };
          options.body = JSON.stringify(newUser);
          return scimApi(options);  
        });
      }
    });
  },
  "updateUserManagerByid": function updateUserManagerByid(id, manager_id) {
    return this.getUserById(id).then(user => {
      let newUser = JSON.parse(user);
      if (!newUser){
        throw new Error("Could not find user" + id);
      }

      this.getUserById(manager_id).then(m => {
        let newManager = JSON.parse(m);
        if (!newManager){
          throw new Error("Could not find manager" + id);
        }
      });

      if (newUser["urn:scim:schemas:extension:enterprise:1.0"]) {
        newUser["urn:scim:schemas:extension:enterprise:1.0"].manager = {"managerId": manager_id};
        let options = {
          url: "/" + newUser.id,
          method: "PUT",
        };
        options.body = JSON.stringify(newUser);
        return scimApi(options);
      } else {
        let managerjson = "{ \"manager\": { \"managerId\": " + manager_id + "}}";
        let manager = JSON.parse(managerjson);
        newUser["urn:scim:schemas:extension:enterprise:1.0"] = manager;
        let options = {
          url: "/" + newUser.id,
          method: "PUT",
        };
        options.body = JSON.stringify(newUser);
        return scimApi(options);
      }
    });
  },
};
