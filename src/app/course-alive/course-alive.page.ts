import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-course-alive',
  templateUrl: './course-alive.page.html',
  styleUrls: ['./course-alive.page.scss'],
})
export class CourseAlivePage implements OnInit {

  constructor(public nav: NavController, private loc: Location) { }

  ngOnInit() {
  }
  // 返回上一页
  canGoBack() {
    this.loc.back();
  }
}
