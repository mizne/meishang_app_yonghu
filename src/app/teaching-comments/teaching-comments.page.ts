import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-teaching-comments',
  templateUrl: './teaching-comments.page.html',
  styleUrls: ['./teaching-comments.page.scss'],
})
export class TeachingCommentsPage implements OnInit {

  constructor(public navCtrl: NavController) { }
  public img_data = [{
    src: "assets/img/appointment.png"
  }, {
    src: "assets/img/back.png"
  },
  {
    src: "assets/img/coin.png"
  },

  {
    src: "assets/img/makeup1.png"
  },
    // {
    //     src: "assets/img/bags.jpg"
    // }, {
    //     src: "assets/img/xxxx.jpg"
    // }, {
    //     src: "assets/img/sakura.jpg"
    // }
  ]

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getNode();
  }
  getNode() {
    let parentNode = document.getElementById("container");
    let childNodeArray: any = parentNode.getElementsByClassName("box");
    console.log(childNodeArray)
    console.log(childNodeArray[1])
    let screenWidth = document.documentElement.clientWidth;
    let childWidth = childNodeArray[0].offsetWidth;
    let num = Math.floor(screenWidth / childWidth); //获得一排摆的个数 用Math.floor()转换为整数
    parentNode.style.cssText = "width:" + childWidth * num + "px; margin:0 auto"; //固定container的宽并设置居中
    this.setImagePosition(num, childNodeArray);
  }

  setImagePosition(num, childArray) {
    var imgHeightArray = []; //定义数组用于存放所有图片的高度
    for (var i = 0; i < childArray.length; i++) { //遍历所有图片
      if (i < num) {
        imgHeightArray[i] = childArray[i].offsetHeight; //取得第一排图片的高度
      } else {
        var minHeight = Math.min.apply(null, imgHeightArray); //获取第一排图片中高度最小的图片
        var minIndex = this.getMinHeight(imgHeightArray, minHeight); //函数获得高度最小的图片的位置
        childArray[i].style.position = "absolute"; //绝对定位图片
        childArray[i].style.top = minHeight + "px"; //图片距顶部像素
        childArray[i].style.left = childArray[minIndex].offsetLeft + "px"; //图片距左的像素
        imgHeightArray[minIndex] = imgHeightArray[minIndex] + childArray[i]
          .offsetHeight; //将最低高度的box的高度加上它下方的box高度
      }
    }
  }

  getMinHeight(imgHeightArray, minHeight) {
    for (var i in imgHeightArray) {
      if (imgHeightArray[i] == minHeight) { //循环所有数组的高度 让它等于最小图片的高度 返回i值
        return i;
      }
    }
  }
}
