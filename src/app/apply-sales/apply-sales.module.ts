import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ApplySalesPage } from './apply-sales.page';
import { MatButtonModule, MatExpansionModule, MatFormFieldModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ApplySalesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ApplySalesPage]
})
export class ApplySalesPageModule {}
