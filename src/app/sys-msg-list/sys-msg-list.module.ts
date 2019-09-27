import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SysMsgListPage } from './sys-msg-list.page';

const routes: Routes = [
  {
    path: '',
    component: SysMsgListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SysMsgListPage]
})
export class SysMsgListPageModule {}
