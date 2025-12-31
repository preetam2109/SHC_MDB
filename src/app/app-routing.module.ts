// import { Component, NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './component/home/home.component';
// import { CardComponent } from './component/card/card.component';
// import { LoginComponent } from './component/auth/login/login.component';
// import { LogoutComponent } from './component/auth/logout/logout.component';
// import { RouteGuardService } from './service/authentication/route-guard.service';
// import { IndentToCgmscComponent } from './component/indent-to-cgmsc/indent-to-cgmsc.component';
// import { ForgetPasswordComponent } from './component/auth/forget-password/forget-password.component';
// import { OpeningStockComponent } from './component/opening-stock/opening-stock.component';
// import { OpeningStockStatusComponent } from './component/opening-stock-status/opening-stock-status.component';
// import { OpeningStockReportComponent } from './component/opening-stock-report/opening-stock-report.component';
// import { IndentToWarehouseComponent } from './component/indent-to-warehouse/indent-to-warehouse.component';
// import { ReceiptFromWarehouseComponent } from './component/receipt-from-warehouse/receipt-from-warehouse.component';
// import { AddNewIndentComponent } from './component/add-new-indent/add-new-indent.component';
// import { WarehouseIndentComponent } from './component/warehouse-indent/warehouse-indent.component';
// import { OTPComponent } from './component/auth/otp/otp.component';
// import { ReceiptDateEntryComponent } from './component/receipt-date-entry/receipt-date-entry.component';
// import { ReceiptBatchesComponent } from './component/receipt-batches/receipt-batches.component';
// import { StockReportComponent } from './component/stock-report/stock-report.component';
// import { HoldReportComponent } from './component/hold-report/hold-report.component';
// import { NearExpiryComponent } from './component/near-expiry/near-expiry.component';
// import { WarehouseStockComponent } from './component/warehouse-stock/warehouse-stock.component';
// import { ConsumptionComponent } from './component/consumption/consumption.component';
// import { WardIssueComponent } from './component/ward-issue/ward-issue.component';
// import { IssueReportComponent } from './component/issue-report/issue-report.component';
// import { StockRegisterComponent } from './component/stock-register/stock-register.component';
// import { ParentStockReportComponent } from './component/parent-stock-report/parent-stock-report.component';
// import { IndentToOtherfacilityComponent } from './component/indent-to-otherfacility/indent-to-otherfacility.component';
// import { OtherfacilityIndentItemsComponent } from './component/otherfacility-indent-items/otherfacility-indent-items.component';
// import { ReceiptFromOtherFacilityComponent } from './component/receipt-from-other-facility/receipt-from-other-facility.component';
// import { ReceiptDateEntryOtherfacilityComponent } from './component/receipt-date-entry-otherfacility/receipt-date-entry-otherfacility.component';
// import { ReceiptBatchesOtherfacilityComponent } from './component/receipt-batches-otherfacility/receipt-batches-otherfacility.component';
// import { FirstTimePasswordChangeComponent } from './component/auth/first-time-password-change/first-time-password-change.component';
// import { HomeDACComponent } from './component/AAM-Admin/home-dac/home-dac.component';

// const routes: Routes = [
//   {path: '', redirectTo: 'login', pathMatch: 'full' },
//   {path:'login',component:LoginComponent},
//   {path:'otp',component:OTPComponent},
//   {path:'logout',component:LogoutComponent,canActivate:[RouteGuardService]},
//   {path:'forgetpassword',component:ForgetPasswordComponent},
//   {path:'home',component:HomeComponent,canActivate:[RouteGuardService]},
//   {path:'homeDAC',component:HomeDACComponent,canActivate:[RouteGuardService]},

//   {path:'card',component:CardComponent,canActivate:[RouteGuardService]},
//   {path:'indent-to-cgmsc',component:IndentToCgmscComponent,canActivate:[RouteGuardService]},
//   {path:'OpStock',component:OpeningStockComponent,canActivate:[RouteGuardService]},
//   {path:'OpStocks',component:OpeningStockStatusComponent,canActivate:[RouteGuardService]},
//   {path:'OpStocksR',component:OpeningStockReportComponent,canActivate:[RouteGuardService]},
//   {path:'indent-to-warehouse',component:IndentToWarehouseComponent,canActivate:[RouteGuardService]},
//   {path:'receipt-from-warehouse',component:ReceiptFromWarehouseComponent,canActivate:[RouteGuardService]},
//   {path:'add-new-indent',component:AddNewIndentComponent,canActivate:[RouteGuardService]},
//   {path:'warehouse-indent',component:WarehouseIndentComponent,canActivate:[RouteGuardService]},
//   {path:'receipt-date-entry',component:ReceiptDateEntryComponent,canActivate:[RouteGuardService]},
//   {path:'receipt-batches',component:ReceiptBatchesComponent,canActivate:[RouteGuardService]},
//   {path:'Stock-Report',component:StockReportComponent,canActivate:[RouteGuardService]},
//   {path:'Hold-Report',component:HoldReportComponent,canActivate:[RouteGuardService]},
//   {path:'Warehouse-Stock',component:WarehouseStockComponent,canActivate:[RouteGuardService]},
//   {path:'Near-Expiry',component:NearExpiryComponent,canActivate:[RouteGuardService]},
//   {path:'consuption',component:ConsumptionComponent,canActivate:[RouteGuardService]},
//   {path:'wardIssue',component:WardIssueComponent,canActivate:[RouteGuardService]},
//   {path:'issuereport',component:IssueReportComponent,canActivate:[RouteGuardService]},
//   {path:'stock-register',component:StockRegisterComponent,canActivate:[RouteGuardService]},
//   {path:'Parentfacility',component:ParentStockReportComponent,canActivate:[RouteGuardService]},
//   {path:'indent-to-otherfacility',component:IndentToOtherfacilityComponent,canActivate:[RouteGuardService]},
//   {path:'other-facility-indentItems',component:OtherfacilityIndentItemsComponent,canActivate:[RouteGuardService]},
//   {path:'receipt-from-other-facility',component:ReceiptFromOtherFacilityComponent,canActivate:[RouteGuardService]},
//   {path:'receipt-date-entry-otherfacility',component:ReceiptDateEntryOtherfacilityComponent,canActivate:[RouteGuardService]},
//   {path:'otherfac-receipt-batches',component:ReceiptBatchesOtherfacilityComponent,canActivate:[RouteGuardService]},
//   {path:'first-time-password-change',component:FirstTimePasswordChangeComponent,canActivate:[RouteGuardService]},



//   { path: '**', redirectTo: 'login' }

// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { CardComponent } from './component/card/card.component';
import { LoginComponent } from './component/auth/login/login.component';
import { LogoutComponent } from './component/auth/logout/logout.component';
import { RouteGuardService } from './service/authentication/route-guard.service';
import { IndentToCgmscComponent } from './component/indent-to-cgmsc/indent-to-cgmsc.component';
import { ForgetPasswordComponent } from './component/auth/forget-password/forget-password.component';
import { OpeningStockComponent } from './component/opening-stock/opening-stock.component';
import { OpeningStockStatusComponent } from './component/opening-stock-status/opening-stock-status.component';
import { OpeningStockReportComponent } from './component/opening-stock-report/opening-stock-report.component';
import { IndentToWarehouseComponent } from './component/indent-to-warehouse/indent-to-warehouse.component';
import { ReceiptFromWarehouseComponent } from './component/receipt-from-warehouse/receipt-from-warehouse.component';
import { AddNewIndentComponent } from './component/add-new-indent/add-new-indent.component';
import { WarehouseIndentComponent } from './component/warehouse-indent/warehouse-indent.component';
import { OTPComponent } from './component/auth/otp/otp.component';
import { ReceiptDateEntryComponent } from './component/receipt-date-entry/receipt-date-entry.component';
import { ReceiptBatchesComponent } from './component/receipt-batches/receipt-batches.component';
import { StockReportComponent } from './component/stock-report/stock-report.component';
import { HoldReportComponent } from './component/hold-report/hold-report.component';
import { NearExpiryComponent } from './component/near-expiry/near-expiry.component';
import { WarehouseStockComponent } from './component/warehouse-stock/warehouse-stock.component';
import { ConsumptionComponent } from './component/consumption/consumption.component';
import { WardIssueComponent } from './component/ward-issue/ward-issue.component';
import { IssueReportComponent } from './component/issue-report/issue-report.component';
import { StockRegisterComponent } from './component/stock-register/stock-register.component';
import { ParentStockReportComponent } from './component/parent-stock-report/parent-stock-report.component';
import { IndentToOtherfacilityComponent } from './component/indent-to-otherfacility/indent-to-otherfacility.component';
import { OtherfacilityIndentItemsComponent } from './component/otherfacility-indent-items/otherfacility-indent-items.component';
import { ReceiptFromOtherFacilityComponent } from './component/receipt-from-other-facility/receipt-from-other-facility.component';
import { ReceiptDateEntryOtherfacilityComponent } from './component/receipt-date-entry-otherfacility/receipt-date-entry-otherfacility.component';
import { ReceiptBatchesOtherfacilityComponent } from './component/receipt-batches-otherfacility/receipt-batches-otherfacility.component';
import { FirstTimePasswordChangeComponent } from './component/auth/first-time-password-change/first-time-password-change.component';
import { HomeDACComponent } from './component/AAM-Admin/home-dac/home-dac.component';
import { KPIdistWiseComponent } from './component/AAM-Admin/kpidist-wise/kpidist-wise.component';
import { FacilityWiseIssueComponent } from './component/AAM-Admin/facility-wise-issue/facility-wise-issue.component';
import { FacilityItemWiseStockComponent } from './component/AAM-Admin/facility-item-wise-stock/facility-item-wise-stock.component';
import { ShcStockOutComponent } from './component/AAM-Admin/shc-stock-out/shc-stock-out.component';
import { TutorialsManualsComponent } from './component/auth/tutorials-manuals/tutorials-manuals.component';
import { FacwiseAAMPerformanceComponent } from './component/AAM-Admin/facwise-aamperformance/facwise-aamperformance.component';
import { DistfacilityInformationComponent } from './component/AAM-Admin/distfacility-information/distfacility-information.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OTPComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [RouteGuardService] },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  { path: 'tutorials-manuals', component: TutorialsManualsComponent },
  { path: 'home', component: HomeComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'homeDAC', component: HomeDACComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant'] }},
  { path: 'card', component: CardComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'indent-to-cgmsc', component: IndentToCgmscComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'OpStock', component: OpeningStockComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'OpStocks', component: OpeningStockStatusComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'OpStocksR', component: OpeningStockReportComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'indent-to-warehouse', component: IndentToWarehouseComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'receipt-from-warehouse', component: ReceiptFromWarehouseComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'add-new-indent', component: AddNewIndentComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'warehouse-indent', component: WarehouseIndentComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'receipt-date-entry', component: ReceiptDateEntryComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'receipt-batches', component: ReceiptBatchesComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'Stock-Report', component: StockReportComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'Hold-Report', component: HoldReportComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'Warehouse-Stock', component: WarehouseStockComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'Near-Expiry', component: NearExpiryComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'consuption', component: ConsumptionComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'wardIssue', component: WardIssueComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'issuereport', component: IssueReportComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'stock-register', component: StockRegisterComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'Parentfacility', component: ParentStockReportComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'indent-to-otherfacility', component: IndentToOtherfacilityComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'other-facility-indentItems', component: OtherfacilityIndentItemsComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'receipt-from-other-facility', component: ReceiptFromOtherFacilityComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'receipt-date-entry-otherfacility', component: ReceiptDateEntryOtherfacilityComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM'] }},
  { path: 'otherfac-receipt-batches', component: ReceiptBatchesOtherfacilityComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM']}},
  { path: 'first-time-password-change', component: FirstTimePasswordChangeComponent, canActivate: [RouteGuardService] },
  { path: 'KPIdistWise', component: KPIdistWiseComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant']} },
  { path: 'distfacInfo', component: DistfacilityInformationComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant']} },
  { path: 'FacWiseAAM', component: FacwiseAAMPerformanceComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant']} },
  { path: 'AAM-Admin-FacilityWiseIssue', component: FacilityWiseIssueComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant']}},
  { path: 'AAM-Admin-FacilityWiseItemStock', component: FacilityItemWiseStockComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant']}},
  { path: 'shc-Stock-out', component: ShcStockOutComponent, canActivate: [RouteGuardService], data: { allowedRoles: ['AAM Consultant']}},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

