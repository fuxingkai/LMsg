'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    item: {
      type: Object,
      value: {

      },
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

  data: {
    isHaseReply: false,
    isMineComment: false,
  },

  methods: {
    onDataChange: function onDataChange() {
      let isMineComment = getApp().getMiniAppCacheInfo()._openid == this.data.item._openid?true:false;
      this.setData({
        isHaseReply: this.data.item.reply.content == "" ? false : true,
        isMineComment: isMineComment,
        item: this.data.item,
      });

    },
    /**
     * 点击整个Item
     * @param {*} e 
     */
    onClickItem: function onClickItem(e) {
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'item';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },

    bindConentInput: function(e) {
      this.setData({
        replyContent: e.detail.value,
      });
    },


    /**
     * 点击置顶
     * @param {*} e 
     */
    onClickTop: function onClickTop(e) {
      console.log("onClickTop", e);

    },


    /**
     * 点击删除
     * @param {*} e 
     */
    onClickDelete: function onClickDelete(e) {
      console.log("onClickDelete", e);
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'delete';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },

    /**
      * 点赞或者取消赞
      * @param {*} e 
      */
    onClickLike: function onClickTop(e) {
      console.log("onClickLike", e);
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};

      let updateData = {};
      let _this = this;
      wx.showLoading({
        mask: true
      });
      if(e.currentTarget.id=="commentLike"){
        clickEvent.target = 'commentLike';
        data.clickEvent = clickEvent;
        this.triggerEvent('onClickItem', data);
      } else if (e.currentTarget.id == "replyLike"){
        clickEvent.target = 'replyLike';
        data.clickEvent = clickEvent;
        this.triggerEvent('onClickItem', data);
      }
      
    },

  }
});