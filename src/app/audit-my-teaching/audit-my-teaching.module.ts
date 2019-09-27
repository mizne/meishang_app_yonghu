import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuditMyTeachingPage } from './audit-my-teaching.page';

const routes: Routes = [
  {
    path: '',
    component: AuditMyTeachingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AuditMyTeachingPage]
})
export class AuditMyTeachingPageModule {}
