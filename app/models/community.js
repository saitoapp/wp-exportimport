var group = require("./group.js"),
    member = require("./member.js"), 
    common = require("./common.js"), 
    rp = require("request-promise"),
    request = require("request-promise");

var async = require('asyncawait/async');
var await = require('asyncawait/await');

const graphAPIUrl = "https://graph.facebook.com/v2.6/";

module.exports = {

  "getAllGroups": function getAllGroups(fields) {
    if (fields.constructor !== Array) {
      fields = group.getDefaultGroupFields();
    }    
    let url = graphAPIUrl + "community/groups";
    let groups = [];
    
    return common.__getAllData(common.createGetOptions(url, fields), groups);
  },
  
  "getAllMembers": function getAllMembers(fields) {
    // Get all members
    let url = graphAPIUrl + "community/members";
    var members = [];
    var hasNext = true;

    var result = async (function() {
      while (hasNext) {
          await (new Promise(resolve => {
            request(common.createGetOptions(url, fields)).then(res => {
              var response = JSON.parse(res);
              for(var i in response.data){
                members.push(response.data[i]);
              }
              if (!response.paging.next) {
                hasNext = false;
              } else {
                  url = response.paging.next;
              }
              resolve();
            });
          })
        );
      }
      return members;
    });
    //return common.__getAllData(common.createGetOptions(url, fields), members);
    return result();
  },

  "createNewGroup": function createNewGroup(group) {
    let url = graphAPIUrl + "community/groups";
    let qs = {
      "name": group.name,
      "privacy": group.privacy,
      "group_type": group.purpose,
    };
    if (group.description){
      qs.description = group.description;
    }
    return rp(common.createPostOptions(url,qs));
  },
  /*
  "createNewGroup": function createNewGroup(name, description, privacy, cover_url) {
    let url = graphAPIUrl + "community/groups";
    let qs = {
                "name": name,
                "description": description, 
                "privacy": privacy,
                "cover_url": encodeURI(cover_url),
              };
    return rp(common.createPostOptions(url,qs));
  },
  */
  "getGroupPrivacyOpen": () => { return "OPEN"; },
  "getGroupPrivacyClosed": () => { return "CLOSED"; },
  "getGroupPrivacySecret": () => { return "SECRET"; },
};


