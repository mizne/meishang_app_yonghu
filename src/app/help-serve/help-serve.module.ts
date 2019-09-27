import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HelpServePage } from './help-serve.page';
import { MatDividerModule, MatIconModule, MatButtonModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: HelpServePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HelpServePage]
})
export class HelpServePageModule {}
