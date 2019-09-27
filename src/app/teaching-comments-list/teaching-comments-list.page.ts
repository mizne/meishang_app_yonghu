import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teaching-comments-list',
  templateUrl: './teaching-comments-list.page.html',
  styleUrls: ['./teaching-comments-list.page.scss'],
})
export class TeachingCommentsListPage implements OnInit {

  constructor() { }
  public    arr1 ;
public arr2;
  public img_data = [
    {
      src: "assets/img/set3/1.jpg"
    }, {
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
    }, {
      src: "assets/img/set3/6.jpg"
    }, {
      src: "assets/img/set3/7.jpg"
    },
    {
      src: "assets/img/set3/8.jpg"
    }, {
      src: "assets/img/set3/9.jpg"
    },

    {
      src: "assets/img/set3/10.jpg"
    },

    {
      src: "assets/img/set3/11.jpg"
    }
   
  ]
  ngOnInit() {

    
this.arr1=[]
this.arr2=[]  
    for (let index = 0; index < this.img_data.length; index++) {
      const element = this.img_data[index];
      if (index%2==0){
        this.arr1.push(element)
      }else{
        this.arr2.push(element)
      }
      
    }
  }

}
