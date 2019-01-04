// pages/cart/cart.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    index: 0,
    remark: "",
    //口味数组
    tasetArry: [{
        name: '免辣',
        selectable: true
      },
      {
        name: '微辣',
        selectable: true
      },
      {
        name: '中辣',
        selectable: true
      },
      {
        name: '特辣',
        selectable: true
      },
      {
        name: '少盐',
        selectable: true
      },
      {
        name: '免葱',
        selectable: true
      },
      {
        name: '免姜',
        selectable: true
      },
      {
        name: '免蒜',
        selectable: true
      },
      {
        name: '免糖',
        selectable: true
      },
      {
        name: '免味精',
        selectable: true
      },
      {
        name: '免花椒',
        selectable: true
      },
      {
        name: '免孜然',
        selectable: true
      },
      {
        name: '常温',
        selectable: true
      },
      {
        name: '冰镇',
        selectable: true
      },
    ],

    goodsList: {
      saveHidden: true,
      allSelect: true,
      noSelect: false,
      list: [],
      totalPrice: 0
    },
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
    textAreaBlur: "",
    totalPrice: 0,
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      //以宽度750px设计稿做宽度的自适应
      var scale = (750 / 2) / (w / 2);
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.initEleWidth();
    // this.onShow();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var shopList = [];
    // 获取购物车数据
    var shopCarInfoMem = wx.getStorageSync('cartResult');
    // console.log("==========" + shopCarInfoMem.length);

    this.data.goodsList.list = shopCarInfoMem;
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), shopCarInfoMem);
    // var that = this;
    // var totalPrice = that.totalPrice();
    // console.log("==========" + totalPrice);
  },

  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    var index = e.currentTarget.dataset.index;

    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
      }
    }
  },

  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  //删除商品
  delItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
  },

  selectTap: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log("");
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
    }
  },
  //菜品总数
  totalCount: function() {
    let that = this;
    var list = that.data.goodsList.list;
    console.log(list.length);
    let count = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        count += parseInt(curItem.count);
      }
    }
    console.log('totalCount is: ', count);

    // console.log(total.toFixed(1));
    return count;
  },
  //总价
  totalPrice: function() {
    let that = this;
    var list = that.data.goodsList.list;
    console.log(list.length);
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.unit_price) * curItem.count;
      }
    }
    // console.log(total.toFixed(1));
    return total;
  },
  //全选
  allSelect: function() {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },

  //取消全选
  noSelect: function() {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function(saveHidden, total, totalCount, allSelect, noSelect, list) {

    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total.toFixed(1),
        totalCount: totalCount,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    var shopCarInfo = {};
    wx.setStorage({
      key: "cartResult",
      data: list
    })
  },
  //点击全选
  bindAllSelect: function() {
    var currentAllSelect = this.data.goodsList.allSelect;

    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    // console.log("====当前价格是===" + this.totalPrice())
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), !currentAllSelect, this.noSelect(), list);
  },
  //数量加
  jiaBtnTap: function(e) {
    // console.log("youmeiyou ");
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].count < 99) {
        list[parseInt(index)].count++;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  //数量减
  jianBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].count > 1) {
        list[parseInt(index)].count--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  //编辑
  editTap: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
  },
  //完成
  saveTap: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
  },
  //完成隐藏
  getSaveHide: function() {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  //删除
  deleteSelected: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        list.splice(i--, 1);
      }
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
  },
  //提交订单
  toSubmitOrder: function() {
    var that = this;
    if (this.data.goodsList.noSelect) {
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    wx.showLoading();
    // 重新计算价格，判断库存

    var shopList = wx.getStorageSync('cartResult');
    if (shopList.length == 0) {
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    var orderItemList = new Array();
    for (var i = 0; i < shopList.length; i++) {
      //把选择的放进订单存储中
      if (shopList[i].active) {

        console.log("商品的ID是：" + shopList[i].category_id);
        //订单id是单独传过来的
        var order_id = wx.getStorageSync("orderId");
        var temp = {
          category_id: shopList[i].category_id, // 菜品类别id
          description: shopList[i].description, //菜品描述
          order_id: order_id, //订单Id
          // order_id: "25717603011921208",
          product_id: shopList[i].id, //菜品id
          quantity: shopList[i].count,
          status_id: 1
        }
        orderItemList.push(temp);
      }

    }
    //将选择的商品ID传给服务器生成订单
    // let url = "api/orderItemList"
    // var params = {
    //   // orderResult: JSON.stringify(orderResult),
    //   orderResult: orderResult,
    // }
    // let method = "POST";
    // let header = "{\"Content-Type\": \'application/json\'}";
    // wx.showLoading({
    //   title: '加载中...',
    // }),
    //   network.POST(url, params, method, header).then((res) => {
    //     wx.hideLoading();
    //     console.log("这里的结果是：" + res.data); //正确返回结果
    //     //返回的是订单Id
    //     // orderId = res.data.orderId;
    //     // that.navigateToPayOrder();
    //   }).catch((errMsg) => {
    //     // wx.hideLoading();
    //     // console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });

    var operateRemark = that.data.textAreaBlur;
    wx.request({
      url: 'https://api.cmdd.tech/api/orderItem/List',

      data: {
        orderItemList,
        operateRemark
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'

      },
      success: function(res) {
        console.log("提交返回：" + res.data);
        if (res.data.code == 200) {
          common.showTip("提交成功", 'success');
          // that.setData({
          //   isLotteryCash: res.data.msg.isLotteryCash
          // })
          that.navigateToPayOrder();
        }
      }
    });

  },
  /**
   * 口味弹窗
   */
  showDialogBtn: function(e) {
    let that = this;
    var index = e.currentTarget.dataset.index;
    let list = that.data.goodsList.list;
    let remark = list[index].remark;
    this.setData({
      showModal: true,
      index: index,
      remark: remark
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
    var that = this;
    var tasetArry = that.data.tasetArry;
    for (var i = 0; i < tasetArry.length; i++) {
      that.setData({
        ['tasetArry[' + i + '].selectable']: true
      })
    }
    that.setData({
      remark: ""
    })
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    var that = this;
    that.hideModal();
    var list = that.data.goodsList.list;
    var index = that.data.index;
    list[index].description = that.data.remark;
    // list[index].remark = that.data.remark;
    console.log("当前口味为：" + list[index].description + "当前个数：" + index);
    wx.setStorageSync("cartResult", list);
    //口味选项恢复，输入框清空
    var tasetArry = that.data.tasetArry;
    for (var i = 0; i < tasetArry.length; i++) {
      that.setData({
        ['tasetArry[' + i + '].selectable']: true
      })
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
    that.setData({
      remark: ""
    })
  },

  //获取输入框里的值
  inputChange: function(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  //获取当前数量
  inputNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list[parseInt(index)].count = e.detail.value;
    console.log("当前数量是" + list[index].count);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.totalCount(), this.allSelect(), this.noSelect(), list);
  },
  //添加备注
  onTagSelcteChange: function(event) {
    var that = this;
    var tagIndex = event.currentTarget.dataset.index;
    console.log("tagIndex is :", tagIndex);
    var tasetArry = that.data.tasetArry;
    var name = tasetArry[tagIndex].name;
    var selectable = true;
    var remark = that.data.remark;
    //展示的为当前状态，未更改状态
    if (tasetArry[tagIndex].selectable) {
      //点击增加备注
      selectable = false;

      remark += name;

    } else {
      //点击删除备注
      selectable = true;
      remark = remark.replace(name, "");
    }
    console.log("当前点击是：" + remark);
    that.setData({
      remark: remark,
      ['tasetArry[' + tagIndex + '].selectable']: selectable
    })
  },
  toIndexPage: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

//跳转到订单页面
  navigateToPayOrder: function() {
    //清除购物车库存
    wx.removeStorageSync('cartResult')
    wx.hideLoading();
    let that = this;
    // var isLotteryCash = that.data.isLotteryCash;
    // if (isLotteryCash != 1) {
    //   wx.redirectTo({
    //     url: "../lottery/lottery"
    //   })
    // } else {
      wx.redirectTo({
        url: "../order/order"
      })
    // }
  },

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value);
    this.setData({
      textAreaBlur: e.detail.value,
    })
  },
  bindText: function(e) {
    this.setData({
      textAreaBlur: e.detail.value,
    })
  },
  //等叫功能
  dengJiao: function() {
    var that = this;
    if (this.data.goodsList.noSelect) {
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    wx.showLoading();
    // 重新计算价格，判断库存

    var shopList = wx.getStorageSync('cartResult');
    if (shopList.length == 0) {
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    var orderItemList = new Array();
    for (var i = 0; i < shopList.length; i++) {
      //把选择的放进订单存储中
      if (shopList[i].active) {

        console.log("商品的ID是：" + shopList[i].category_id);
        //订单id是单独传过来的
        var order_id = wx.getStorageSync("orderId");
        var temp = {
          category_id: shopList[i].category_id, // 菜品类别id
          description: shopList[i].description, //菜品描述
          order_id: order_id, //订单Id
          // order_id: "25717603011921208",
          product_id: shopList[i].id, //菜品id
          quantity: shopList[i].count,
          status_id: 0
        }
        orderItemList.push(temp);
      }
    }
    let diningTableId = wx.getStorageSync('diningTableId');
    let orderId = wx.getStorageSync('orderId');
    let url = "api/dengJiaoQi"
    var params = {
      diningTableId: diningTableId,
      orderItemList: orderItemList,
      operateType: 1,
      orderId: orderId
    }
    let method = "PUT";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("这里的结果是：" + res.data); //正确返回结果
       if(res.data.code==200){
         common.showTip('提交成功','success');
         that.navigateToPayOrder();
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

    // var description = that.data.textAreaBlur;
    // wx.request({
    //   url: 'https://api.cmdd.tech/api/orderItemList',

    //   data: {
    //     orderItemList,
    //     description
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'

    //   },
    //   success: function (res) {
    //     console.log("提交返回：" + res.data);
    //     if (res.data.code == 200) {
    //       common.showTip("提交成功", 'success');
    //       that.setData({
    //         isLotteryCash: res.data.msg.isLotteryCash
    //       })
    //       that.navigateToPayOrder();
    //     }
    //   }
    // });

  },
})