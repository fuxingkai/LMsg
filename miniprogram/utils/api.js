'use strict';

var Fetch = require('base_api.js');

let app = getApp();


var LM_JAVA = 'http://172.16.2.214:8082/'; //开发


var METHOD_POST = 'POST';
var METHOD_GET = 'GET';

function fetch(path, method, params, header) {
  return new Fetch(path, method, Object.assign({}, params), Object.assign({
    'Content-Type': 'application/json',
    'HTTP_USER_APPLET': 'WX_APPLET'
  }, header));
}





/**
 * 用户
 */
var user = {

  /**
   * 上传formId
   */
  postFormId: function postFormId(params) {
    let path = 'user/saveFormId';
    return fetch(LM_JAVA + path, METHOD_POST, params);
  },

    /**
   * 登录
   */
  postLogin: function postLogin(params) {
    let path = 'user/login';
    return fetch(LM_JAVA + path, METHOD_POST, params);
  },

};




module.exports = {
  fetch: fetch,
  user: user,
};