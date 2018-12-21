// pages/search/search.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false, //是否显示遮罩和对话框
    goods: [],
    parentIndex: 0, //goods[]索引
    index: 0, //productList[]的索引
    remark: '',
    num: 1, //某道菜的数量
    cartArray: [], //购物车数组
    totalCount: 0, //菜品的总数
    totalPrice: 0, //菜品总价
    searchText: '',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    let searchText = options.searchText;
    that.setData({
      searchText: searchText
    })
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
    var that = this;
    let cartArray = wx.getStorageSync('cartResult');
    if (cartArray) {
      that.setData({
        cartArray: cartArray
      })
      that.totalNumber();
    }
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

    //详情内数据清空
    let that = this;
    let tasetArry = that.data.tasetArry;
    for (let i = 0; i < tasetArry.length; i++) {
      tasetArry[i].selectable = true;
    }
    that.setData({
      remark: '',
      num: 1,
      tasetArry: tasetArry
    })
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
    let that = this;
    that.setData({
      num: event.detail
    })

    console.log("当前数量是：", event.detail);
  },
  //点击菜品出现详情弹窗
  showDetail: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let parentIndex = e.currentTarget.dataset.parentindex;
    let productList = that.data.goods[parentIndex].productList;
    that.setData({
      index: index, //productList[]的索引
      parentIndex: parentIndex, //goods[]索引
      productList: productList
    })
    that.showModal();
  },
  //规格更改
  guigeChange: function(e) {
    var guige = e.detail.value;
    this.setData({
      guige: guige
    })
  },
  //提交按钮监听
  submit: function() {
    let that = this;
    //获取当前索引
    let parentIndex = that.data.parentIndex;
    let index = that.data.index;
    //获取菜品数量
    let num = that.data.num;
    console.log('num is :', num);
    //获取当前口味备注
    let remark = that.data.remark;
    let goods = that.data.goods;
    //更改数量
    goods[parentIndex].productList[index].count = num;
    var product = goods[parentIndex].productList[index];
    product.count = num;
    product.remark = remark;
    let id = product.id;
    console.log("product price is :", product.unit_price);
    //购物车数组
    let cartArray = that.data.cartArray;
    let isHas = false; //是否包含
    let cartIndex = 0;
    //遍历查看购物车中是否包含当前菜品
    for (let i = 0; i < cartArray.length; i++) {
      if (id == cartArray[i].id) {
        // cartArray.splice(i, 1, product);
        isHas = true;
        cartIndex = i;
      }
    }
    //包含就替换，否则就添加
    if (isHas) {
      cartArray.splice(cartIndex, 1, product);
    } else {
      //将选中的菜品才加进购物车
      cartArray.push(product);
    }
    console.log("当前购物车的数量:", cartArray.length)
    that.setData({
      goods: goods,
      // productList: productList,
      cartArray: cartArray
    })

    that.totalNumber();
    that.hideModal();
  },
  //撤销菜品
  revocation: function() {
    let that = this;
    //获取当前索引
    let parentIndex = that.data.parentIndex;
    let index = that.data.index;
    let goods = that.data.goods;
    goods[parentIndex].productList[index].count = 0;
    var id = goods[parentIndex].productList[index].id;
    //购物车数组
    let cartArray = that.data.cartArray;
    for (let i = 0; i < cartArray.length; i++) {
      if (id == cartArray[i].id) {
        cartArray.splice(index, i);
      }
    }
    that.setData({
      goods: goods,
      cartArray: cartArray
    })

    that.totalNumber();
    that.hideModal();
  },

  //计算购物车的菜品总数和总价
  totalNumber: function() {
    let that = this;
    let cartArray = that.data.cartArray;
    var totalCount = 0;
    var totalPrice = 0;
    for (let i = 0; i < cartArray.length; i++) {
      console.log("cartArray[i].unit_price is", cartArray[i].unit_price)
      totalCount += parseInt(cartArray[i].count);
      totalPrice += cartArray[i].count * cartArray[i].unit_price;
    }
    console.log('totalCount is :', totalCount)
    console.log('totalPrice is :', totalPrice);
    that.setData({
      totalCount: totalCount,
      totalPrice: totalPrice
    })
  },
  //跳转到购物车
  toCart: function() {
    let that = this;
    let cartArray = that.data.cartArray;
    wx.setStorageSync('cartResult', cartArray);
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  //搜索功能
  onSearch: function(event) {
    console.log('搜索功能', event.detail);
    let that = this;
    that.setData({
      searchText:event.detail
    })
  }
})