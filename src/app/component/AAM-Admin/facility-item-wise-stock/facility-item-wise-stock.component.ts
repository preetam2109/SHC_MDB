import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockReport } from 'src/app/Model/StockReport';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { FacilityIssueDateWise } from 'src/app/Model/FacilityIssueDateWise';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OpningClosingItem } from 'src/app/Model/OpningClosingItem';
import { AAMAdminFacilityWiseIssue } from 'src/app/Model/AAMAdminFacilityWiseIssue';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { AAMAdminFacilityItemWiseStock } from 'src/app/Model/AAMAdminFacilityItemWiseStock';
@Component({
  selector: 'app-facility-item-wise-stock',
  standalone: true,
   imports: [ MatButtonModule,ReactiveFormsModule,MatDatepickerModule,MatFormFieldModule,MatInputModule,MatMenuModule, MatTableExporterModule,MatPaginatorModule, MatTableModule],

  templateUrl: './facility-item-wise-stock.component.html',
  styleUrl: './facility-item-wise-stock.component.css'
})
export class FacilityItemWiseStockComponent {

  dataSource!: MatTableDataSource<AAMAdminFacilityItemWiseStock>;
  facilityItemWiseStock: AAMAdminFacilityItemWiseStock[] = [];
  selectedTabIndex: number = 0;
  category=0;
  facid=sessionStorage.getItem('facilityId');
  dateRange!: FormGroup;
  tomorrow = new Date();



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<AAMAdminFacilityItemWiseStock>([]);

    // Initialize dateRange with today and tomorrow
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1); // Set tomorrow's date

    this.dateRange = this.fb.group({
        start: [firstDayOfMonth],    // Set start date to today
        end: [tomorrow]    // Set end date to tomorrow
    });
    this.dateRange.valueChanges.subscribe(() => {
      this.getAllDispatchPending();
    });


  }

  ngOnInit() {
    this.spinner.show();
    this.getAllDispatchPending();
  }

  // getAllDispatchPending() {
  //   this.spinner.show();
  //   this.api.getEmdStatusSummary().subscribe(
  //     (res) => {
  //       Add serial numbers to the data
  //       this.aAMAdminFacilityWiseIssue = res.map((item, index) => ({
  //         ...item,
  //         sno: index + 1
  //       }));

  //        console.log('Data with serial numbers:', this.aAMAdminFacilityWiseIssue); 
  //       this.aAMAdminFacilityWiseIssue = res;
  //       this.dataSource.data = res;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.spinner.hide();
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.error('Error fetching data', error);
  //       this.spinner.hide();
  //     }
  //   );
  // }
//     getAllDispatchPending() {
    
//     this.spinner.show();
//     const startDate = this.dateRange.value.start;
//     const endDate = this.dateRange.value.end;
//     const formattedStartDate = this.datePipe.transform(startDate, 'dd-MMM-yyyy') || '';
//     const formattedEndDate = this.datePipe.transform(endDate, 'dd-MMM-yyyy') || '';
    
//     if(formattedStartDate && formattedEndDate ){
// 
//       this.api.getFacilityWiseIssue('B',this.facid,0,formattedStartDate,formattedEndDate).subscribe(
//         (res:AAMAdminFacilityWiseIssue[]) => {
//   console.log(JSON.stringify(res))

          
//           this.aAMAdminFacilityWiseIssue = res.map((item: any, index: number) => ({
//             ...item,
//             sno: index + 1
//           }));
          
//           console.log('consumption report :', this.aAMAdminFacilityWiseIssue); 
//   console.log(JSON.stringify(res))
//           this.dataSource.data = this.aAMAdminFacilityWiseIssue;
//           this.dataSource.paginator = this.paginator;
//           this.dataSource.sort = this.sort;
//           this.spinner.hide();
//           this.cdr.detectChanges();
//         },
//         (error) => {
//           console.error('Error fetching data', error);
//           this.spinner.hide();
//         }
//       );
//     }
//   }
getAllDispatchPending() {
//   const startDate = this.dateRange.value.start;
//   const endDate = this.dateRange.value.end;
// // Only format dates if both start and end dates are selected
// const formattedStartDate = startDate ? this.datePipe.transform(startDate, 'dd-MMM-yyyy') : '';
// const formattedEndDate = endDate ? this.datePipe.transform(endDate, 'dd-MMM-yyyy') : '';
  
  // if (formattedStartDate && formattedEndDate) {
    this.spinner.show();
    this.api.getFacilityItemWiseStock(sessionStorage.getItem('districtid'), 0,0).subscribe(
      (res: AAMAdminFacilityItemWiseStock[]) => {
        if (res.length === 0) {
          this.toastr.info('No data found. Please select another date range.');
          this.dataSource.data=res
          this.spinner.hide();
          return;
        }

        // Add serial numbers to the data
        this.facilityItemWiseStock = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));

        // console.log('consumption report :', this.aAMAdminFacilityWiseIssue);
        this.dataSource.data = this.facilityItemWiseStock;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }



  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectedTabValue(event: any): void {
    this.selectedTabIndex = event.index;
  }
  exportToPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Get current date and time
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
  
    // Set font size for the title
    doc.setFontSize(18);
  
    // Calculate the position to center the title
    const header = 'Facility Wise Issue Report';
    const title = 'Facility: ' + (sessionStorage.getItem('firstname') || '');  
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - titleWidth) / 2;
    const xOffset1 = (pageWidth - titleWidth) / 2;
    
    doc.setFontSize(18);
    doc.text(header, xOffset1, 10);
     // Centered title at position Y=20
  doc.setFontSize(15);
     
    doc.text(title, xOffset, 20);
    doc.setFontSize(15); // Centered title at position Y=20

  // Set font size for the date and time
  doc.setFontSize(10);

  // Add the date and time to the top-left corner
  doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 10); // Top-left at position X=10, Y=10
    const columns = [
      { title: "S.No", dataKey: "sno" },
      { title: "Code", dataKey: "itemcode" },
      { title: "Type", dataKey: "itemtypename" },
      { title: "Item", dataKey: "itemname" },
      { title: "Strength", dataKey: "strengtH1" },
      { title: "Ready for Issue", dataKey: "readyforissue" },
      { title: "Edl Type", dataKey: "edltype" },
      { title: "Facility", dataKey: "facilityname" },
      { title: "District", dataKey: "districtname" },
      { title: "Location", dataKey: "locationname" }
      
    ];
    
    const rows = this.facilityItemWiseStock.map(row => ({
      sno: row.sno,
      itemcode: row.itemcode,
      itemtypename: row.itemtypename,
      itemname: row.itemname,
      strengtH1: row.strengtH1,
      readyforissue: row.readyforissue,
      edltype: row.edltype,
      facilityname: row.facilityname,
      districtname: row.districtname,
      locationname: row.locationname
      
    }));
  
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save('FacilityWise_Issue_Report.pdf');
  }
  
  
  









}

