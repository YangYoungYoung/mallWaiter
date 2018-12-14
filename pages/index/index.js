//index.js
//获取应用实例
// const app = getApp()
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")

Page({
  data: {
    showModal: false,
    peopleNumber: '',
    seatNumber: '',
    regionList: [],
    diningTableList:[],
    show: false,
    index: 0,
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

  //选择不同的区域
  bindPickerChange: function(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var id = that.data.regionList[e.detail.value].id;
    console.log('picker发送选择改变，id携带值为', id);
    that.setData({
      index: e.detail.value
    })
  },

  onLoad: function() {
    let that = this;
    wx.setStorageSync('shopId', 10041);
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
          var obj = {
            id: 0,
            name: "全部"
          }
          regionList.unshift(obj);
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
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let that = this;
    that.setData({
      seatNumber: e.detail.value
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
    var id = event.detail.id;
    var that = this;
    switch (id) {
      case 1:
        //当前为开台的时候,弹出就餐人数的弹窗
        that.showDialogBtn();
        break;
      case 2:
        //当前为点餐，跳转到点餐的页面
        console.log("当前为点餐，跳转到点餐的页面");

        break;
      case 3:
        //当前为加餐
        console.log("当前为加餐");
        break;
      case 4:
        //当前为划菜
        console.log("当前为划菜");
        break;
      case 5:
        //当前为起菜
        console.log("当前为起菜");
        break;
      case 6:
        //当前为顾客转台
        console.log("当前为顾客转台");
        break;
      case 7:
        //当前为订单详情
        console.log("当前为订单详情");
        break;
      case 8:
        //当前为清台
        console.log("当前为清台");
        break;
    }

  },

  //弹出action
  showAction(e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    that.setData({
      index: index
    })
    console.log("status is:", status);
    console.log("index is:", index);
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
  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 实际就餐人数对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
   
  },
  //开台的接口
  openTable:function(){
    let that = this;
    // let url = "http://192.168.0.146:8083/api/putForward"
    let url = "api/openTable"
    let method = "GET"
    let index = that.data.index;
    let diningTableList = that.data.diningTableList;
    let peopleNumber = that.data.peopleNumber;
    let dining_table_id = diningTableList[index].serial_id;
    console.log('serial_id is', serial_id);
    
    var params = {
      peopleNumber: peopleNumber
    }
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互
        if (res.data.status == 200) {
          common.showTip("开台成功", "success");
        } else {
          var message = res.data.message
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
  //获取输入框里面的值
  inputChange: function(e) {
    this.setData({
      peopleNumber: e.detail.value
    })
  },
})