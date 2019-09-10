"use strict";

Component({
    properties: {
        tab_datas: {
            type: Array,
            value:[
                { id: "house_commercial_loan", title: "商业房贷", isSelect: true },
                { id: "accumulation_fund_loan", title: "公积金房贷", isSelect: false },
                { id: "house_combination_loan", title: "组合房贷", isSelect: false },
            ],
            observer: "onItemsChange"
        },
        cur_tab_id: {
            type: String,
            value: "",
            observer: 'onSelectIndexChange'
        }
    },


    data: {
        defaut_tab_datas: [
            { id: "house_commercial_loan", title: "商业房贷", isSelect: true },
            { id: "accumulation_fund_loan", title: "公积金房贷", isSelect: false },
            { id: "house_combination_loan", title: "组合房贷", isSelect: false },
        ]
    },

 
    methods: {
        onTabItemClick: function onTabItemClick(e) {
            var id = e.currentTarget.dataset.tabs.id;
            this.updateData(id);
            this.triggerEvent('tabclick', { id: e.currentTarget.dataset.tabs.id });
        },
        onSelectIndexChange: function onSelectIndexChange() {
            var id = this.data.cur_tab_id;
            this.updateData(id);
        },
        updateData: function updateData(id) {
            for (var i = 0; i < this.data.tab_datas.length; i++) {
                if (id == this.data.tab_datas[i].id) {
                    this.data.tab_datas[i].isSelect = true;
                    this.data.cur_tab_id = this.data.tab_datas[i].id;
                } else {
                    this.data.tab_datas[i].isSelect = false;
                }
            }
            this.onItemsChange();
        },
        onItemsChange: function onItemsChange() {
            this.setData({
                tab_datas: this.data.tab_datas == null || this.data.tab_datas.length == 0 ? this.data.defaut_tab_datas : this.data.tab_datas
            });
        }
    }
});