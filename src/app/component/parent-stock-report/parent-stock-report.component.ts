import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StockReport } from 'src/app/Model/StockReport';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { stockReportParent } from 'src/app/Model/stockReportParent';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parent-stock-report',
  templateUrl: './parent-stock-report.component.html',
  styleUrls: ['./parent-stock-report.component.css']
})
export class ParentStockReportComponent {

  dataSource!: MatTableDataSource<stockReportParent>;
  parentStockReport: stockReportParent[] = [];
  selectedTabIndex: number = 0;
  category=0;
  categoryName:string="D";
  facid=sessionStorage.getItem('facilityId');
  parentfac=sessionStorage.getItem('parentfac')


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
    this.dataSource = new MatTableDataSource<stockReportParent>([]);


  }

  ngOnInit() {
    this.spinner.show();
    this.getAllParentStockReport(this.categoryName);
  }

  getAllParentStockReport(categoryName: string) {
    
    this.spinner.show();
    this.api.getstockReportParent(this.facid, 0, categoryName).subscribe(
      (res) => {
        
        if (res && res.length > 0) {
          // Add serial numbers to the data
          this.parentStockReport = res.map((item: any, index: number) => ({
            ...item,
            sno: index + 1
          }));
          
          // Assign data to the data source
          this.dataSource.data = this.parentStockReport;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          // Show message if no data is returned
          this.toastr.info('No data available for the selected category.');
          this.parentStockReport = []; // Clear previous data if any
          this.dataSource.data = [];
        }
  
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.toastr.error('Failed to fetch data. Please try again later.');
        this.spinner.hide();
      }
    );
  }
  
  //   getAllParentStockReport(categoryName:any) {
    
  //   this.spinner.show();
  //   this.api.getstockReportParent(this.facid,0,categoryName).subscribe(
  //     (res) => {
      
  //       this.parentStockReport = res.map((item: any, index: number) => ({
  //         ...item,
  //         sno: index + 1
  //       }));
        
        
  //       this.dataSource.data = this.parentStockReport;
  //       this.dataSource.data = this.parentStockReport;
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `${this.parentfac} Stock Report`;
    const textWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - textWidth) / 2;
  
    // Add centered title with some space above the table
    doc.text(title, xOffset, 20); // Centered title at position Y=20
  
    // Set font size for the date and time
    doc.setFontSize(10);
  
    // Add the date and time to the top-left corner
    doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 10); // Top-left at position X=10, Y=10
    
    const columns = [
      { title: "S.No", dataKey: "sno" },
      { title: "Category Name", dataKey: "categoryName" },
      { title: "Code", dataKey: "itemCode" },
      { title: "Item Type", dataKey: "itemtypename" },
      { title: "Item", dataKey: "itemName" },
      { title: "Strength", dataKey: "strength1" },
      { title: "Ready For Issue", dataKey: "readyForIssue" },
      { title: "Edl Type", dataKey: "edlType" },
    ];
    
    const rows = this.parentStockReport.map(row => ({
      sno: row.sno,
      categoryName: row.categoryName,
      itemCode: row.itemCode,
      itemtypename: row.itemtypename,
      itemName: row.itemName,
      strength1: row.strength1,
      readyForIssue: row.readyForIssue,
      edlType: row.edlType,
    }));
  
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save('Parent_Stock_Report.pdf');
  }
  
  


}






