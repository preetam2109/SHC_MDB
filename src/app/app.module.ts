import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { InputComponent } from './input/input.component';
import { MaterialModule } from './material-module';
//import { AutocompleteComponent } from './component/autocomplete/autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarComponent } from './component/menubar/menubar.component';
import { HomeComponent } from './component/home/home.component';
import { CardComponent } from './component/card/card.component';
// import { SliderComponent } from './component/slider/slider.component';
import { HttpClientModule } from '@angular/common/http';
import {MatTabsModule,MatTabGroup} from '@angular/material/tabs';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './component/auth/login/login.component';
import { LogoutComponent } from './component/auth/logout/logout.component';
import { IndentToCgmscComponent } from './component/indent-to-cgmsc/indent-to-cgmsc.component';
import { ForgetPasswordComponent } from './component/auth/forget-password/forget-password.component';
import { OpeningStockComponent } from './component/opening-stock/opening-stock.component';
import { ToastrModule } from 'ngx-toastr';
import { OpeningStockStatusComponent } from './component/opening-stock-status/opening-stock-status.component';
import { OpeningStockReportComponent } from './component/opening-stock-report/opening-stock-report.component';
import { IndentToWarehouseComponent } from './component/indent-to-warehouse/indent-to-warehouse.component';
import { ReceiptFromWarehouseComponent } from './component/receipt-from-warehouse/receipt-from-warehouse.component';
import { AddNewIndentComponent } from './component/add-new-indent/add-new-indent.component';
import { WarehouseIndentComponent } from './component/warehouse-indent/warehouse-indent.component';
import { OTPComponent } from './component/auth/otp/otp.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReceiptDateEntryComponent } from './component/receipt-date-entry/receipt-date-entry.component';
import { ReceiptBatchesComponent } from './component/receipt-batches/receipt-batches.component';
import { StockReportComponent } from './component/stock-report/stock-report.component';
import { HoldReportComponent } from './component/hold-report/hold-report.component';
import { WarehouseStockComponent } from './component/warehouse-stock/warehouse-stock.component';
import { NearExpiryComponent } from './component/near-expiry/near-expiry.component';
import { ConsumptionComponent } from './component/consumption/consumption.component';
import { WardIssueComponent } from './component/ward-issue/ward-issue.component';
import { IssueReportComponent } from './component/issue-report/issue-report.component';
import {APP_BASE_HREF} from '@angular/common';
import { StockRegisterComponent } from './component/stock-register/stock-register.component';
import { ParentStockReportComponent } from './component/parent-stock-report/parent-stock-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    HomeComponent,
    CardComponent,
    LoginComponent,
    LogoutComponent,
    IndentToCgmscComponent,
    // ForgetPasswordComponent,
    OpeningStockComponent,
    OpeningStockStatusComponent,
    OpeningStockReportComponent,
    IndentToWarehouseComponent,
    ReceiptFromWarehouseComponent,
    AddNewIndentComponent,
    WarehouseIndentComponent,
    OTPComponent,
    ReceiptDateEntryComponent,
    ReceiptBatchesComponent,
    StockReportComponent,
    HoldReportComponent,
    WarehouseStockComponent,
    NearExpiryComponent,
    ConsumptionComponent,
    WardIssueComponent,
    IssueReportComponent,
    StockRegisterComponent,
    ParentStockReportComponent,
  ],
  imports: [
    DatePipe,
    FontAwesomeModule,
    NgSelectModule,
    NgxSpinnerModule.forRoot({ type: 'line-scale-party' }),
    SweetAlert2Module.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SelectDropDownModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    NgApexchartsModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right' // Set the position to top right
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [DatePipe,{provide: APP_BASE_HREF, useValue: '/shcangm'}],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
 }
 