'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
    
  },

  data: {},

  methods: {
    onDataChange: function onDataChange() {
      this.setData({
        title: this.data.title,
      });

    },
    /**
     * 点击整个Item
     * @param {*} e 
     */
    onClickItem: function onClickItem(e) {
      console.log("onClickItem", "onClickItem");
      let data = {};
      this.triggerEvent('onClickItem', data);
    },


  }
});