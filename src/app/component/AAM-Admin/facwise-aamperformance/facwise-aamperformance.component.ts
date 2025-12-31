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
import { MatMenuModule } from '@angular/material/menu';
import { MatTableExporterModule } from 'mat-table-exporter';
import { KPIdistWise } from 'src/app/Model/KPIdistWise';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facwise-aamperformance',
  standalone: true,
  imports: [ FormsModule,CommonModule,NgSelectModule,MatButtonModule,MatMenuModule, MatTableExporterModule,MatPaginatorModule, MatTableModule],
  templateUrl: './facwise-aamperformance.component.html',
  styleUrl: './facwise-aamperformance.component.css'
})
export class FacwiseAAMPerformanceComponent {

  dataSource!: MatTableDataSource<KPIdistWise>;
  kPIdistWise: any[] = [];
  selectedTabIndex: number = 0;
  category=0;
  facid=sessionStorage.getItem('facilityId');
  districid:any
  selectedDistrictId: number | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<KPIdistWise>([]);


  }

  ngOnInit() {
    this.spinner.show();
  this.districid=sessionStorage.getItem('districtid')

    this.getAllDispatchPending();

  }

 

 


    getAllDispatchPending() {
    
    this.spinner.show();
    this.api.getKPIdistWise(this.districid).subscribe(
      (res) => {
        // Add serial numbers to the data
        this.kPIdistWise = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));
        
        console.log('Data with serial numbers:', this.kPIdistWise); 
// console.log(JSON.stringify(res))
        // this.kPIdistWise = res;
        this.dataSource.data = this.kPIdistWise;
        this.dataSource.data = this.kPIdistWise;
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
    const header = 'Facility Wise AAM Performance';
    const title = 'Facility: ' + (sessionStorage.getItem('firstname') || 'Current Stock Report');  
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - titleWidth) / 2;
    const xOffset1 = (pageWidth - doc.getTextWidth(header)) / 2;
  
    // Add centered title with some space above the table
    doc.setFontSize(18);
    doc.text(header, xOffset1, 10);
    // Centered title at position Y=20
    doc.setFontSize(15);
    doc.text(title, xOffset, 20);
  
    // Set font size for the date and time
    doc.setFontSize(10);
  
    // Add the date and time to the top-left corner
    doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 30); // Adjusted Y position to avoid overlap
      
    const columns = [
      { title: "S.No", dataKey: "sno" },
      { title: "District", dataKey: "districtname" },
      { title: "Facility Name", dataKey: "facilityname" },
      { title: "Opening Stock Drugs", dataKey: "nosdrugsopstock" },
      { title: "Indents", dataKey: "nosindent" },
      { title: "Items Indented", dataKey: "nositemsindented" },
      { title: "Receipts", dataKey: "nosreceipt" },
      { title: "Items Received ", dataKey: "nositemsreceipts" },
    ];
    
    const rows = this.kPIdistWise.map(row => ({
      sno: row.sno,
      districtname: row.districtname,
      facilityname: row.facilityname,
      nosdrugsopstock: row.nosdrugsopstock,
      nosindent: row.nosindent,
      nosreceipt: row.nosreceipt,
    }));
  
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save('FacilityWise_AAM_Performance_Report.pdf');
  }
  
  









}






