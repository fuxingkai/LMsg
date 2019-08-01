'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    item: {
      type: Object,
      observer: 'onDataChange'
    },
    title: {
      type: String,
      value: "",
    },
    placeholder: {
      type: String,
      value: "",
    },
    inputType:{
      type: String,
      value: "text",
    },
    value:{
      type: String,
      value: "",
    }
  },

  data: {},

  methods: {
    onDataChange: function onDataChange() {
      this.setData({
        item: this.data.item,
      });

    },
   
    bindConentInput: function (e) {
      let data = {};
      data.value = e.detail.value;
      this.triggerEvent('onCall', data);
    },
    /**
     * 点击整个删除
     * @param {*} e 
     */
    onClickEdit: function onClickEdit(e) {
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'edit';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },


  }
});