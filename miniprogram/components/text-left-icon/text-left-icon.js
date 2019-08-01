'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
    icon: {
      type: String,
      value: "",
    },
  },

  data: {},

  methods: {
    onDataChange: function onDataChange() {
      this.setData({
        item: this.data.item,
      });

    },
   
  
    /**
     * 点击item
     * @param {*} e 
     */
    onClickItem: function onClickItem(e) {
      this.triggerEvent('onClickItem', {});
    },


  }
});