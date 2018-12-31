
var config = require("../../config/config.js"),
    request = require("request-promise");

module.exports = {

  "__getAllData": function __getAllData(options, data) {
    let deferred = Promise.defer();
    request(options).then(res => {
      var response = JSON.parse(res);

      data = data.concat(response.data);
      if (response.paging && response.paging.next){
        options.url = response.paging.next;
        return __getAllData(options, data)
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
  "__getAllSCIMData": function getAllSCIMData(options, data) {
    let deferred = Promise.defer();
    //console.log(JSON.stringify(options));
    request(options).then(res => {
      var response = JSON.parse(res);

      data = data.concat(response.data);
      if (response.startIndex + response.itemsPerPage < response.totalResults){
        options.qs.startIndex = response.startIndex + response.itemsPerPage;
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
  "createGetSCIMOptions": function createGetSCIMOptions(url, index){
    let page_access_token = this.getToken();
    return {
      url: url,
      qs: {
        startIndex: index,
        limit: 50000,
      },
      headers: {
        "Authorization": page_access_token,
        "Content-Type": "application/json",
      },
      method: "GET",
    };
  },
  "createGetOptions": function createGetOptions(url, fields){
    let page_access_token = this.getToken();
    return {
      url: url,
      qs: {
        fields: fields.join(),
        limit: 50000,
      },
      headers: {
        "Authorization": page_access_token,
        "Content-Type": "application/json",
      },
      method: "GET",
    };
  },
  "createPostOptions": function createPostOptions(url, qs){
    let page_access_token = this.getToken();
    return {
      url: url,
      qs: qs,
      headers: {
        "Authorization": page_access_token,
        "Content-Type": "application/json",
        "User-Agent": "wp-xplat-cli",
      },
      method: "POST",
    };
  },
  "createPutOptions": function createPutOptions(url, qs){
    let page_access_token = this.getToken();
    return {
      url: url,
      qs: qs,
      headers: {
        "Authorization": page_access_token,
        "Content-Type": "application/json",
        "User-Agent": "wp-xplat-cli",
      },
      method: "PUT",
    };
  },
  "createDeleteOptions": function createDeleteOptions(url, qs){
    let page_access_token = this.getToken();
    return {
      url: url,
      qs: qs,
      headers: {
        "Authorization": page_access_token,
      },
      method: "DELETE",
    };
  },
  "postMessage": function postMessage(url, sender, messageData) {
    let options = {
      url: url,
      headers: {
        "Authorization": config.page_access_token,
        "Content-Type": "application/json",
      },
      method: "POST",
      json: {
        recipient: sender,
        message: messageData,
      },
    };
    return request(options, function(error, response) {
        if(error) {
            console.log("Error sending messages: ", error);
        }
        else if(response.body.error) {
            console.log("Error: ", response.body.error);
        }
    });
  },
  "getToken": function getToken(){
    if(config.token_index === config.token_total) {
      config.token_index = 2;
    } else {
      config.token_index = config.token_index + 1;
    }
    //console.log("USING TOKEN " + config.token_index);
    return process.env['PAGE_ACCESS_TOKEN' + config.token_index];
  },
};
