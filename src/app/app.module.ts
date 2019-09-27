import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule, ErrorHandler } from '@angular/core';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage'; // 导入换成这个
// import { BackButtonService } from './core/service/back-button.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Tab3Page } from './tab3/tab3.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { GoToAddCartPage } from './go-to-add-cart/go-to-add-cart.page';
import { AddTeachingNewPage } from './add-teaching-new/add-teaching-new.page';
import { MyAddTeachingPage } from './my-add-teaching/my-add-teaching.page';
import { PersonalDataPage } from './personal-data/personal-data.page';
import { EditTeachingPage } from './edit-teaching/edit-teaching.page';
import { MyLessonDetailsPage } from './my-lesson-details/my-lesson-details.page';
import { EditMyTeachingPage } from './edit-my-teaching/edit-my-teaching.page';
import { SettleAccountsCreateOrderPage } from './settle-accounts-create-order/settle-accounts-create-order.page';
import { AddAddressPage } from './add-address/add-address.page';
import { SelectAddressPage } from './select-address/select-address.page';

import { ChangeTelPage } from './change-tel/change-tel.page';
import { Wechat } from '@ionic-native/wechat/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
// import { Alipay } from '@ionic-native/alipay/ngx';

import { ConfirmOrderForCoursePage} from './confirm-order-for-course/confirm-order-for-course.page';
// import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
// import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
// import 'hammerjs';//引入hammerjs
import { MySharePage } from './my-share/my-share.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
@NgModule({
  declarations: [
    AppComponent,
    GoToAddCartPage,
    AddTeachingNewPage,
    MyAddTeachingPage,
    PersonalDataPage,
    ChangeTelPage,
    EditTeachingPage,
    MyLessonDetailsPage,
    SettleAccountsCreateOrderPage,
    EditMyTeachingPage,
    AddAddressPage,
    SelectAddressPage,
    ConfirmOrderForCoursePage,
    MySharePage,
  ],

  entryComponents: [
    GoToAddCartPage,
    AddTeachingNewPage,
    MyAddTeachingPage,
    PersonalDataPage,
    ChangeTelPage,
    EditTeachingPage,
    MyLessonDetailsPage,
    SettleAccountsCreateOrderPage,
    EditMyTeachingPage,
    AddAddressPage,
    SelectAddressPage,
    ConfirmOrderForCoursePage,
    MySharePage,
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(), // 这需要添加 之前providers里的需要删除
    FormsModule
  ],

  providers: [
    // Router,
    // HttpRequestService,
    // HttpProvider,
    // PhotoViewer,
    // PhotoLibrary,
    // Alipay,
    Wechat,
    CallNumber,
    Camera,
    StatusBar,
    SplashScreen,
    AppMinimize,
    InAppBrowser,
    AppUpdate,
    AppVersion,
    Network,
    Deeplinks,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
