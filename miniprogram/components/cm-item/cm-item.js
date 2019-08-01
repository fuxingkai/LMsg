'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    item: {
      type: Object,
      // value: {
      //     title:'富力悦禧花园',
      //     imgUrl:'http://up.enterdesk.com/edpic/71/25/29/712529bc34aeff04f36ecc2da6c0f179.jpg',
      //     intro: '带装修，认筹享8.5折钜惠',
      // },
      observer: 'onDataChange'
    },
    index: {
      type: Number,
      value: "",
    },
    showLine: {
      type: Boolean,
      value: true,
    }
  },

  data: {},

  methods: {
    onDataChange: function onDataChange() {
      this.data.item.createTime = util.formatDate(new Date(this.data.item.createTime));
      this.setData({
        item: this.data.item,
      });

    },
    /**
     * 点击整个Item
     * @param {*} e 
     */
    onClickItem: function onClickItem(e) {
      console.log("onClickItem", "onClickItem");
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'item';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },


  }
});