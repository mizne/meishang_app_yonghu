import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EvaluationPage } from './evaluation.page';
import { MatButtonModule, MatDividerModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: EvaluationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EvaluationPage]
})
export class EvaluationPageModule {}
