import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-test4",
  templateUrl: "./test4.page.html",
  styleUrls: ["./test4.page.scss"]
})
export class Test4Page implements OnInit {
  public img_data = [
    // {
    //   src: "http://crmtestali.xiaovbao.cn/assets/images/zhanhui.png"
    // },
    // {
    //   src: "http://crmtestali.xiaovbao.cn/assets/images/weishangcheng.png"
    // },
    {
      src: "assets/img/set3/1.jpg"
    },
    {
      src: "assets/img/set3/2.jpg"
    },
    {
      src: "assets/img/set3/3.jpg"
    },
    {
      src: "assets/img/set3/4.jpg"
    },
    {
      src: "assets/img/set3/5.jpg"
    },
    {
      src: "assets/img/set3/6.jpg"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/weishangcheng.png"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/yingxiaoyun.png"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/huiyi.png"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/weishangcheng.png"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/yingxiaoyun.png"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/huiyi.png"
    },
    {
      src: "http://crmtestali.xiaovbao.cn/assets/images/weishangcheng.png"
    }
  ];
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log("-------ngOnInit------");
    this.getNode();
  }
  ngAfterViewInit() {
    console.log("-------ngAfterViewInit------");
  }
  ionViewWillEnter() {
    console.log("-------ionViewWillEnter------");
    this.getNode();
  }
  getNode() {
    console.log("-------getNode------");
    let parentNode = document.getElementById("container");
    let childNodeArray: any = parentNode.getElementsByClassName("box");
    let screenWidth = document.documentElement.clientWidth;
    let childWidth = childNodeArray[0].offsetWidth;
    let num = Math.floor(screenWidth / childWidth); //获得一排摆的个数 用Math.floor()转换为整数
    parentNode.style.cssText =
      "width:" + childWidth * num + "px; margin:0 auto"; //固定container的宽并设置居中
    this.setImagePosition(num, childNodeArray);
  }

  setImagePosition(num, childArray) {
    console.log("-------setImagePosition------");
    var imgHeightArray = []; //定义数组用于存放所有图片的高度
    for (var i = 0; i < childArray.length; i++) {
      //遍历所有图片
      if (i < num) {
        imgHeightArray[i] = childArray[i].offsetHeight; //取得第一排图片的高度
      } else {
        var minHeight = Math.min.apply(null, imgHeightArray); //获取第一排图片中高度最小的图片
        var minIndex = this.getMinHeight(imgHeightArray, minHeight); //函数获得高度最小的图片的位置
        childArray[i].style.position = "absolute"; //绝对定位图片
        childArray[i].style.top = minHeight + "px"; //图片距顶部像素
        childArray[i].style.left = childArray[minIndex].offsetLeft + "px"; //图片距左的像素
        imgHeightArray[minIndex] =
          imgHeightArray[minIndex] + childArray[i].offsetHeight; //将最低高度的box的高度加上它下方的box高度
      }
    }
  }

  getMinHeight(imgHeightArray, minHeight) {
    console.log("-------getMinHeight------");
    for (var i in imgHeightArray) {
      if (imgHeightArray[i] == minHeight) {
        //循环所有数组的高度 让它等于最小图片的高度 返回i值
        return i;
      }
    }
  }
  //这里是借助ionic的上拉加载代替网页的滚动监听实现加载更多
  doInfinite(infiniteScroll) {
    console.log("-------doInfinite------");
    // 添加新数据
    let parentNode = document.getElementById("container");

    let imgList = this.img_data;

    for (var i = 0; i < imgList.length; i++) {
      let divNode = document.createElement("div"); //创建div节点
      divNode.className = "box"; //为节点添加box类名
      parentNode.appendChild(divNode); //添加根元素
      let subDivNode = document.createElement("div"); //创建节点
      subDivNode.className = "box_img"; //为节点添加类名
      divNode.appendChild(subDivNode); //添加根元素
      var img = document.createElement("img"); //创建节点
      img.src = imgList[i].src; //图片加载路径
      subDivNode.appendChild(img); //添加根元素
    }

    this.getNode();
    // setTimeout(() => { infiniteScroll.complete() }, 1000);
  }
}
