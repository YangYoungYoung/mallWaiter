// pages/callService/callService.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let url = "api/shop/" + shopId + "/call-service/list"

    let method = "GET";
    let params = {
      id:shopId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          // console.log("获取的信息是：", res.data.msg.diningTableList);
          // var regionList = res.data.msg.regionList;
          let serviceList = res.data.msg;
          that.setData({
            serviceList: serviceList
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
  //接单
  receiving:function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    console.log('index is:',index);
    let serviceList = that.data.serviceList;
    let orderId = serviceList[index].order_id;
    console.log('orderId is:',orderId);
    wx.navigateTo({
      url: '../serviceOrder/serviceOrder?orderId=' + orderId,
    })
  }
})