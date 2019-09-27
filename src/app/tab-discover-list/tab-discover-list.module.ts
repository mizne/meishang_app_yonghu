import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

// import { IonicPageModule } from "ionic-angular";
import { TabDiscoverListPage } from './tab-discover-list.page';


const routes: Routes = [
  {
    path: '',
    component: TabDiscoverListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // IonicPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabDiscoverListPage]
})
export class TabDiscoverListPageModule {}
