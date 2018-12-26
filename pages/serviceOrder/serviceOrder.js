// pages/serviceOrder/serviceOrder.js
var network = require("../../utils/network.js");
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId!=undefined){
      var orderId = options.orderId;
    }
   
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let url = "api/orderItem/list"

    let method = "GET";
    let params = {
      shopId: shopId,
      orderId:orderId,
      statusId:1
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log("获取的信息是：", res.data.msg);
          // var regionList = res.data.msg.regionList;
          // let serviceList = res.data.msg;
          // that.setData({
          //   serviceList: serviceList
          // })
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

  
})