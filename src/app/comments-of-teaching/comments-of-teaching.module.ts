import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommentsOfTeachingPage } from './comments-of-teaching.page';

const routes: Routes = [
  {
    path: '',
    component: CommentsOfTeachingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CommentsOfTeachingPage]
})
export class CommentsOfTeachingPageModule {}
