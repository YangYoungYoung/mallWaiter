// pages/order/order.js
var network = require("../../utils/network.js");
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description: '',
    show: false, //action是否显示
    status: '',
    totalPrice: 0, //总价
    quantity: 0, //总菜品数
    tagColor: '#0FB0F9',
    fromService: 0,
    actions: [{
        id: 1,
        name: '划菜',
        disabled: false
      },
      // {
      //   id: 2,
      //   name: '起菜',
      //   disabled: false
      // },
      {
        id: 2,
        name: '退菜',
        disabled: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.fromService != undefined) {

      that.setData({
        fromService: options.fromService
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // var order_id = "25717603011921208";
    var order_id = wx.getStorageSync('orderId');
    let url = "api/orders/" + order_id;
    var params = {
      // code: app.globalData.code
      // order_id
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.msg != null) {

          // console.log("这里的结果是：" + res.data.msg[0].loi[0].p.name); //正确返回结果
          var loi = res.data.msg.loi;
          // var totalPrice = res.data.msg[0].real_pay;
          that.getOrderPrice();
          console.log("当前总价为：" + that.data.totalPrice);
          if (res.data.msg.description) {
            that.setData({
              description: res.data.msg.description
            })
          }
          // that.setData({
          //   loi: loi
          // })
          var quantity = 0;
          var status = '';
          for (var i = 0; i < loi.length; i++) {

            quantity += loi[i].quantity;
            switch (loi[i].status_id) {
              case 0:
                loi[i].status = '待接单';
                break;
              case 1:
                loi[i].status = '未开做';
                break;
              case 2:
                loi[i].status = '已开做';
                break;
              case 3:
                loi[i].status = '已上菜';
                break;
              case 4:
                loi[i].status = '已结算';
                break;
              case 5:
                loi[i].status = '已退单';
                break;
              case 6:
                loi[i].status = '退菜';
                break;
            }
          }
          console.log("一共多少道菜：" + quantity);
          that.setData({
            loi: loi,
            quantity: quantity
          })
        } else {
          common.showTip("当前没有数据", "loading");
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
  //获取订单价格
  getOrderPrice() {
    var that = this;
    // var phone = that.data.phone;
    var orderId = wx.getStorageSync("orderId");
    // var orderId = "25767795778125825";
    let url = "/api/weiXin/payableMoney"
    let method = "GET"
    var params = {
      // phone: phone,
      orderId: orderId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          var msg = res.data.msg;
          that.setData({
            totalPrice: msg
          })
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
  //返回首页
  toIndex: function() {
    wx.redirectTo({
      url: '../index/index',
    })
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
    let id = event.detail.id;
    let that = this;
    switch (id) {

      case 1:
        //当前为划菜
        console.log("当前为划菜");
        that.serving();
        that.onClose();
        break;
        // case 2:
        //   //当前为起菜
        //   console.log("当前为起菜");
        //   that.onClose();
        //   break;
      case 2:
        //当前为退菜
        console.log("当前为退菜");
        that.onClose();
        break;
      default:
        break;
    }
  },
  //弹出action
  onShowAciton(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('当前的index:', index);
    that.setData({
      show: true,
      index:index
    })
  },
  //划菜
  serving: function() {
    let that = this;
    
    // var orderId = wx.getStorageSync("orderId");
    let index = that.data.index;
    let loi = that.data.loi;
    let orderItemId = loi[index].id;
    console.log('orderItemId is:', orderItemId);
    let orderItem = {
      id: orderItemId,
      status_id:3
    }
    let url = "/api/order-product/" + orderItemId
    let method = "PUT"
    var params = {
      // phone: phone,
      id: orderItemId,
      orderItem: orderItem
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          var msg = res.data.msg;
          console.log("退菜返回的是:",msg);
          // that.setData({
          //   totalPrice: msg
          // })
          that.onShow();
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
  //退菜
  
})