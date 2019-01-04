// pages/serviceOrder/serviceOrder.js
var network = require("../../utils/network.js");
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quantity:0,
    totalPrice:0,
    loi:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId!=undefined){
      var orderId = options.orderId;
    }else{
      common.showTip('当前无数据','loading');
      return;
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
          var loi = res.data.msg;
          // let serviceList = res.data.msg;
          that.setData({
            loi: loi
          })
          that.totalPrice();
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
  //提交订单
  add:function(){
    let that = this;
    let orderItemList = that.data.loi;
    for(var i=0;i<loi.length;i++){
      orderItemList.status_id= 1;
    }
    var description = that.data.textAreaBlur;
    wx.request({
      url: 'https://api.cmdd.tech/api/orderItem/List',

      data: {
        orderItemList,
        description
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("提交返回：" + res.data);
        if (res.data.code == 200) {
          common.showTip("提交成功", 'success');
          // that.setData({
          //   isLotteryCash: res.data.msg.isLotteryCash
          // })
          // that.navigateToPayOrder();
        }
      }
    });
  },

  //计算菜品总数和总价
  totalPrice:function(){
    let that = this;
    let loi = that.data.loi;
    let totalCount = 0;
    let totalPrice = 0;
    for(var i = 0;i<loi.length;i++){
      console.log('loi[i].quantity:', loi[i].quantity);
      totalCount += loi[i].quantity;
      totalPrice += parseFloat(loi[i].isPromotionPrice) * loi[i].quantity;
    }
    that.setData({
      quantity: totalCount,
      totalPrice: totalPrice
    })
  }
  
})