import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { AdBannerResolverService } from './route-resolver/ad-banner-resolver.service';
const routes: Routes = [
  // advertisement
  {
    path: '',
    loadChildren: './advertisement/advertisement.module#AdvertisementPageModule',
    resolve: {
      adBanner: AdBannerResolverService
    }
  },
  // { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // {
  //   path: 'tabs/tab1',
  //   loadChildren: './tab1/tab1.module#Tab1PageModule'
  // },
  // {
  //   path: 'tabs/tab2',
  //   loadChildren: './course-home/course-home.module#CourseHomePageModule'
  // },
  // {
  //   path: 'tabs/tab3',
  //   loadChildren: './shop-home/shop-home.module#ShopHomePageModule'
  // },
  // {
  //   path: 'tabs/tab4',
  //   loadChildren: './my-collection/my-collection.module#MyCollectionPageModule'
  // },
  {
    path: 'categories',
    loadChildren: './categories/categories.module#CategoriesPageModule'
  },
  {
    path: 'sys-msg-list',
    loadChildren: './sys-msg-list/sys-msg-list.module#SysMsgListPageModule'
  },
  {
    path: 'search/:id',
    loadChildren: './search/search.module#SearchPageModule'
  },
  {
    path: 'cart-list',
    loadChildren: './cart-list/cart-list.module#CartListPageModule'
  },
  {
    path: 'like-list',
    loadChildren: './like-list/like-list.module#LikeListPageModule'
  },
  {
    path: 'comment-list',
    loadChildren: './comment-list/comment-list.module#CommentListPageModule'
  },
  {
    path: 'account-msg',
    loadChildren: './account-msg/account-msg.module#AccountMsgPageModule'
  },
  {
    path: 'appointment-msg',
    loadChildren:
      './appointment-msg/appointment-msg.module#AppointmentMsgPageModule'
  },
  {
    path: 'points-list',
    loadChildren: './points-list/points-list.module#PointsListPageModule'
  },
  {
    path: 'leave-mmessages',
    loadChildren:
      './leave-mmessages/leave-mmessages.module#LeaveMmessagesPageModule'
  },
  {
    path: 'login-by-phone',
    loadChildren:
      './login-by-phone/login-by-phone.module#LoginByPhonePageModule'
  },
  {
    path: 'login-by-password',
    loadChildren:
      './login-by-password/login-by-password.module#LoginByPasswordPageModule'
  },
  {
    path: 'to-sign',
    loadChildren: './to-sign/to-sign.module#ToSignPageModule'
  },
  {
    path: 'sys-inform',
    loadChildren: './sys-inform/sys-inform.module#SysInformPageModule'
  },
  {
    path: 'my-followers',
    loadChildren: './my-followers/my-followers.module#MyFollowersPageModule'
  },
  {
    path: 'my-following',
    loadChildren: './my-following/my-following.module#MyFollowingPageModule'
  },
  {
    path: 'course-home',
    loadChildren: './course-home/course-home.module#CourseHomePageModule'
  },
  {
    path: 'course-details/:id',
    loadChildren:
      './course-details/course-details.module#CourseDetailsPageModule'
  },
  {
    path: 'course-alive',
    loadChildren: './course-alive/course-alive.module#CourseAlivePageModule'
  },
  {
    path: 'shop-home',
    loadChildren: './shop-home/shop-home.module#ShopHomePageModule'
  },
  {
    path: 'goods-list',
    loadChildren: './goods-list/goods-list.module#GoodsListPageModule'
  },
  {
    path: 'goods-details/:id',
    loadChildren: './goods-details/goods-details.module#GoodsDetailsPageModule'
  },
  { path: 'my-collection', loadChildren: './my-collection/my-collection.module#MyCollectionPageModule' },
  {
    path: 'my-order',
    loadChildren: './my-order/my-order.module#MyOrderPageModule'
  },
  {
    path: 'order-detail/:id',
    loadChildren: './order-detail/order-detail.module#OrderDetailPageModule'
  },
  {
    path: 'personal-data',
    loadChildren: './personal-data/personal-data.module#PersonalDataPageModule'
  },
  {
    path: 'apply-sales/:id',
    loadChildren: './apply-sales/apply-sales.module#ApplySalesPageModule'
  },
  {
    path: 'businessman',
    loadChildren: './businessman/businessman.module#BusinessmanPageModule'
  },
  {
    path: 'apply-success',
    loadChildren: './apply-success/apply-success.module#ApplySuccessPageModule'
  },
  {
    path: 'address',
    loadChildren: './address/address.module#AddressPageModule'
  },
  {
    path: 'active-foot',
    loadChildren: './active-foot/active-foot.module#ActiveFootPageModule'
  },
  {
    path: 'my-wallet',
    loadChildren: './my-wallet/my-wallet.module#MyWalletPageModule'
  },
  {
    path: 'help-serve/:id',
    loadChildren: './help-serve/help-serve.module#HelpServePageModule'
  },
  {
    path: 'change-tel',
    loadChildren: './change-tel/change-tel.module#ChangeTelPageModule'
  },
  {
    path: 'verification',
    loadChildren: './verification/verification.module#VerificationPageModule'
  },
  {
    path: 'evaluation/:id',
    loadChildren: './evaluation/evaluation.module#EvaluationPageModule'
  },
  {
    path: 'account-safe',
    loadChildren: './account-safe/account-safe.module#AccountSafePageModule'
  },
  {
    path: 'order-courier',
    loadChildren: './order-courier/order-courier.module#OrderCourierPageModule'
  },
  {
    path: 'to-bank-account',
    loadChildren:
      './to-bank-account/to-bank-account.module#ToBankAccountPageModule'
  },
  {
    path: 'lessons-details/:id',
    loadChildren:
      './lessons-details/lessons-details.module#LessonsDetailsPageModule'
  },
  { path: 'tab-discover-list', loadChildren: './tab-discover-list/tab-discover-list.module#TabDiscoverListPageModule' },
  { path: 'set-password/:type', loadChildren: './set-password/set-password.module#SetPasswordPageModule' },
  { path: 'every-cateory/:id', loadChildren: './every-cateory/every-cateory.module#EveryCateoryPageModule' },
  { path: 'go-to-add-cart', loadChildren: './go-to-add-cart/go-to-add-cart.module#GoToAddCartPageModule' },
  { path: 'test2', loadChildren: './test2/test2.module#Test2PageModule' },
  { path: 'user-rules', loadChildren: './user-rules/user-rules.module#UserRulesPageModule' },
  { path: 'add-teaching-new', loadChildren: './add-teaching-new/add-teaching-new.module#AddTeachingNewPageModule' },
  { path: 'my-add-teaching', loadChildren: './my-add-teaching/my-add-teaching.module#MyAddTeachingPageModule' },
  { path: 'edit-teaching/:id', loadChildren: './edit-teaching/edit-teaching.module#EditTeachingPageModule' },
  { path: 'teaching-comments', loadChildren: './teaching-comments/teaching-comments.module#TeachingCommentsPageModule' },
  { path: 'teaching-comments-list', loadChildren: './teaching-comments-list/teaching-comments-list.module#TeachingCommentsListPageModule' },
  { path: 'to-set-personal-info', loadChildren: './to-set-personal-info/to-set-personal-info.module#ToSetPersonalInfoPageModule' },
  { path: 'water-test', loadChildren: './water-test/water-test.module#WaterTestPageModule' },
  { path: 'every-first-category/:id', loadChildren: './every-first-category/every-first-category.module#EveryFirstCategoryPageModule' },
  { path: 'course-video/:id', loadChildren: './course-video/course-video.module#CourseVideoPageModule' },
  { path: 'store-home/:id', loadChildren: './store-home/store-home.module#StoreHomePageModule' },
  { path: 'my-lesson-details', loadChildren: './my-lesson-details/my-lesson-details.module#MyLessonDetailsPageModule' },
  { path: 'comments-of-teaching/:id', loadChildren: './comments-of-teaching/comments-of-teaching.module#CommentsOfTeachingPageModule' },
  { path: 'settle-accounts-create-order',
  loadChildren: './settle-accounts-create-order/settle-accounts-create-order.module#SettleAccountsCreateOrderPageModule' },
  { path: 'my-logistics', loadChildren: './my-logistics/my-logistics.module#MyLogisticsPageModule' },
  { path: 'order-pay-success', loadChildren: './order-pay-success/order-pay-success.module#OrderPaySuccessPageModule' },
  { path: 'help-and-customer-service',
  loadChildren: './help-and-customer-service/help-and-customer-service.module#HelpAndCustomerServicePageModule' },
  { path: 'wechatshare', loadChildren: './wechatshare/wechatshare.module#WechatsharePageModule' },
  { path: 'course-details-for-video/:id',
  loadChildren: './course-details-for-video/course-details-for-video.module#CourseDetailsForVideoPageModule' },
  { path: 'edit-my-teaching', loadChildren: './edit-my-teaching/edit-my-teaching.module#EditMyTeachingPageModule' },
  { path: 'add-address', loadChildren: './add-address/add-address.module#AddAddressPageModule' },
  {
    path: 'tabs/tab1',
    loadChildren: './tab1/tab1.module#Tab1PageModule'
  },
  {
    path: 'tabs/tab2',
    loadChildren: './course-home/course-home.module#CourseHomePageModule'
  },
  {
    path: 'tabs/tab3',
    loadChildren: './shop-home/shop-home.module#ShopHomePageModule'
  },
  {
    path: 'tabs/tab4',
    loadChildren: './my-collection/my-collection.module#MyCollectionPageModule'
  },
  {
    path: 'categories',
    loadChildren: './categories/categories.module#CategoriesPageModule'
  },
  {
    path: 'sys-msg-list',
    loadChildren: './sys-msg-list/sys-msg-list.module#SysMsgListPageModule'
  },
  {
    path: 'search/:id',
    loadChildren: './search/search.module#SearchPageModule'
  },
  {
    path: 'cart-list',
    loadChildren: './cart-list/cart-list.module#CartListPageModule'
  },
  {
    path: 'like-list',
    loadChildren: './like-list/like-list.module#LikeListPageModule'
  },
  {
    path: 'comment-list',
    loadChildren: './comment-list/comment-list.module#CommentListPageModule'
  },
  {
    path: 'account-msg',
    loadChildren: './account-msg/account-msg.module#AccountMsgPageModule'
  },
  {
    path: 'appointment-msg',
    loadChildren:
      './appointment-msg/appointment-msg.module#AppointmentMsgPageModule'
  },
  {
    path: 'points-list',
    loadChildren: './points-list/points-list.module#PointsListPageModule'
  },
  {
    path: 'leave-mmessages',
    loadChildren:
      './leave-mmessages/leave-mmessages.module#LeaveMmessagesPageModule'
  },
  {
    path: 'login-by-phone',
    loadChildren:
      './login-by-phone/login-by-phone.module#LoginByPhonePageModule'
  },
  {
    path: 'login-by-password',
    loadChildren:
      './login-by-password/login-by-password.module#LoginByPasswordPageModule'
  },
  {
    path: 'to-sign',
    loadChildren: './to-sign/to-sign.module#ToSignPageModule'
  },
  {
    path: 'sys-inform',
    loadChildren: './sys-inform/sys-inform.module#SysInformPageModule'
  },
  {
    path: 'my-followers/:id',
    loadChildren: './my-followers/my-followers.module#MyFollowersPageModule'
  },
  {
    path: 'my-following/:id',
    loadChildren: './my-following/my-following.module#MyFollowingPageModule'
  },
  {
    path: 'course-home',
    loadChildren: './course-home/course-home.module#CourseHomePageModule'
  },
  {
    path: 'course-details/:id',
    loadChildren:
      './course-details/course-details.module#CourseDetailsPageModule'
  },
  {
    path: 'course-alive',
    loadChildren: './course-alive/course-alive.module#CourseAlivePageModule'
  },
  {
    path: 'shop-home',
    loadChildren: './shop-home/shop-home.module#ShopHomePageModule'
  },
  {
    path: 'goods-list',
    loadChildren: './goods-list/goods-list.module#GoodsListPageModule'
  },
  {
    path: 'goods-details/:id',
    loadChildren: './goods-details/goods-details.module#GoodsDetailsPageModule'
  },
  { path: 'my-collection', loadChildren: './my-collection/my-collection.module#MyCollectionPageModule' },
  {
    path: 'my-order',
    loadChildren: './my-order/my-order.module#MyOrderPageModule'
  },
  {
    path: 'order-detail/:id',
    loadChildren: './order-detail/order-detail.module#OrderDetailPageModule'
  },
  {
    path: 'personal-data',
    loadChildren: './personal-data/personal-data.module#PersonalDataPageModule'
  },
  {
    path: 'apply-sales/:id',
    loadChildren: './apply-sales/apply-sales.module#ApplySalesPageModule'
  },
  {
    path: 'businessman',
    loadChildren: './businessman/businessman.module#BusinessmanPageModule'
  },
  {
    path: 'apply-success',
    loadChildren: './apply-success/apply-success.module#ApplySuccessPageModule'
  },
  {
    path: 'address',
    loadChildren: './address/address.module#AddressPageModule'
  },
  {
    path: 'active-foot',
    loadChildren: './active-foot/active-foot.module#ActiveFootPageModule'
  },
  {
    path: 'my-wallet',
    loadChildren: './my-wallet/my-wallet.module#MyWalletPageModule'
  },
  {
    path: 'help-serve/:id',
    loadChildren: './help-serve/help-serve.module#HelpServePageModule'
  },
  {
    path: 'change-tel',
    loadChildren: './change-tel/change-tel.module#ChangeTelPageModule'
  },
  {
    path: 'verification',
    loadChildren: './verification/verification.module#VerificationPageModule'
  },
  {
    path: 'evaluation/:id',
    loadChildren: './evaluation/evaluation.module#EvaluationPageModule'
  },
  {
    path: 'account-safe',
    loadChildren: './account-safe/account-safe.module#AccountSafePageModule'
  },
  {
    path: 'order-courier',
    loadChildren: './order-courier/order-courier.module#OrderCourierPageModule'
  },
  {
    path: 'to-bank-account',
    loadChildren:
      './to-bank-account/to-bank-account.module#ToBankAccountPageModule'
  },
  {
    path: 'lessons-details/:id',
    loadChildren:
      './lessons-details/lessons-details.module#LessonsDetailsPageModule'
  },
  { path: 'tab-discover-list', loadChildren: './tab-discover-list/tab-discover-list.module#TabDiscoverListPageModule' },
  { path: 'set-password', loadChildren: './set-password/set-password.module#SetPasswordPageModule' },
  { path: 'every-cateory/:id', loadChildren: './every-cateory/every-cateory.module#EveryCateoryPageModule' },
  { path: 'go-to-add-cart', loadChildren: './go-to-add-cart/go-to-add-cart.module#GoToAddCartPageModule' },
  { path: 'test2', loadChildren: './test2/test2.module#Test2PageModule' },
  { path: 'user-rules', loadChildren: './user-rules/user-rules.module#UserRulesPageModule' },
  { path: 'add-teaching-new', loadChildren: './add-teaching-new/add-teaching-new.module#AddTeachingNewPageModule' },
  { path: 'my-add-teaching', loadChildren: './my-add-teaching/my-add-teaching.module#MyAddTeachingPageModule' },
  { path: 'edit-teaching/:id', loadChildren: './edit-teaching/edit-teaching.module#EditTeachingPageModule' },
  { path: 'teaching-comments', loadChildren: './teaching-comments/teaching-comments.module#TeachingCommentsPageModule' },
  { path: 'teaching-comments-list', loadChildren: './teaching-comments-list/teaching-comments-list.module#TeachingCommentsListPageModule' },
  { path: 'to-set-personal-info', loadChildren: './to-set-personal-info/to-set-personal-info.module#ToSetPersonalInfoPageModule' },
  { path: 'water-test', loadChildren: './water-test/water-test.module#WaterTestPageModule' },
  { path: 'every-first-category/:id', loadChildren: './every-first-category/every-first-category.module#EveryFirstCategoryPageModule' },
  { path: 'course-video/:id', loadChildren: './course-video/course-video.module#CourseVideoPageModule' },
  { path: 'store-home/:id', loadChildren: './store-home/store-home.module#StoreHomePageModule' },
  { path: 'my-lesson-details', loadChildren: './my-lesson-details/my-lesson-details.module#MyLessonDetailsPageModule' },
  { path: 'comments-of-teaching/:id', loadChildren: './comments-of-teaching/comments-of-teaching.module#CommentsOfTeachingPageModule' },
  { path: 'settle-accounts-create-order',
  loadChildren: './settle-accounts-create-order/settle-accounts-create-order.module#SettleAccountsCreateOrderPageModule' },
  { path: 'my-logistics', loadChildren: './my-logistics/my-logistics.module#MyLogisticsPageModule' },
  { path: 'order-pay-success', loadChildren: './order-pay-success/order-pay-success.module#OrderPaySuccessPageModule' },
  { path: 'help-and-customer-service',
  loadChildren: './help-and-customer-service/help-and-customer-service.module#HelpAndCustomerServicePageModule' },
  { path: 'wechatshare', loadChildren: './wechatshare/wechatshare.module#WechatsharePageModule' },
  { path: 'course-details-for-video/:id',
  loadChildren: './course-details-for-video/course-details-for-video.module#CourseDetailsForVideoPageModule' },
  { path: 'edit-my-teaching', loadChildren: './edit-my-teaching/edit-my-teaching.module#EditMyTeachingPageModule' },
  { path: 'appointment-msg-detail/:id',
  loadChildren: './appointment-msg-detail/appointment-msg-detail.module#AppointmentMsgDetailPageModule' },
  { path: 'select-address', loadChildren: './select-address/select-address.module#SelectAddressPageModule' },
  { path: 'confirm-order-for-course',
  loadChildren: './confirm-order-for-course/confirm-order-for-course.module#ConfirmOrderForCoursePageModule' },
  { path: 'my-order-of-course-details/:id',
  loadChildren: './my-order-of-course-details/my-order-of-course-details.module#MyOrderOfCourseDetailsPageModule' },
  { path: 'logistics-info/:id', loadChildren: './logistics-info/logistics-info.module#LogisticsInfoPageModule' },
  { path: 'list-test1', loadChildren: './list-test1/list-test1.module#ListTest1PageModule' },
  { path: 'list-test2', loadChildren: './list-test2/list-test2.module#ListTest2PageModule' },
  { path: 'list-test3', loadChildren: './list-test3/list-test3.module#ListTest3PageModule' },
  { path: 'test4', loadChildren: './test4/test4.module#Test4PageModule' },
  { path: 'course-classification', loadChildren: './course-classification/course-classification.module#CourseClassificationPageModule' },
  { path: 'share-ways', loadChildren: './share-ways/share-ways.module#ShareWaysPageModule' },
  { path: 'others-page/:id', loadChildren: './others-page/others-page.module#OthersPagePageModule' },
  { path: 'test-view-course/:id', loadChildren: './test-view-course/test-view-course.module#TestViewCoursePageModule' },
  { path: 'audit-my-teaching', loadChildren: './audit-my-teaching/audit-my-teaching.module#AuditMyTeachingPageModule' },
  { path: 'my-comments/:id', loadChildren: './my-comments/my-comments.module#MyCommentsPageModule' },
  { path: 'my-course-list/:id', loadChildren: './my-course-list/my-course-list.module#MyCourseListPageModule' },
  { path: 'my-share', loadChildren: './my-share/my-share.module#MySharePageModule' },
  { path: 'my-black-list', loadChildren: './my-black-list/my-black-list.module#MyBlackListPageModule' },
  { path: 'waterfall', loadChildren: './waterfall/waterfall.module#WaterfallPageModule' },
  { path: 'comments-of-shop/:id', loadChildren: './comments-of-shop/comments-of-shop.module#CommentsOfShopPageModule' },
  { path: 'perfecting-user-infor', loadChildren: './perfecting-user-infor/perfecting-user-infor.module#PerfectingUserInforPageModule' }





];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
