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
import { WHstockReport } from 'src/app/Model/WHstockReport';
import { NearExpStock } from 'src/app/Model/NearExpStock';
@Component({
  selector: 'app-near-expiry',
  templateUrl: './near-expiry.component.html',
  styleUrls: ['./near-expiry.component.css']
})
export class NearExpiryComponent {

  dataSource!: MatTableDataSource<NearExpStock>;
  dispatchPendings: NearExpStock[] = [];
  selectedTabIndex: number = 0;
  category=0;

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
    this.dataSource = new MatTableDataSource<NearExpStock>([]);


  }

  ngOnInit() {
    this.spinner.show();
    this.getAllDispatchPending(this.category);
  }

  // getAllDispatchPending() {
  //   this.spinner.show();
  //   this.api.getEmdStatusSummary().subscribe(
  //     (res) => {
  //       Add serial numbers to the data
  //       this.dispatchPendings = res.map((item, index) => ({
  //         ...item,
  //         sno: index + 1
  //       }));

  //        console.log('Data with serial numbers:', this.dispatchPendings); 
  //       this.dispatchPendings = res;
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
    getAllDispatchPending(category:any) {
    
    this.spinner.show();
    this.api.getNearExpStock(sessionStorage.getItem('facilityId'),category).subscribe(
      // 23246
      (res) => {
        // Add serial numbers to the data
        this.dispatchPendings = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));
        
        // console.log('Data with serial numbers:', this.dispatchPendings); 
// console.log(JSON.stringify(res))
        // this.dispatchPendings = res;
        this.dataSource.data = this.dispatchPendings;
        this.dataSource.data = this.dispatchPendings;
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
    const header='Near Expiry StockReport'
    const title = 'Facility: ' + (sessionStorage.getItem('firstname'));  
      // (sessionStorage.getItem('firstname') || 'Indent Details');
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - titleWidth) / 2;
    const xOffset1 = (pageWidth - titleWidth) / 2;

    // Add title and date/time to the document
    doc.setFontSize(18);
    doc.text(header, xOffset1, 10); // Centered title at position Y=20
    doc.setFontSize(15);

    doc.text(title, xOffset, 20); // Centered title at position Y=20
  
    // Set font size for the date and time
    doc.setFontSize(10);
  
    // Add the date and time to the top-left corner
    doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 10); // Top-left at position X=10, Y=10
    
    const columns = [
      { title: "S.No", dataKey: "sno" },
      { title: "Code", dataKey: "itemcode" },
      { title: "Item", dataKey: "itemname" },
      
      { title: "Strength", dataKey: "strengtH1" },
      { header: 'Batch No', dataKey: 'batchno' },
      { title: "Exp DT", dataKey: "Expdate" },
      { title: "Stock Qty", dataKey: "facstock" },
      { title: "Exp Timeline", dataKey: "exptimeline" },
    ];
    
    const rows = this.dispatchPendings.map(row => ({
      sno: row.sno,
      itemcode: row.itemcode,
      itemname: row.itemname,
      strengtH1: row.strengtH1,
      batchno: row.batchno,
      expdate: row.expdate,
      facstock: row.facstock,
      exptimeline: row.exptimeline,
    }));
  
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save('NearExpiry_Stock_Report.pdf');
  }
  
  

//   onCodeClick(itemid: number, itemcode: string,itemname:string,strengtH1:string,sku:string): void {
//     
//     this.spinner.show();

//     Call your API with the itemid
//     this.api.getWarehouseWiseStock(itemid,0).subscribe(
//         (response) => {
//             this.spinner.hide();
// this.warehouseStock=response
// console.log('asdf',JSON.stringify(this.warehouseStock))
        

//             Open a dialog with the WarehouseWiseStock data
//             this.dialog.open(WarehouseStockDialogComponent, {
//                 width: '600px',
//                 data: this.warehouseStock,
                
//             });
//         },
//         (error) => {
//             this.spinner.hide();
//             console.error('Error fetching item details', error);
//         }
//     );
// }
onCodeClick(itemid: number, itemcode: string, itemname: string, strengtH1: string, sku: string): void {
//   this.spinner.show();

//   this.api.getWarehouseWiseStock(itemid, 0).subscribe(
//     (response) => {

//       this.warehouseStock = response.map((item: any, index: number) => ({
//         ...item,
//         sno: index + 1
//       }));


//       this.spinner.hide();
//       // this.warehouseStock = response;


//       // Open a dialog with the WarehouseWiseStock data and additional item details
//       this.dialog.open(WarehouseStockDialogComponent, {
//         width: '600px',
//         data: {
//           warehouseStock: this.warehouseStock,
//           itemcode: itemcode,
//           itemname: itemname,
//           strengtH1: strengtH1,
//           sku: sku
//         }
//       });
//     },
//     (error) => {
//       this.spinner.hide();
//       console.error('Error fetching item details', error);
//     }
//   );
}


onPipelineClick(itemid: number,itemname: string, strengtH1: string, sku: string,edltype:string): void {
//   this.spinner.show();

//   this.api.getPipelineDetails(0, itemid, 1, 0, 0).subscribe(
//     (response) => {
//       console.log('API Response:', response);

//       // Trigger 
//       ;

//       this.pipiLineDetails = response.map((item: any, index: number) => ({
//         ...item,
//         sno: index + 1
//       }));

//       console.log('Processed Pipeline Details:', this.pipiLineDetails);
//       this.spinner.hide();

//       this.dialog.open(TotalPipeLineDialogComponent, {
//         width: '800px',
//         data: {
//           pipiLineDetails: this.pipiLineDetails,
//           itemname: itemname,
//           strengtH1: strengtH1,
//           sku: sku,
//           edltype: edltype
//         }
//       });
//     },
//     (error) => {
//       this.spinner.hide();
//       console.error('Error fetching pipeline details', error);
//     }
//   );
}
onItemNameClick(itemid:number,edlcat:string,groupname:string,itemcode:string,itemname: string, strengtH1: string, sku: string,edltype:string): void {
//   this.spinner.show();

//   this.api.getItemDetails(0,itemid,0,0,0,0,0,0,0,0,0,0,0,0,0).subscribe(
//     (response) => {
//       console.log('API Response:', response);

//       // Trigger 
//       ;

//       this.itemDetails = response.map((item: any, index: number) => ({
//         ...item,
//         sno: index + 1
//       }));

//       console.log('Processed Item Details:', this.itemDetails);
//       this.spinner.hide();

//       this.dialog.open(ItemDialogComponent, {
//         width: '800px',
//         data: {
//           itemDetails: this.itemDetails,
//           groupname:groupname,
//           itemcode:itemcode,
//           itemname: itemname,
//           strengtH1: strengtH1,
//           sku: sku,
//           edlcat:edlcat,
//           edltype: edltype
//         }
//       });
//     },
//     (error) => {
//       this.spinner.hide();
//       console.error('Error fetching pipeline details', error);
//     }
//   );
}


}






