// pages/menu/menu.js

var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false, //是否显示遮罩和对话框
    goods: [],
    remark: '',
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
    ]
  },
  //左边栏选择
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    console.log(this.data.toView);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    var shopId = wx.getStorageSync("shopId");
    let url = "api/weiXin/getProductList"
    var params = {
      shopId: shopId
    }
    let method = "GET";

    wx.showLoading({
      title: '加载中...',
    })
    network.POST(url, params, method).then((res) => {
      wx.hideLoading();
      console.log("返回值是：" + res.data.msg);
      if (res.data.code == 200) {
        var goods = res.data.msg;
        that.setData({
          goods: goods
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


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

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

  //获取当前输入框的信息
  inputChange: function(e) {
    var remark = e.detail.value;
    this.setData({
      remark: remark
    })
  },

  //当选择数量时发生变化
  onNumberChange: function(event) {
    var num = event.detail;
    console.log("当前数量是：", num);
  },
  //点击菜品出现详情弹窗
  showDetail: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let parentIndex = e.currentTarget.dataset.parentindex;
    let productList = that.data.goods[parentIndex].productList;
    that.setData({
      index: index,
      productList: productList
    })
    that.showModal();
  },
  //规格更改
  guigeChange:function(e){
    var guige = e.detail.value;
    this.setData({
      guige: guige
    })
  }

})