import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TeachingCommentsListPage } from './teaching-comments-list.page';

const routes: Routes = [
  {
    path: '',
    component: TeachingCommentsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TeachingCommentsListPage]
})
export class TeachingCommentsListPageModule {}
