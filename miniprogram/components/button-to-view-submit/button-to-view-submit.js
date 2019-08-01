'use strict';
let app = getApp();
var util = require('../../utils/util.js');
Component({
  properties: {

  },

  data: {
  },

  ready: function () {

  },

  methods: {

    /**
    * 点击item
    * @param {*} e 
    */
    onSubmit: function onSubmit(e) {
      let data = {};
      let clickEvent = {};
      clickEvent.target = 'item';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },
    formSubmit: function formSubmit(e) {
      console.log('form发生了submit事件，携带数据为：', e.detail)
      wx.cloud.callFunction({
        name: "templateMessage",
        data: {
          "action": "addFormId",
          "formId": e.detail.formId
        },
        success: res => {
          console.log("templateMessage", res);
  
        },
        fail: err => {
          console.error('templateMessage', err)
  
        }
      })
    },


  }
});