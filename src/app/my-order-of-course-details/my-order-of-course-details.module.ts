import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyOrderOfCourseDetailsPage } from './my-order-of-course-details.page';

const routes: Routes = [
  {
    path: '',
    component: MyOrderOfCourseDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyOrderOfCourseDetailsPage]
})
export class MyOrderOfCourseDetailsPageModule {}
