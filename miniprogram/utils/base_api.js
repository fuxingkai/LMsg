'use strict';

var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Fetch = function() {
  function Fetch(path,method, params,header) {
    _classCallCheck(this, Fetch);

    this.success = null;
    this.fail = null;
    this.fail = null;
    this.method = method;
    this.path = path;
    this.params = params;
    this.header = header;
  }

  _createClass(Fetch, [{
    key: 'onSuccess',
    value: function onSuccess(success) {
      this.success = success;
      return this;
    }
  }, {
    key: 'onFail',
    value: function onFail(fail) {
      this.fail = fail;
      return this;
    }
  }, {
    key: 'onComplete',
    value: function onComplete(complete) {
      this.complete = complete;
      return this;
    }
  }, {
    key: 'start',
    value: function start() {
      var me = this;
      var requestTask = wx.request({
        url: this.path,
        method: this.method,
        data: this.params,
        header: this.header,
        success: function success(res) {
          console.log(res);
          if (res.data.code === 1||res.data.code == 200) {
            me.success(res);
          }  else {
            me.fail(res);
          }
        },
        fail: function fail(errRes) {
          console.log(errRes);
          var res = null;
          if (errRes.errMsg.indexOf('fail abort')) {
            // 小程序网络框架异常
            res = {
              errcode: -100,
              errmsg: "请求被终止"
            };
          } else {
            res = {
              errcode: 10086,
              errmsg: "请稍后重试！"
            };
          }
          me.fail(res);
        },
        complete: me.complete
      });
      return requestTask;
    }
  }]);

  return Fetch;
}();

module.exports = Fetch;