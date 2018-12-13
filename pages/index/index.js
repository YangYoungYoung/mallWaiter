//index.js
//获取应用实例
// const app = getApp()
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")

Page({
  data: {
    regionList: [],
    show: false,
    actions: [{
        id: 1,
        name: '开台',
        disabled: false
      },
      {
        id: 2,
        name: '点餐',
        disabled: false
      },
      {
        id: 3,
        name: '加餐',
        disabled: false
      },
      {
        id: 4,
        name: '划菜',
        disabled: false
      },
      {
        id: 5,
        name: '起菜',
        disabled: false
      },
      {
        id: 6,
        name: '顾客转台',
        disabled: false
      },
      {
        id: 7,
        name: '订单详情',
        disabled: false
      },
      {
        id: 8,
        name: '清台',
        disabled: false
      },
    ]
  },

  onLoad: function() {
    let that = this;
    that.queryTableAll();
    that.queryParamList();
  },

  //查询区域桌位
  queryTable: function(e) {
    var regionId = e.currentTarget.dataset.id;
    console.log("regionId is:", regionId);
    var that = this;
    var shopId = wx.getStorageSync('shopId');
    let url = "api/shop/" + shopId + "/diningTable/list"
    var params = {
      regionId: regionId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log("获取的信息是：", res.data.msg.diningTableList);
          // var regionList = res.data.msg.regionList;
          var diningTableList = res.data.msg.diningTableList;
          that.setData({
            // regionList: regionList,
            diningTableList: diningTableList
          })
        } else {
          var message = res.data.msg;
          common.showTip(message, "loading");
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //查询区域信息
  queryParamList() {
    var that = this;
    var shopId = wx.getStorageSync('shopId');
    let url = "api/shop/" + shopId + "/diningTable/queryParamList"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log("获取的信息是：", res.data.msg.regionList);
          var regionList = res.data.msg.regionList;
          var seatingNumbers = res.data.msg.seatingNumbers;
          that.setData({
            regionList: regionList,
            seatingNumbers: seatingNumbers
          })
          that.onShow();
        } else {
          var message = res.data.msg;
          common.showTip(message, "loading");
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },

  //查询全部
  queryTableAll: function() {
    var that = this;
    var shopId = wx.getStorageSync('shopId');
    let url = "api/shop/" + shopId + "/diningTable/list"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          // console.log("获取的信息是：", res.data.msg.diningTableList);
          // var regionList = res.data.msg.regionList;
          var diningTableList = res.data.msg;
          that.setData({
            // regionList: regionList,
            diningTableList: diningTableList
          })
          that.onShow();
        } else {
          var message = res.data.msg;
          common.showTip(message, "loading");
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },

  //桌位人数的单选按钮组
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  //关闭actionSheet
  onClose() {
    this.setData({
      show: false
    });
  },
  //选择actionSheet
  onSelect(event) {
    console.log(event.detail.id);
    
  },

  //弹出action
  showAction(e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    console.log("status is:", status);
    var actions = that.data.actions;
    //根据桌位状态展示不同的菜单可选项
    if (status == 0) {
      //空闲状态
      for (var i = 0; i < actions.length; i++) {
        if (i != 0) {
          actions[i].disabled = true;
        } else {
          actions[i].disabled = false;
        }
      }
      that.setData({
        actions: actions
      })
    } else if (status == 1) {
      //当前为开桌状态
      for (var i = 0; i < actions.length; i++) {

        if (i == 1 || i == 5 || i == 7) {
          console.log("dangqina ");
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    } else if (status == 2) {
      //当前为进行中状态
      for (var i = 0; i < actions.length; i++) {

        if (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    }
    this.setData({
      show: true
    });
  }
})