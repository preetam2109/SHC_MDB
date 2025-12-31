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
import { MatButtonModule } from '@angular/material/button';
import { AAMAdminSHCstockOut } from 'src/app/Model/AAMAdminSHCstockOut';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-shc-stock-out',
  standalone: true,
  imports: [ MatButtonModule,MatMenuModule, MatTableExporterModule,MatPaginatorModule, MatTableModule],

  templateUrl: './shc-stock-out.component.html',
  styleUrl: './shc-stock-out.component.css'
})
export class ShcStockOutComponent {
  dataSource!: MatTableDataSource<AAMAdminSHCstockOut>;
  SHCstockOut: AAMAdminSHCstockOut[] = [];
  selectedTabIndex: number = 0;
  category=0;
  facid=sessionStorage.getItem('facilityId');


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<AAMAdminSHCstockOut>([]);


  }

  ngOnInit() {
    this.spinner.show();
    this.getAllDispatchPending();
  }

  
    getAllDispatchPending() {
    
    this.spinner.show();
    this.api.getSHCstockOut(sessionStorage.getItem('districtid')).subscribe(
      (res) => {
        // Add serial numbers to the data
        this.SHCstockOut = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));
        
        // console.log('Data with serial numbers:', this.SHCstockOut); 
// console.log(JSON.stringify(res))
        // this.SHCstockOut = res;
        this.dataSource.data = this.SHCstockOut;
        this.dataSource.data = this.SHCstockOut;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
        this.toastr.info(error.error);
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
    const header='SHC StockOut  Report'
    const title = 'Facility: ' + (sessionStorage.getItem('firstname') || '');  
      // (sessionStorage.getItem('firstname') || 'Indent Details');
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - titleWidth) / 2;
    const xOffset1 = (pageWidth - titleWidth) / 2;
  
    // Add centered title with some space above the table
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
      { title: "Facility", dataKey: "facilityname" },
      { title: "District", dataKey: "districtname" },
      { title: "Location", dataKey: "locationname" },
      { title: "Parent facility", dataKey: "parentfac" },
      { title: "Nos Items", dataKey: "nositems" },
      { title: "Stock Available", dataKey: "stkavil" },
      { title: "Stockout", dataKey: "stockout" },
     
    ];
    
    const rows = this.SHCstockOut.map(row => ({
      sno: row.sno,
      facilityname: row.facilityname,
      districtname: row.districtname,
      locationname: row.locationname,
      parentfac: row.parentfac,
      nositems: row.nositems,
      stkavil: row.stkavil,
      stockout: row.stockout,
    
    }));
  
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save('ShcStockOut_Report.pdf');
  }
  

}







