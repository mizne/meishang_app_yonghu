import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TestViewCoursePage } from './test-view-course.page';

const routes: Routes = [
  {
    path: '',
    component: TestViewCoursePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TestViewCoursePage]
})
export class TestViewCoursePageModule {}
