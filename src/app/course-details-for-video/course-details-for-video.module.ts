import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CourseDetailsForVideoPage } from './course-details-for-video.page';

const routes: Routes = [
  {
    path: '',
    component: CourseDetailsForVideoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CourseDetailsForVideoPage]
})
export class CourseDetailsForVideoPageModule {}
