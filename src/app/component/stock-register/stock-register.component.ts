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
import { FacilityIssueDateWise } from 'src/app/Model/FacilityIssueDateWise';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GetReceiptItems } from 'src/app/Model/GetReceiptItems';
import { OpningClosingItem } from 'src/app/Model/OpningClosingItem';
@Component({
  selector: 'app-stock-register',
  templateUrl: './stock-register.component.html',
  styleUrls: ['./stock-register.component.css']
})
export class StockRegisterComponent {
 
  dataSource!: MatTableDataSource<OpningClosingItem>;
  dispatchPendings: OpningClosingItem[] = [];
  selectedTabIndex: number = 0;
  category=0;
  facid=sessionStorage.getItem('facilityId');
  indentForm!: FormGroup;
  tomorrow = new Date();
  getReceiptItems:GetReceiptItems[]=[];
  itemid:any
  processedData: any[] = [];
  maxDate: Date;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<OpningClosingItem>([]);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.maxDate = today; 
    this.indentForm = new FormGroup({
      itemid: new FormControl('', Validators.required),  // Dropdown for program
      
      name: new FormControl('', Validators.required),
      start:new FormControl(firstDayOfMonth, Validators.required)
    });


  }

  ngOnInit() {
    this.spinner.show();
    this.getMonthIndentProgramcCategory()
    
  }
  show(){
    this.getAllDispatchPending()
    

  }
  showopeningAndClosing(){
    this.calculateOpeningAndClosing()
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


  getMonthIndentProgramcCategory(){
    
    this.api.GetReceiptItems(this.facid).subscribe((res:GetReceiptItems[])=>{
      
        this.getReceiptItems = res;
        
        // console.log(this.itemid)
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }
  calculateOpeningAndClosing() {
    
    let opening = 0; // Initial opening value is always 0
    const data = this.dataSource.data;
    // console.log('aaa',this.dataSource.data);

    // Iterate over the data and calculate opening and closing
    this.processedData = data.map((row, index) => {
      let closing = opening; // Default closing is the same as opening

      // If the type is 'op', assign the QTY to the closing
      if (row.type === 'OP') {
        closing = row.qty;
      }else if(row.type === 'Issue'){
        closing = opening - row.qty;

      } else {
        // For other types, calculate closing based on the opening + qty
        closing = opening + row.qty;
      }

      const newRow = {
        ...row,        // Spread the existing data
        opening: opening, // Assign the calculated opening value
        closing: closing  // Assign the calculated closing value
      };

      // Update opening for the next row (next row's opening = current row's closing)
      opening = closing;

      return newRow; // Return the modified row
    });
    this.dataSource.data = this.processedData;
  console.log('Processed data with opening and closing:', this.processedData);
  }

  getAllDispatchPending() {
    ;
    this.spinner.show();
    const indentData = this.indentForm.value;
    const selectedDate = indentData.start; // Get the selected single date
    const formattedDate = this.datePipe.transform(selectedDate, 'dd-MMM-yyyy') || ''; // Format to '01-Apr-2024'
  const itemid=indentData.itemid
    if (formattedDate) { // Check if the date is valid
      this.api.getOpningClosingItem(this.facid, itemid, formattedDate).subscribe( // Use the formatted date for the API call
        (res) => {
          // Add serial numbers to the data
          this.dispatchPendings = res.map((item: any, index: number) => ({
            ...item,
            sno: index + 1
          }));
          
          // console.log('Data with:', this.dispatchPendings); 
          // console.log(JSON.stringify(res));
          this.dataSource.data = this.dispatchPendings;
          // console.log('Datasource data with:',  this.dataSource.data); 

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.showopeningAndClosing()
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching data', error);
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.hide(); // Hide spinner if the date is not valid
      console.warn('No valid date selected.');
    }
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
  getplace(type: string, place: string): string {

    
    if (type === 'Issue') {
      return `Issue to ${place}`;
    } else if (type === 'Receipt') {
      return `Receipt from ${place}`;
    }
    return place; // Default case if the type is neither 'Issue' nor 'Receipt'
  }
  getplaceIssue(type: string, qty: number): number {
 let quantity=0
if(type==='Issue'){
  quantity=qty
 
}else{
   quantity=0;
} 
return quantity;

  }
  getplaceReceiptQty(type: string, qty: number): number {
 let quantity=0
if(type==='Receipt'){
  quantity=qty
 
}else if(type==='OP'){
  quantity=qty

}
else{
   quantity=0;
} 
return quantity;

  }
  exportToPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
  
    // Get current date and time
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    // let indentData = this.indentForm.value;
    // let itemname = indentData.name;
    const selectedItemId = this.indentForm.get('itemid')?.value;
    const selectedItem = this.getReceiptItems.find(item => item.itemid === selectedItemId);
    const selectedItemName = selectedItem ? selectedItem.name : 'N/A'; // Default if not found
  
    // Set font size for the title
    doc.setFontSize(18);
  
    // Calculate the position to center the title
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Stock Register';
    const textWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - textWidth) / 2;
  
    // Add centered title with some space above the table
    doc.text(title, xOffset, 20); // Centered title at position Y=20
  
    doc.setFontSize(12);
  doc.text(`Item Name: ${selectedItemName}`, 15, 30); // Display selected item name
  // doc.text(`Item ID: ${selectedItemId}`, 30, 40); // Optionally display the item ID
  
    // Set font size for the date and time
    doc.setFontSize(10);
  
    // Add the date and time to the top-left corner
    doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 10); // Top-left at position X=10, Y=10
  
    // Define columns for the table
    const columns = [
      { title: "S.No", dataKey: "sno" },
      { title: "Opening", dataKey: "opening" },
      { title: "Date", dataKey: "trandate" },
      { title: "Particular", dataKey: "place" },   // Use the computed 'place' value
      { title: "Voucher No", dataKey: "stranno" },
      { title: "Received QTY", dataKey: "ReceivedQTY" },   // Use the computed 'ReceivedQTY' value
      { title: "Consumption QTY", dataKey: "ConsuptionQTY" },   // Use the computed 'ConsuptionQTY' value
      { title: "Closing", dataKey: "closing" },
    ];
  
    // Map the data and compute values for place, ReceivedQTY, and ConsuptionQTY
    const rows = this.dataSource.data.map((row, index) => ({
      sno: index + 1,  // Assuming 'sno' is just the row index
      opening: row.opening,
      trandate: row.trandate,
      place: this.getplace(row.type, row.place),   // Compute the place value
      stranno: row.tranno,
      ReceivedQTY: this.getplaceReceiptQty(row.type, row.qty),   // Compute the received quantity
      ConsuptionQTY: this.getplaceIssue(row.type, row.qty),   // Compute the consumption quantity
      closing: row.closing,
    }));
  
    // Generate the table
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40, // Start table a little further down to account for the title and date/time
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
    });
  
    // Save the generated PDF
    doc.save('Stock_Register.pdf');
  }
  
  
  
  









}






