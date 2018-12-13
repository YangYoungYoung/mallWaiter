// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 登录
    // wx.login({
    //   success: res => {
    //     app.globalData.code = res.code
    //     //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
    //     app.globalData.userInfo = wx.getStorageSync('userInfo')
    //     if (app.globalData.userInfo) {
    //       that.setData({
    //         authorization: false
    //       })
    //     }
    //     //wx.getuserinfo接口不再支持
    //     wx.getSetting({
    //       success: (res) => {
    //         //判断用户已经授权。不需要弹框
    //         if (!res.authSetting['scope.userInfo']) {
    //           that.setData({
    //             showModel: true
    //           })
    //         } else { //没有授权需要弹框
    //           that.setData({
    //             showModel: false
    //           })
    //           wx.showLoading({
    //             title: '加载中...'
    //           })
    //           that.getOP(app.globalData.userInfo)
    //         }
    //       },
    //       fail: function () {
    //         wx.showToast({
    //           title: '网络错误',
    //           icon: 'warn',
    //           duration: 1500,
    //         })
    //       }
    //     })
    //   },
    //   fail: function () {
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'warn',
    //       duration: 1500,
    //     })
    //   }
    // })
    // that.onShow();
  },
  //获取用户信息新接口
  // bindGetUserInfo: function (e) {
  //   //设置用户信息本地存储
  //   try {
  //     wx.setStorageSync('userInfo', e.detail.userInfo)
  //   } catch (e) {
  //     wx.showToast({
  //       title: '网络错误',
  //       icon: 'warn',
  //       duration: 1500,
  //     })
  //   }
  //   // wx.showLoading({
  //   //   title: '加载中...'
  //   // })
  //   let that = this
  //   if (e.detail.userInfo) {
  //     that.getOP(e.detail.userInfo)
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '小程序功能需要授权才能正确使用哦！请点击“确定”-“用户信息”再次授权',
  //       success: function (res) {
  //         if (res.confirm) {
  //           common.showTip("请点击授权按钮", "loading");
  //           that.setData({
  //             state: false
  //           })
  //         }
  //       }
  //     })
  //   }
  // },
  // getOP: function (res) { //提交用户信息 获取用户id
  //   let that = this
  //   let userInfo = res
  //   app.globalData.userInfo = userInfo
  //   // let url = "http://192.168.0.146:8081/weixin/getopen"
  //   let url = "getOpenId"
  //   console.log("当前的code值是：" + app.globalData.code);
  //   var params = {
  //     code: app.globalData.code
  //   }
  //   let method = "GET";

  //   wx.showLoading({
  //     title: '加载中...',
  //   }),
  //     network.POST(url, params, method).then((res) => {
  //       wx.hideLoading();
  //       console.log("openId的结果是：" + res.data.openid); //正确返回结果
  //       wx.setStorageSync('openId', res.data.openid); // 单独存储openid
  //       that.setData({
  //         authorization: false
  //       })
  //     }).catch((errMsg) => {
  //       wx.hideLoading();
  //       console.log(errMsg); //错误提示信息
  //       wx.showToast({
  //         title: '网络错误',
  //         icon: 'loading',
  //         duration: 1500,
  //       })
  //     });
  // },
  // //二次授权
  // handler: function (e) {

  //   if (e.detail.authSetting['scope.userInfo']) {

  //     wx.getUserInfo({
  //       success: res => {
  //         this.getOP(res.userInfo)
  //       }
  //     })
  //   }
  // },

  // 获取输入账号
  phoneInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function() {
    var that = this;
    if (that.data.name.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      // 这里修改成跳转的页面
      let url = "api/user/login"
      // var openId = wx.getStorageSync('openId');

      var name = that.data.name;
      console.log("当前name是：" + name);

      var password = that.data.password;

      var params = {
        //用户名称
        account: name,
        //密码
        password: password
      }
      let method = "POST";
      wx.showLoading({
          title: '加载中...',
        }),
        network.POST(url, params, method).then((res) => {
          wx.hideLoading();
          if (res.data.code == 200) {
            common.showTip("登录成功！", "success");
            var shopId = res.data.msg.printerListByShop[0].shop_id;
            if (shopId) {
              wx.setStorageSync('shopId', shopId);
              console.log('shopId is:', shopId);
              wx.redirectTo({
                url: '../index/index',
              })
            }
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
    }
  }


})