import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditTeachingPage } from './edit-teaching.page';

const routes: Routes = [
  {
    path: '',
    component: EditTeachingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // EditTeachingPage
  declarations: []
})
export class EditTeachingPageModule {}
