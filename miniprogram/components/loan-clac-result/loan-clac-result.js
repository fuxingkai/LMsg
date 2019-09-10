'use strict';
let app = getApp();
var util = require('../../utils/sh_util.js');
Component({
  properties: {
    calcResultData: {
      type: Object,
      value: {
        money:0,//贷款金额
        totalMonth:0,//总月数
        monthAlsoMoney:0,//每月还款金额
        monthAlsoMoneys:[],//每月还款金额
        totalMoney: 0,//总还款金额
        totalInterest: 0,//总利息
      },
      observer: 'onPopDataChange'
    }
  },

  data: {
    monthAlsoMoneys:"",
  },


  methods: {
    onPopDataChange: function onPopDataChange() {
      let monthAlsoMoneys = "";
      if (this.data.calcResultData.monthAlsoMoneys.length>0){
        this.data.calcResultData.monthAlsoMoneys.forEach(function (value, index) {
          let month = index+1;
          monthAlsoMoneys = monthAlsoMoneys + "第" + month + "个月，" + value + "元\n";
        });
      }
      this.setData({
        calcResultData: this.data.calcResultData,
        monthAlsoMoneys: monthAlsoMoneys
      });
    },
    onCloseClick: function onCloseClick(e) {
      this.triggerEvent('closeclick', {});
    },
    onTouchmask: function onTouchmask(event) {
      console.log('onTouchmask');
    },
    
  }
});