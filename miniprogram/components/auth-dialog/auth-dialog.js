'use strict';
let app = getApp();
var util = require('../../utils/sh_util.js');
Component({
  properties: {
    data: {
      type: Object,
      value: {

      },
      observer: 'onDialogDataChange'
    }
  },

  data: {
    isShowAuthDialog: false,
  },


  pageLifetimes: {
    show() {
      let _that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } 
        }
      })
    },

  },


  methods: {
    onDialogDataChange: function onDialogDataChange() {
    },
  }
});