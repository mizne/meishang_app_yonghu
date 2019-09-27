import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-course-classification',
  templateUrl: './course-classification.page.html',
  styleUrls: ['./course-classification.page.scss'],
})
export class CourseClassificationPage implements OnInit {
  public CategoriesFirstList;
  constructor(public nav: NavController, public router: Router, private loc: Location,
              private http: HttpClient, public storage: Storage) { }

  ngOnInit() {
    this.getCategoriesFirst();
  }

  // 返回上一页
  canGoBack() {
    this.loc.back();
  }

  // 查询一级分类
  getCategoriesFirst() {
    Promise.all([
      this.storage.get('TenantId'),
      this.storage.get('UserId'),
      this.storage.get('ExhibitionId')
    ]).then(([tenantId, userId, exhibitionId]) => {
      const queryCategoriesFirst = {
        UserId: userId,
        TenantId: tenantId,
        params: {
          condition: {
            ExhibitionId: exhibitionId
          }
        }
      };
      this.http.post(AppComponent.apiUrl + 'v2/data/queryList/CategoryFirst', queryCategoriesFirst)
        .subscribe(res => {
          this.CategoriesFirstList = (res as any).result;
        });
    });
  }

  goToDetail(id) {
    this.router.navigateByUrl('/every-first-category/' + id + '&0');
  }
}
