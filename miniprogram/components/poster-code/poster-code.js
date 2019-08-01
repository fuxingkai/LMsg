'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    canvasData: {
      type: Object,
      value: null,
      observer: 'onDataChange'
    },

  },

  data: {
    context: null
  },

  methods: {
    onDataChange: function onDataChange() {
      if (this.data.canvasData != null && this.data.canvasData.canvasId != undefined) {
        this.setData({
          canvasData: this.data.canvasData,
        });
        const info = wx.getSystemInfoSync()
        let rate = info.screenWidth / 750;
        if (this.data.context == null){
          this.data.context = wx.createCanvasContext(this.data.canvasData.canvasId, this);
        }
        let context = this.data.context;
        context.setFillStyle('#ffffff');
        context.rect(0, 0, 750 * rate, 300*rate);
        context.fill();
        context.setStrokeStyle(this.data.canvasData.color);
        context.setLineWidth(3 * rate);
        this.drawRoundRect(20 * rate, 20 * rate, 710 * rate, 260 * rate, 10 * rate);
        context.drawImage(this.data.canvasData.codePath, 520 * rate, 50 * rate, 160 * rate, 160 * rate);
        context.setFillStyle('#999999');
        context.setFontSize(20 * rate);
        context.setTextAlign('center');
        context.fillText('长按此处可以留言', 600 * rate, 240 * rate);
        context.setFillStyle(this.data.canvasData.color);
        context.setFontSize(60 * rate);
        context.fillText('留言区', 220 * rate, 170 * rate);
        context.draw();
      }
    },

    /**
     * 点击整个Item
     * @param {*} e 
     */
    drawRoundRect: function drawRoundRect(x, y, w, h, r) {
      let context = this.data.context;
      context.beginPath();
      context.moveTo(x, y+r);
      context.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI);
      // context.moveTo(x+r, y);
      context.lineTo(x + w - r, y);
      // context.moveTo(x + w - r, y);
      context.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2.0 * Math.PI);
      // context.moveTo(x + w, y+r);
      context.lineTo(x + w, y + h-r);
      // context.moveTo(x + w, y + h - r);
      context.arc(x + w-r, y + h - r, r, 2.0 * Math.PI, 2.5 * Math.PI);
      // context.moveTo(x + w-r, y + h);
      context.lineTo(x + r, y + h);
      // context.moveTo(x + r, y + h);
      context.arc(x + r, y + h-r, r, 2.5 * Math.PI, 3.0 * Math.PI);
      // context.moveTo(x, y + h-r);
      context.lineTo(x, y + r);
      context.closePath();
      context.stroke();
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



    /**
     * 点击保存相册
     * @param {*} e 
     */
    onClickSave: function onClickSave(e) {
      console.log("onClickSave",e)
      let _this = this;

      let context = this.data.context;
      if (context!=null){
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  _this.loadImg()
                }
              })
            } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
              wx.showModal({
                content: '检测到您未授予小程序 “保存图片到系统相册” 的权限，是否去设置打开？',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            } else {
              _this.loadImg()
            }
          }
        })
       
      }
    
      
    },

    loadImg: function loadImg() {
      let context = this.data.context;
      if (context == null) {
        return
      }
      wx.showLoading({
        mask: true
      })
      let _this = this;
      const info = wx.getSystemInfoSync()
      let rate = info.screenWidth / 750;
      context.setFillStyle('#ffffff');
      context.rect(0, 0, 750 * rate, 300 * rate);
      context.fill();
      context.setStrokeStyle(this.data.canvasData.color);
      context.setLineWidth(3 * rate);
      this.drawRoundRect(20 * rate, 20 * rate, 710 * rate, 260 * rate, 10 * rate);
      context.drawImage(this.data.canvasData.codePath, 520 * rate, 50 * rate, 160 * rate, 160 * rate);
      context.setFillStyle('#999999');
      context.setFontSize(20 * rate);
      context.setTextAlign('center');
      context.fillText('长按此处可以留言', 600 * rate, 240 * rate);
      context.setFillStyle(this.data.canvasData.color);
      context.setFontSize(60 * rate);
      context.fillText('留言区', 220 * rate, 170 * rate);
      context.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: 300,
          destWidth: 750,
          destHeight: 300,
          canvasId: _this.data.canvasData.canvasId,
          success(res) {
            console.log("path",res)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                wx.showToast({
                  title: '已保存到相册',
                  duration: 1500
                })
              },
              fail() {
                wx.hideLoading()
              }
            })
          },
          fail(err) {
            console.log(err)
            wx.hideLoading()
          }
        }, _this)
      });
     
    }
  }
});