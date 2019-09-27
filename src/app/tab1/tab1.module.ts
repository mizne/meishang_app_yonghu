import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { MatButtonModule } from '@angular/material';
import { Router } from '@angular/router';
// import { Tab3Page } from '../tab3/tab3.page';
// import { AddCartPage } from '../add-cart/add-cart.page';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page],
  entryComponents: []
})
export class Tab1PageModule {}
