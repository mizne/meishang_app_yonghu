import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HelpAndCustomerServicePage } from './help-and-customer-service.page';

const routes: Routes = [
  {
    path: '',
    component: HelpAndCustomerServicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HelpAndCustomerServicePage]
})
export class HelpAndCustomerServicePageModule {}
