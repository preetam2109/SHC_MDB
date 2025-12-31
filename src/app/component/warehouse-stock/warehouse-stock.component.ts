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
import { FacilityInfo } from 'src/app/Model/FacilityInfo';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-warehouse-stock',
  templateUrl: './warehouse-stock.component.html',
  styleUrls: ['./warehouse-stock.component.css']
})
export class WarehouseStockComponent {
  warehousename:any
  FacilityInfo:FacilityInfo[]=[];

  dataSource!: MatTableDataSource<WHstockReport>;
  warehouseStock: WHstockReport[] = [];
  selectedTabIndex: number = 0;
  category=0;

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
    this.dataSource = new MatTableDataSource<WHstockReport>([]);


  }

  ngOnInit() {
    this.spinner.show();
    this.getAllDispatchPending(this.category);
    this.getFacilityInfo()
  }

  // getAllDispatchPending() {
  //   this.spinner.show();
  //   this.api.getEmdStatusSummary().subscribe(
  //     (res) => {
  //       Add serial numbers to the data
  //       this.warehouseStock = res.map((item, index) => ({
  //         ...item,
  //         sno: index + 1
  //       }));

  //        console.log('Data with serial numbers:', this.warehouseStock); 
  //       this.warehouseStock = res;
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
    this.api.getWHstockReport(sessionStorage.getItem('facilityId')).subscribe(
      (res) => {
        // Add serial numbers to the data
        this.warehouseStock = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));
        
        // console.log('Data with serial numbers:', this.warehouseStock); 
// console.log(JSON.stringify(res))
        // this.warehouseStock = res;
        this.dataSource.data = this.warehouseStock;
        this.dataSource.data = this.warehouseStock;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error('Failed to fetch data. Please try again later.');
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }
  GetWHStockAAMBatchWise(category:any) {
    
    this.spinner.show();
    this.api.getWHStockAAMBatchWise(sessionStorage.getItem('facilityId')).subscribe(
      (res) => {
        // Add serial numbers to the data
        this.warehouseStock = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1
        }));
        
        // console.log('Data with serial numbers:', this.warehouseStock); 
// console.log(JSON.stringify(res))
        // this.warehouseStock = res;
        this.dataSource.data = this.warehouseStock;
        this.dataSource.data = this.warehouseStock;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error('Failed to fetch data. Please try again later.');
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

  getFacilityInfo(){
      
    this.api.getFacilityInfo(sessionStorage.getItem('facilityId'),0,0,0).subscribe((res:FacilityInfo[])=>{
        this.FacilityInfo=res;
      this.warehousename=this.FacilityInfo[0].warehousename;
    })
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
    const title = `${this.warehousename} Warehouse Stock Report`;
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
      { title: "Code", dataKey: "itemcode" },
      { title: "Type", dataKey: "itemtypename" },
      { title: "Item", dataKey: "itemname" },
      { title: "Strength", dataKey: "strength1" },
      { title: "Ready Stock", dataKey: "readySTK" },
      { title: "Under Qc", dataKey: "uqcSTK" },
    ];
    
    const rows = this.warehouseStock.map(row => ({
      sno: row.sno,
      itemcode: row.itemcode,
      itemtypename: row.itemtypename,
      itemname: row.itemname,
      strength1: row.strength1,
      readySTK: row.readySTK,
      uqcSTK: row.uqcSTK,
    }));
  
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save('Warehouse_Stock_Report.pdf');
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






