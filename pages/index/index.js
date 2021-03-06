//index.js
//获取应用实例
// const app = getApp()
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var shopId;
// var name = wx.getStorageSync('name');
Page({
  data: {
    interval: "", //定时器
    showModal: false, //就餐人数弹窗是否显示
    showChangeModal: false, //转桌弹窗是否显示
    peopleNumber: '', //实际就餐人数
    seatNumber: 0, //桌位人数
    pickerSeatIndex: 0,
    regionList: [], //区域集合
    diningTableList: [], //桌位集合
    seatingNumbers: [], //座位数集合
    show: false, //action是否显示
    index: 0, //桌位索引
    pickerIndex: 0, //区域选择器索引
    changeSeatNumber: 0, //转桌时选择的几人桌
    changeRegion: 0,
    changeTableList: [], //转桌查询的桌位集合
    serviceNumber: 0, //呼叫服务数量
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

  //选择不同的区域来查询桌位
  bindPickerChange: function(e) {
    let that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var id = that.data.regionList[e.detail.value].id;
    console.log('picker发送选择改变，id携带值为', id);
    that.setData({
      pickerIndex: e.detail.value
    })
    that.onShow();
  },


  //选择不同的餐位数来查询桌位
  bindPickerSeatChange: function(e) {
    let that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var id = that.data.seatingNumbers[e.detail.value].id;
    console.log('picker发送选择改变，e.detail.value携带值为', e.detail.value);
    that.setData({
      pickerSeatIndex: e.detail.value,
      seatNumber: id
    })
    that.onShow();
  },

  onLoad: function() {
    wx.removeStorageSync('cartResult');
    shopId = wx.getStorageSync('shopId');
    // let that = this;
    // var seatNumber = that.data.seatNumber;
    // var pickerIndex = that.data.pickerIndex;
    // console.log("pickerIndex is:", pickerIndex);
    // console.log("seatNumber is:", seatNumber);
    // this.queryTable(seatNumber, pickerIndex);
    this.queryParamList();

  },

  onShow: function() {
    let that = this;
    var seatNumber = that.data.seatNumber;
    var pickerIndex = that.data.pickerIndex;
    console.log("pickerIndex is:", pickerIndex);
    console.log("seatNumber is:", seatNumber);
    that.queryTable(seatNumber, pickerIndex);
    // this.queryParamList();
    that.getService();
    that.setIntervalGetService();
  },

  //查询区域桌位信息
  queryTable: function(seatNumber, pickerIndex) {
    // var regionId = e.currentTarget.dataset.id;
    console.log("shopId is:", shopId);
    var that = this;
    var params = {};
    var regionId = 0;
    if (pickerIndex != 0) {
      regionId = that.data.regionList[pickerIndex].id;
      console.log('regionId is :', regionId);
    }
    //查看全部的桌位
    if (seatNumber == 0 && pickerIndex == 0) {

      params = {
        shopId: shopId
      }
    }
    //查看固定区域的所有桌位
    else if (pickerIndex != 0 && seatNumber == 0) {
      params = {
        shopId: shopId,
        regionId: regionId
      }
    }
    //查看固定区域的固定桌位
    else if (pickerIndex != 0 && seatNumber != 0) {
      params = {
        shopId: shopId,
        regionId: regionId,
        seatingNumber: seatNumber
      }
    }
    //查看固定人数的桌位
    else if (pickerIndex == 0 && seatNumber != 0) {
      params = {
        shopId: shopId,
        seatingNumber: seatNumber
      }
    }

    let url = "api/shop/" + shopId + "/diningTable/list"

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
          if (diningTableList.length == 0) {
            common.showTip('暂无数据', 'loading');
          }
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

    let url = "api/shop/" + shopId + "/diningTable/queryParamList"
    var params = {
      shopId: shopId
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
          var seatArray = [];
          for (var i = 0; i < seatingNumbers.length; i++) {
            let obj = {
              id: seatingNumbers[i],
              name: seatingNumbers[i] + '人'
            }
            seatArray.push(obj);
          }
          let seat = {
            id: 0,
            name: "全部"
          }
          seatArray.unshift(seat);
          regionList.unshift(obj);
          that.setData({
            regionList: regionList,
            seatingNumbers: seatArray
          })
          // that.onShow();
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
  // queryTableAll: function() {
  //   var that = this;
  //   let url = "api/shop/" + shopId + "/diningTable/list"
  //   var params = {
  //     shopId: shopId
  //   }
  //   let method = "GET";
  //   wx.showLoading({
  //       title: '加载中...',
  //     }),
  //     network.POST(url, params, method).then((res) => {
  //       wx.hideLoading();
  //       if (res.data.code == 200) {
  //         // console.log("获取的信息是：", res.data.msg.diningTableList);
  //         // var regionList = res.data.msg.regionList;
  //         var diningTableList = res.data.msg;
  //         that.setData({
  //           // regionList: regionList,
  //           diningTableList: diningTableList
  //         })
  //         // that.onShow();
  //       } else {
  //         var message = res.data.msg;
  //         common.showTip(message, "loading");
  //       }
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

  //根据桌位人数的单选按钮组查询桌位
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let that = this;
    that.setData({
      seatNumber: e.detail.value
    })
    that.onShow();
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
        wx.navigateTo({
          url: '../menu/menu',
        })
        break;
      case 3:
        //当前为加餐
        console.log("当前为加餐");
        wx.navigateTo({
          url: '../menu/menu',
        })
        break;
      case 4:
        //当前为划菜
        console.log("当前为划菜");
        wx.navigateTo({
          url: '../order/order',
        })
        break;
      case 5:
        //当前为起菜
        console.log("当前为起菜");
        that.qiCai();
        break;
      case 6:
        //当前为顾客转台
        console.log("当前为顾客转台");
        that.showChangeModalFunction();
        let index = that.data.index;
        let diningTableList = that.data.diningTableList;
        let fromDiningTableId = diningTableList[index].id;
        //查询当前可用的桌位
        let changeSeatNumber = that.data.changeSeatNumber;
        let changeRegion = that.data.changeRegion;
        that.changeQueryTable(0, 0);

        that.setData({
          fromDiningTableId: fromDiningTableId
        })

        break;
      case 7:
        //当前为订单详情
        console.log("当前为订单详情");
        wx.navigateTo({
          url: '../order/order',
        })
        break;
      case 8:
        //当前为清台
        console.log("当前为清台");
        that.clearDiningTable();
        break;
      default:
        break;
    }
    that.onClose();
  },

  //弹出action
  showAction(e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    //点击桌位的索引
    var index = e.currentTarget.dataset.index;
    //获取orderId
    let diningTableList = that.data.diningTableList;
    let orderId = diningTableList[index].orderId;
    let diningTableId = diningTableList[index].id;
    console.log('diningTableId is: ', diningTableId);
    wx.setStorageSync('diningTableId', diningTableId);
    if (orderId != null) {
      console.log("orderId is:", orderId);
      wx.setStorageSync('orderId', orderId);
    }
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
          // console.log("dangqina ");
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

        if (i == 2 || i == 3 || i == 5 || i == 6 || i == 7) {
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    } else if (status == 3) {
      //当前为加餐中状态
      for (var i = 0; i < actions.length; i++) {

        if (i == 3 || i == 5 || i == 6 || i == 7) {
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    } else {
      //当前为等叫中状态
      for (var i = 0; i < actions.length; i++) {

        if (i == 2 || i == 4 || i == 5 || i == 6 || i == 7) {
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
    this.openTable();
  },
  /**
   * 实际就餐人数对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.openTable();
    this.hideModal();
  },
  //开台的接口
  openTable: function() {
    let that = this;

    let url = "api/openTable"
    let method = "PUT"
    let index = that.data.index;
    let diningTableList = that.data.diningTableList;
    let peopleNumber = that.data.peopleNumber; //实际就餐人数
    let serial_id = diningTableList[index].serial_id; //桌位编号
    let dining_table_id = diningTableList[index].id; //桌位id
    let table_runnner = wx.getStorageSync('name'); //开桌人
    console.log('serial_id is', serial_id);
    var params = {
      dining_table_id: dining_table_id,
      peopleNumber: peopleNumber,
      serial_id: serial_id,
      table_runnner: table_runnner,
      shopId: shopId
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互
        if (res.data.code == 200) {
          common.showTip("开台成功", "success");
          that.onShow();
          that.onClose();
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

  //隐藏转桌弹窗
  hideChangeModal: function() {
    this.setData({
      showChangeModal: false
    })
  },
  //显示转桌弹窗
  showChangeModalFunction: function() {
    console.log('显示转桌弹窗');
    this.setData({
      showChangeModal: true
    })
  },
  //转桌时点击不同的桌位数
  changeTableSeat: function(event) {
    let that = this;
    //要查询的区域
    let changeRegion = that.data.changeRegion;
    let chagenSeatIndex = event.currentTarget.dataset.index;
    let seatingArray = that.data.seatingNumbers;
    for (var i = 0; i < seatingArray.length; i++) {
      if (i == chagenSeatIndex) {
        seatingArray[i].select = true
      } else {
        seatingArray[i].select = false
      }
    }
    let changeSeatNumber = seatingArray[chagenSeatIndex].id; //选择几人桌

    console.log("chagenSeatIndex is :", chagenSeatIndex);
    that.changeQueryTable(changeSeatNumber, changeRegion);
    that.setData({
      seatingNumbers: seatingArray,
      changeSeatNumber: changeSeatNumber,

    })

  },
  //转桌时选择不同的区域
  changeTableRegion: function(event) {
    let that = this;
    //当前要查询的桌位数
    let changeSeatNumber = that.data.changeSeatNumber;
    let chagenSeatIndex = event.currentTarget.dataset.index;
    let regionList = that.data.regionList;
    for (var i = 0; i < regionList.length; i++) {
      if (i == chagenSeatIndex) {
        regionList[i].select = true
      } else {
        regionList[i].select = false
      }
    }
    let changeRegion = regionList[chagenSeatIndex].id; //选择几人桌

    console.log("chagenSeatIndex is :", chagenSeatIndex);
    that.changeQueryTable(changeSeatNumber, changeRegion);
    that.setData({
      regionList: regionList,
      changeRegion: changeRegion

    })



  },
  //转桌查询区域桌位信息
  changeQueryTable: function(seatNumber, pickerIndex) {
    // var regionId = e.currentTarget.dataset.id;
    // console.log("regionId is:", regionId);
    var that = this;
    var params = {};
    var regionId = 0;
    if (pickerIndex != 0) {
      regionId = that.data.regionList[pickerIndex].id;
      console.log('regionId is :', regionId);
    }
    //查看全部的桌位
    if (seatNumber == 0 && pickerIndex == 0) {

      params = {
        shopId: shopId
      }
    }
    //查看固定区域的所有桌位
    else if (pickerIndex != 0 && seatNumber == 0) {
      params = {
        shopId: shopId,
        regionId: regionId
      }
    }
    //查看固定区域的固定桌位
    else if (pickerIndex != 0 && seatNumber != 0) {
      params = {
        shopId: shopId,
        regionId: regionId,
        seatingNumber: seatNumber
      }
    }
    //查看固定人数的桌位
    else if (pickerIndex == 0 && seatNumber != 0) {
      params = {
        shopId: shopId,
        seatingNumber: seatNumber
      }
    }

    let url = "api/shop/" + shopId + "/diningTable/list"

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
          if (diningTableList.length == 0) {
            common.showTip('暂无数据', 'loading');
          }
          let changeTableList = [];
          for (var i = 0; i < diningTableList.length; i++) {
            if (diningTableList[i].status == 0) {
              changeTableList.push(diningTableList[i]);
            }
          }
          that.setData({
            // regionList: regionList,
            changeTableList: changeTableList
          })
          console.log('changeTableList is :...', changeTableList);
          // return diningTableList;
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
  //转桌时选择桌位
  changeTable: function(event) {
    let that = this;

    let changeTableList = that.data.changeTableList;
    let tableIndex = event.currentTarget.dataset.index;
    console.log("tableIndex is :", tableIndex);
    let toDiningTableId;
    for (var i = 0; i < changeTableList.length; i++) {
      if (i == tableIndex) {
        toDiningTableId = changeTableList[i].id;
        changeTableList[i].select = true;
        console.log("changeTableList[i].select:", changeTableList[i].select);
      } else {
        changeTableList[i].select = false;
      }
    }
    that.setData({
      changeTableList: changeTableList,
      toDiningTableId: toDiningTableId
    })
  },
  //转桌弹窗确认按钮
  onChangeConfirm: function() {
    this.onChangeConnector();
    this.hideChangeModal();
  },
  //转桌弹窗取消按钮
  onChangeCancel: function() {
    this.hideChangeModal();
  },
  //转桌接口
  onChangeConnector: function() {
    let that = this;
    let toDiningTableId = that.data.toDiningTableId;
    let fromDiningTableId = that.data.fromDiningTableId;
    wx.request({
      url: 'https://api.cmdd.tech/api/zhuanZhuo',

      data: {
        fromDiningTableId,
        toDiningTableId
      },
      method: 'PUT',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: function(res) {
        console.log("提交返回：" + res.data);
        if (res.data.code == 200) {
          common.showTip("转桌成功", 'success');
          that.onShow();
        } else {
          common.showTip("转桌失败", 'loading');
        }
      }
    });
  },
  //查看按钮监听
  checkService: function() {
    wx.navigateTo({
      url: '../callService/callService',
    })
  },
  //起菜的方法
  qiCai: function() {
    let that = this;
    let diningTableId = wx.getStorageSync('diningTableId');
    let orderId = wx.getStorageSync('orderId');
    let url = "api/dengJiaoQi"
    var params = {
      diningTableId: diningTableId,
      // orderItemList: orderItemList,
      operateType: 2,
      orderId: orderId
    }
    let method = "PUT";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("这里的结果是：" + res.data); //正确返回结果
        if (res.data.code == 200) {
          common.showTip('起菜成功', 'success');
          // that.navigateToPayOrder();
          that.onShow();
        }
      }).catch((errMsg) => {
        // wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //清桌
  clearDiningTable: function() {
    let that = this;
    let diningTableId = wx.getStorageSync('diningTableId');

    let url = "api/clearDiningTable/diningTable/" + diningTableId
    var params = {
      // diningTableId: diningTableId,
      // orderItemList: orderItemList,
      // operateType: 2,
      // orderId: orderId
    }
    let method = "PUT";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("这里的结果是：" + res.data); //正确返回结果
        if (res.data.code == 200) {
          common.showTip('清台成功', 'success');
          // that.navigateToPayOrder();

        }
        that.onShow();
      }).catch((errMsg) => {
        // wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //循环请求获取呼叫服务
  setIntervalGetService: function() {
    let that = this;
    that.init(that);
    //计时器
    let interval = setInterval(function() {
      //循环执行代码
      that.getService();
    }, 60000)
    that.setData({
      interval: interval
    })
  },
  //清除计时器
  clearTimeInterval: function(that) {
    var interval = that.data.interval;
    clearInterval(interval)
  },
  /**
   * 初始化计时器
   */
  init: function(that) {

    var interval = ""
    that.clearTimeInterval(that)
    that.setData({
      interval: interval,
    })
  },

  //获取呼叫服务
  getService: function() {
    let that = this;
    // let shopId = wx.getStorageSync('shopId');
    let url = "api/shop/" + shopId + "/call-service/list"
    let method = "GET";
    let params = {
      id: shopId
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
          if (serviceList.length > 0) {
            console.log('呼叫服务的个数是:', serviceList.length);
            that.setData({
              serviceNumber: serviceList.length
            })
          }
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
  /**
   * 生命周期函数--监听页面卸载
   * 退出本页面时停止计时器
   */
  onUnload: function() {
    var that = this;
    that.clearTimeInterval(that)
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 在后台运行时停止计时器
   */
  onHide: function() {
    var that = this;
    that.clearTimeInterval(that)
  }

})