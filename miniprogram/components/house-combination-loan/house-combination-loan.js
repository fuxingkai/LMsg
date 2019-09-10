"use strict";

/**
 * 计算公式:
等额本息还款法:
每月月供额=〔贷款本金×月利率×(1+月利率)^还款月数〕÷〔(1+月利率)^还款月数-1〕
每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
总利息=还款月数×每月月供额-贷款本金

等额本金还款法:
每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
每月应还本金=贷款本金÷还款月数
每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
总利息 =〔(贷款本金÷还款月数 + 贷款本金×月利率) + 贷款本金÷还款月数×(1 + 月利率) 〕÷2×还款月数 - 贷款本金
说明:月利率=年利率÷12 15^4=15×15×15×15(15的4次方,即4个15相乘的意思)

 */
Component({
  properties: {
    list: {
      type: Array,
      value: [

      ],
      observer: "onItemsChange"
    },

  },


  data: {
    times: [{
        id: 12,
        name: '1年（12期）'
      },
      {
        id: 24,
        name: '2年（24期）'
      },
      {
        id: 36,
        name: '3年（36期）'
      },
      {
        id: 48,
        name: '4年（48期）'
      }, {
        id: 60,
        name: '5年（60期）'
      },
      {
        id: 72,
        name: '6年（72期）'
      },
      {
        id: 84,
        name: '7年（84期）'
      },
      {
        id: 96,
        name: '8年（96期）'
      },
      {
        id: 108,
        name: '9年（108期）'
      },
      {
        id: 120,
        name: '10年（120期）'
      },
      {
        id: 132,
        name: '11年（132期）'
      },
      {
        id: 144,
        name: '12年（144期）'
      }, {
        id: 156,
        name: '13年（156期）'
      },
      {
        id: 168,
        name: '14年（168期）'
      },
      {
        id: 180,
        name: '15年（180期）'
      },
      {
        id: 192,
        name: '16年（192期）'
      },
      {
        id: 204,
        name: '17年（204期）'
      },
      {
        id: 216,
        name: '18年（216期）'
      },
      {
        id: 228,
        name: '19年（228期）'
      },
      {
        id: 240,
        name: '20年（240期）'
      }, {
        id: 252,
        name: '21年（252期）'
      },
      {
        id: 264,
        name: '22年（264期）'
      },
      {
        id: 276,
        name: '23年（276期）'
      },
      {
        id: 288,
        name: '24年（288期）'
      },
      {
        id: 300,
        name: '25年（300期）'
      },
      {
        id: 312,
        name: '26年（312期）'
      },
      {
        id: 324,
        name: '27年（324期）'
      },
      {
        id: 336,
        name: '28年（336期）'
      }, {
        id: 348,
        name: '29年（348期）'
      },
      {
        id: 360,
        name: '30年（360期）'
      },
      {
        id: 180,
        name: '15年（180期）'
      },
      {
        id: 192,
        name: '16年（192期）'
      },
    ],
    timesIndex: 9,
    discounts: [{
        id: 1.1,
        name: '1.1倍'
      },
      {
        id: 1,
        name: '无折扣'
      },
      {
        id: 0.7,
        name: '7折'
      },
      {
        id: 0.8,
        name: '8折'
      },
      {
        id: 0.85,
        name: '8.5折'
      },
      {
        id: 0.9,
        name: '9折'
      },
      {
        id: 0.95,
        name: '9.5折'
      }

    ],
    discountsIndex: 1,
    money: "",
    reimbursement: "equal_principal", //还款方式
    yearRate: 4.9, //年利率
    monthRate: 4.9 / 12 / 100, //月利率
    aFtimes: [{
        id: 12,
        name: '1年（12期）'
      },
      {
        id: 24,
        name: '2年（24期）'
      },
      {
        id: 36,
        name: '3年（36期）'
      },
      {
        id: 48,
        name: '4年（48期）'
      }, {
        id: 60,
        name: '5年（60期）'
      },
      {
        id: 72,
        name: '6年（72期）'
      },
      {
        id: 84,
        name: '7年（84期）'
      },
      {
        id: 96,
        name: '8年（96期）'
      },
      {
        id: 108,
        name: '9年（108期）'
      },
      {
        id: 120,
        name: '10年（120期）'
      },
      {
        id: 132,
        name: '11年（132期）'
      },
      {
        id: 144,
        name: '12年（144期）'
      }, {
        id: 156,
        name: '13年（156期）'
      },
      {
        id: 168,
        name: '14年（168期）'
      },
      {
        id: 180,
        name: '15年（180期）'
      },
      {
        id: 192,
        name: '16年（192期）'
      },
      {
        id: 204,
        name: '17年（204期）'
      },
      {
        id: 216,
        name: '18年（216期）'
      },
      {
        id: 228,
        name: '19年（228期）'
      },
      {
        id: 240,
        name: '20年（240期）'
      }, {
        id: 252,
        name: '21年（252期）'
      },
      {
        id: 264,
        name: '22年（264期）'
      },
      {
        id: 276,
        name: '23年（276期）'
      },
      {
        id: 288,
        name: '24年（288期）'
      },
      {
        id: 300,
        name: '25年（300期）'
      },
      {
        id: 312,
        name: '26年（312期）'
      },
      {
        id: 324,
        name: '27年（324期）'
      },
      {
        id: 336,
        name: '28年（336期）'
      }, {
        id: 348,
        name: '29年（348期）'
      },
      {
        id: 360,
        name: '30年（360期）'
      },
      {
        id: 180,
        name: '15年（180期）'
      },
      {
        id: 192,
        name: '16年（192期）'
      },
    ],
    aFtimesIndex: 9,
    aFdiscounts: [{
        id: 1.1,
        name: '1.1倍'
      },
      {
        id: 1,
        name: '无折扣'
      },
      {
        id: 0.7,
        name: '7折'
      },
      {
        id: 0.8,
        name: '8折'
      },
      {
        id: 0.85,
        name: '8.5折'
      },
      {
        id: 0.9,
        name: '9折'
      },
      {
        id: 0.95,
        name: '9.5折'
      }

    ],
    aFdiscountsIndex: 1,
    aFmoney: "",
    aFyearRate: 3.25, //年利率
    aFmonthRate: 3.25 / 12 / 100, //月利率
    isShowResultPop: false
  },


  methods: {

    onItemsChange: function onItemsChange() {
      this.setData({
        list: this.data.list,
      });
    },

    /**
     * 还款方式
     */
    radioChange: function radioChange(e) {
      console.log("onClickSubmit", e);
      this.setData({
        reimbursement: e.detail.value
      })
    },

    /**
     * 贷款金额
     */
    bindMoneyInput: function(e) {
      this.data.money = e.detail.value;
    },

    /**
     * 贷款期限
     */
    bindPickerTimesChange: function(e) {
      this.setData({
        timesIndex: e.detail.value
      })
    },


    /**
     * 利率折扣
     */
    bindPickerDiscountChange: function(e) {
      let monthRate = this.data.yearRate / 12 / 100;
      monthRate = monthRate * this.data.discounts[e.detail.value].id;
      this.setData({
        discountsIndex: e.detail.value,
        monthRate: monthRate
      })
    },

    /**
     * 年利率
     * 月利率：年利率 / 12
     */
    bindRateInput: function(e) {
      let monthRate = e.detail.value / 100 / 12;
      this.data.yearRate = e.detail.value / 100,
        monthRate = monthRate * this.data.discounts[this.data.discountsIndex].id;
      this.setData({
        monthRate: monthRate
      })
    },

    /**
     * 利率折扣
     */
    bindAFPickerDiscountChange: function(e) {
      let aFmonthRate = this.data.aFyearRate / 12 / 100;
      aFmonthRate = aFmonthRate * this.data.aFdiscounts[e.detail.value].id;
      this.setData({
        aFdiscountsIndex: e.detail.value,
        aFmonthRate: aFmonthRate
      })
    },

    /**
     * 年利率
     * 月利率：年利率 / 12
     */
    bindAFRateInput: function(e) {
      let aFmonthRate = e.detail.value / 100 / 12;
      this.data.aFyearRate = e.detail.value / 100,
        aFmonthRate = aFmonthRate * this.data.aFdiscounts[this.data.aFdiscountsIndex].id;
      this.setData({
        aFmonthRate: aFmonthRate
      })
    },

    /**
     * 贷款金额
     */
    bindAFMoneyInput: function(e) {
      this.data.aFmoney = e.detail.value;
    },

    /**
     * 贷款期限
     */
    bindAFPickerTimesChange: function(e) {
      this.setData({
        aFtimesIndex: e.detail.value
      })
    },


    /**
     * 关闭弹出
     * @param {*} e 
     */
    onClickPopClose: function onClickPopClose(e) {
      console.log('onClickPopClose', e);
      this.setData({
        isShowResultPop: false,
      });
    },

    onClickSubmit: function(e) {
      console.log("onClickSubmit", e);
      let tip = "";
      if (this.data.money == "") {
        tip = "贷款金额不能为空";
      }

      var reg = /^[0-9]*(.)[0-9]*$/;
      if (!reg.test(this.data.yearRate)) {
        tip = "年利率格式不规则";
      }

      if (this.data.yearRate == "") {
        tip = "年利率不能为空";
      }

      if (tip != "") {
        wx.showToast({
          title: tip,
          duration: 1500,
          icon: 'none',
          mask: true
        })
        return;
      }
      let calcResultData = {};
      if (this.data.reimbursement == 'equal_interest') {
        calcResultData.reimbursement = 'equal_interest';
        calcResultData = this.dealEqualInterest(calcResultData);
      } else if (this.data.reimbursement == 'equal_principal') {
        calcResultData.reimbursement = 'equal_principal';
        calcResultData = this.dealEqualPrincipal(calcResultData);
      }


      this.setData({
        isShowResultPop: true,
        calcResultData: calcResultData
      });

    },

    /**
     * 处理等额本息还款
     * 等额本息还款法:
        每月月供额=〔贷款本金×月利率×(1+月利率)^还款月数〕÷〔(1+月利率)^还款月数-1〕
        每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
        总利息=还款月数×每月月供额-贷款本金

     */
    dealEqualInterest: function(calcResultData) {


      console.log("年利率", this.data.yearRate);
      console.log("月利率", this.data.monthRate);
      console.log("折扣", this.data.discounts[this.data.discountsIndex].id);

      let money = this.data.money * 10000;

      console.log("贷款额", money);


      //还款总月数
      let totalMonth = this.data.times[this.data.timesIndex].id;
      console.log("还款总月数", totalMonth);


      //每月月供额 =〔贷款本金×月利率×(1+月利率)^还款月数〕÷〔(1+月利率)^还款月数-1〕
      let monthAlsoMoney = (money * this.data.monthRate * Math.pow((1 + this.data.monthRate), totalMonth)) / (Math.pow((1 + this.data.monthRate), totalMonth) - 1)
      console.log("每月月供额", monthAlsoMoney);

      // 每月应还利息 = 贷款本金×月利率×〔(1 + 月利率) ^ 还款月数 - (1 + 月利率) ^ (还款月序号 - 1) 〕÷〔(1 + 月利率) ^ 还款月数 - 1〕
      let monthInterest = 0;
      let monthInterests = [];
      for (let i = 0; i < totalMonth; i++) {
        monthInterest = (money * this.data.monthRate * (Math.pow((1 + this.data.monthRate), totalMonth) - Math.pow((1 + this.data.monthRate), i))) / (Math.pow((1 + this.data.monthRate), totalMonth) - 1)
        monthInterests.push(monthInterest);
        console.log("每月应还利息", "第" + i + "个月" + monthInterest);
      }


      //每月应还本金 = 贷款本金×月利率×(1 + 月利率) ^ (还款月序号 - 1) ÷〔(1 + 月利率) ^ 还款月数 - 1〕
      let monthPrincipalMoney = 0;
      let monthPrincipalMoneys = [];
      for (let j = 0; j < totalMonth; j++) {
        monthPrincipalMoney = (money * this.data.monthRate * Math.pow((1 + this.data.monthRate), j)) / (Math.pow((1 + this.data.monthRate), totalMonth) - 1)
        monthPrincipalMoneys.push(monthPrincipalMoney);
        console.log("每月应还本金", "第" + j + "个月" + monthPrincipalMoney);
      }

      //还款总额
      let totalMoney = totalMonth * monthAlsoMoney;
      console.log("还款总额", totalMoney);

      //总利息 = 还款月数×每月月供额 - 贷款本金
      let totalInterest = totalMonth * monthAlsoMoney - money;
      console.log("总利息", totalInterest);

      

      let aFmoney = this.data.aFmoney * 10000;

      console.log("公积金贷款额", aFmoney);


      //公积金还款总月数
      let aFtotalMonth = this.data.aFtimes[this.data.aFtimesIndex].id;
      console.log("公积金还款总月数", aFtotalMonth);


      //每月月供额 =〔贷款本金×月利率×(1+月利率)^还款月数〕÷〔(1+月利率)^还款月数-1〕
      let aFmonthAlsoMoney = (money * this.data.aFmonthRate * Math.pow((1 + this.data.aFmonthRate), aFtotalMonth)) / (Math.pow((1 + this.data.aFmonthRate), aFtotalMonth) - 1)
      console.log("公积金每月月供额", aFmonthAlsoMoney);

      // 每月应还利息 = 贷款本金×月利率×〔(1 + 月利率) ^ 还款月数 - (1 + 月利率) ^ (还款月序号 - 1) 〕÷〔(1 + 月利率) ^ 还款月数 - 1〕
      let aFmonthInterest = 0;
      let aFmonthInterests = [];
      for (let i = 0; i < aFtotalMonth; i++) {
        aFmonthInterest = (money * this.data.aFmonthRate * (Math.pow((1 + this.data.aFmonthRate), aFtotalMonth) - Math.pow((1 + this.data.aFmonthRate), i))) / (Math.pow((1 + this.data.aFmonthRate), aFtotalMonth) - 1)
        aFmonthInterests.push(aFmonthInterest);
        console.log("公积金每月应还利息", "第" + i + "个月" + aFmonthInterest);
      }


      //每月应还本金 = 贷款本金×月利率×(1 + 月利率) ^ (还款月序号 - 1) ÷〔(1 + 月利率) ^ 还款月数 - 1〕
      let aFmonthPrincipalMoney = 0;
      let aFmonthPrincipalMoneys = [];
      for (let j = 0; j < aFtotalMonth; j++) {
        aFmonthPrincipalMoney = (aFmoney * this.data.aFmonthRate * Math.pow((1 + this.data.aFmonthRate), j)) / (Math.pow((1 + this.data.aFmonthRate), aFtotalMonth) - 1)
        aFmonthPrincipalMoneys.push(aFmonthPrincipalMoney);
        console.log("每月应还本金", "第" + j + "个月" + aFmonthPrincipalMoney);
      }

      //还款总额
      let aFtotalMoney = aFtotalMonth * aFmonthAlsoMoney;
      console.log("还款总额", aFtotalMoney);

      //总利息 = 还款月数×每月月供额 - 贷款本金
      let aFtotalInterest = aFtotalMonth * aFmonthAlsoMoney - aFmoney;
      console.log("总利息", aFtotalInterest);

      let combinationMoney = money + aFmoney;
      calcResultData.money = combinationMoney.toFixed(2);

      let combinationTotalMonth = totalMonth > aFtotalMonth ? totalMonth : aFtotalMonth;
      calcResultData.totalMonth = combinationTotalMonth;

      calcResultData.monthAlsoMoney = 0;

      let combinationMonthAlsoMoneys = [];
      for(let c=0; c<combinationTotalMonth;c++){
        let combinationMonthAlsoMoney = 0;
        if (c <= totalMonth-1){
          combinationMonthAlsoMoney = combinationMonthAlsoMoney + monthAlsoMoney;
        }
        if (c <= aFtotalMonth - 1) {
          combinationMonthAlsoMoney = combinationMonthAlsoMoney + aFmonthAlsoMoney;
        }
        combinationMonthAlsoMoneys.push(combinationMonthAlsoMoney.toFixed(2));
      }
      calcResultData.monthAlsoMoneys = combinationMonthAlsoMoneys;

      let combinationTotalMoney = totalMoney + aFtotalMoney;
      calcResultData.totalMoney = combinationTotalMoney.toFixed(2);

      let combinationTotalInterest = totalInterest + aFtotalInterest;
      calcResultData.totalInterest = combinationTotalInterest.toFixed(2);

      return calcResultData;
    },

    /**
   * 处理等额本金还款
   * 等额本金还款法:
      每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
      每月应还本金=贷款本金÷还款月数
      每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
      每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
      总利息 =〔(贷款本金÷还款月数 + 贷款本金×月利率) + 贷款本金÷还款月数×(1 + 月利率) 〕÷2×还款月数 - 贷款本金
  */
    dealEqualPrincipal: function(calcResultData) {
      let money = this.data.money * 10000;
      console.log("年利率", this.data.yearRate);
      console.log("月利率", this.data.monthRate);
      console.log("折扣", this.data.discounts[this.data.discountsIndex].id);
      console.log("贷款额", money);

      //还款总月数
      let totalMonth = this.data.times[this.data.timesIndex].id;
      console.log("还款总月数", totalMonth);

      //每月应还本金 = 贷款本金÷还款月数
      let monthPrincipalMoney = money / totalMonth;
      console.log("每月应还本金", monthPrincipalMoney);

      //还款总额
      let totalMoney = 0;

      //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
      let monthAlsoMoney = 0;
      let monthAlsoMoneys = [];
      for (let j = 0; j < totalMonth; j++) {
        monthAlsoMoney = money / totalMonth + (money - monthPrincipalMoney * j) * this.data.monthRate;
        console.log("每月月供额", "第" + j + "个月" + monthAlsoMoney);
        monthAlsoMoneys.push(monthAlsoMoney.toFixed(2));
        totalMoney = totalMoney + monthAlsoMoney;
      }


      // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
      let monthInterest = 0;
      let monthInterests = [];
      for (let i = 0; i < totalMonth; i++) {
        monthInterest = (money - monthPrincipalMoney * i) * this.data.monthRate;
        monthInterests.push(monthInterest);
        console.log("每月应还利息", "第" + i + "个月" + monthInterest);
      }



      // 每月月供递减额 = 每月应还本金×月利率 = 贷款本金÷还款月数×月利率
      let monthAlsoDiminishingMoney = money / totalMonth * this.data.monthRate;
      console.log("每月月供递减额", monthAlsoDiminishingMoney);


      //总利息 =〔(贷款本金÷还款月数 + 贷款本金×月利率) + 贷款本金÷还款月数×(1 + 月利率) 〕÷2×还款月数 - 贷款本金
      let totalInterest = ((money / totalMonth + money * this.data.monthRate) + money / totalMonth * (1 + this.data.monthRate)) / 2 * totalMonth - money;
      console.log("总利息", totalInterest);

      console.log("还款总额", totalMoney);

      let aFmoney = this.data.aFmoney * 10000;
      console.log("公积金年利率", this.data.aFyearRate);
      console.log("公积金月利率", this.data.aFmonthRate);
      console.log("公积金折扣", this.data.aFdiscounts[this.data.aFdiscountsIndex].id);
      console.log("公积金贷款额", aFmoney);

      //还款总月数
      let aFtotalMonth = this.data.aFtimes[this.data.aFtimesIndex].id;
      console.log("公积金还款总月数", aFtotalMonth);

      //每月应还本金 = 贷款本金÷还款月数
      let aFmonthPrincipalMoney = aFmoney / aFtotalMonth;
      console.log("公积金每月应还本金", aFmonthPrincipalMoney);

      //还款总额
      let aFtotalMoney = 0;

      //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
      let aFmonthAlsoMoney = 0;
      let aFmonthAlsoMoneys = [];
      for (let j = 0; j < aFtotalMonth; j++) {
        aFmonthAlsoMoney = aFmoney / aFtotalMonth + (aFmoney - aFmonthPrincipalMoney * j) * this.data.aFmonthRate;
        console.log("公积金每月月供额", "第" + j + "个月" + aFmonthAlsoMoney);
        aFmonthAlsoMoneys.push(aFmonthAlsoMoney.toFixed(2));
        aFtotalMoney = aFtotalMoney + aFmonthAlsoMoney;
      }


      // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
      let aFmonthInterest = 0;
      let aFmonthInterests = [];
      for (let i = 0; i < aFtotalMonth; i++) {
        aFmonthInterest = (aFmoney - aFmonthPrincipalMoney * i) * this.data.aFmonthRate;
        aFmonthInterests.push(aFmonthInterest);
        console.log("公积金每月应还利息", "第" + i + "个月" + aFmonthInterest);
      }



      // 每月月供递减额 = 每月应还本金×月利率 = 贷款本金÷还款月数×月利率
      let aFmonthAlsoDiminishingMoney = aFmoney / aFtotalMonth * this.data.aFmonthRate;
      console.log("公积金每月月供递减额", aFmonthAlsoDiminishingMoney);


      //总利息 =〔(贷款本金÷还款月数 + 贷款本金×月利率) + 贷款本金÷还款月数×(1 + 月利率) 〕÷2×还款月数 - 贷款本金
      let aFtotalInterest = ((aFmoney / aFtotalMonth + aFmoney * this.data.aFmonthRate) + aFmoney / aFtotalMonth * (1 + this.data.aFmonthRate)) / 2 * aFtotalMonth - aFmoney;
      console.log("总利息", aFtotalInterest);

      console.log("还款总额", aFtotalMoney);

      let combinationMoney = money + aFmoney;
      calcResultData.money = combinationMoney.toFixed(2);

      let combinationTotalMonth = totalMonth > aFtotalMonth ? totalMonth : aFtotalMonth;
      calcResultData.totalMonth = combinationTotalMonth;

      calcResultData.monthAlsoMoney = 0;

      let combinationMonthAlsoMoneys = [];
      for (let c = 0; c < combinationTotalMonth; c++) {
        let combinationMonthAlsoMoney = 0;
        if (c <= totalMonth - 1) {
          combinationMonthAlsoMoney = combinationMonthAlsoMoney + parseFloat(monthAlsoMoneys[c]);
        }
        if (c <= aFtotalMonth - 1) {
          combinationMonthAlsoMoney = combinationMonthAlsoMoney + parseFloat(aFmonthAlsoMoneys[c]);
        }
        combinationMonthAlsoMoneys.push(combinationMonthAlsoMoney.toFixed(2));
      }
      calcResultData.monthAlsoMoneys = combinationMonthAlsoMoneys;

      let combinationTotalMoney = totalMoney + aFtotalMoney;
      calcResultData.totalMoney = combinationTotalMoney.toFixed(2);

      let combinationTotalInterest = totalInterest + aFtotalInterest;
      calcResultData.totalInterest = combinationTotalInterest.toFixed(2);


      return calcResultData;
    },

    onClickReset: function(e) {
      console.log("onClickReset", e);
      this.setData({
        money: "",
        yearRate: "",
        monthRate: "",
        timesIndex: 9,
        discountsIndex: 1,
        aFmoney: "",
        aFyearRate: "",
        aFmonthRate: "",
        aFtimesIndex: 9,
        aFdiscountsIndex: 1,
      });
    },

  }
});