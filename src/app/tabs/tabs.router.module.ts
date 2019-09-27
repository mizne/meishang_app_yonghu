import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/tabs/tab1',
        pathMatch: 'full'
      },
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../tab1/tab1.module#Tab1PageModule'
          }
        ]
      },
      // k=课程
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../course-home/course-home.module#CourseHomePageModule'
          }
        ]
      },
      // {
      //   path: 'tab2',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../tab2/tab2.module#Tab2PageModule'
      //     }
      //   ]
      // },
    //  商城
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../shop-home/shop-home.module#ShopHomePageModule'
          }
        ]
      },
      // 功能尚未发布提示
      // {
      //   path: 'tab3',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: '../tab3/tab3.module#Tab3PageModule'
      //     }
      //   ]
      // },
      {
        path: 'my-collection',
        children: [
          {
            path: '',
            loadChildren: '../my-collection/my-collection.module#MyCollectionPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  }
  // {
  //   path: '',
  //   redirectTo: '/tabs/tab1',
  //   pathMatch: 'full'
  // },


];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
