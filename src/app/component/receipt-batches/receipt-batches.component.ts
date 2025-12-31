import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/Model/Category';
import { FacMonthIndentItems } from 'src/app/Model/FacMonthIndentItems';
import { NOCItems } from 'src/app/Model/NOCItems';
import { SHCitems } from 'src/app/Model/SHCitems';
import { ApiServiceService } from 'src/app/service/api-service.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'; 
import { ReceiptDetailsBatch } from 'src/app/Model/ReceiptDetailsBatch';
import { ReceiptItems } from 'src/app/Model/ReceiptItems';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-receipt-batches',
  templateUrl: './receipt-batches.component.html',
  styleUrls: ['./receipt-batches.component.css']
})
export class ReceiptBatchesComponent {
  reqDate: string | undefined;
  indentid: number | undefined;
  reqno: string | undefined;

  receiptnumber:number | undefined;
  receiptdate:number | undefined
  wHIsueNo:number | undefined
  wHIsueDT:number | undefined
  status:string | undefined 
  facreceiptid:any;
  facid=sessionStorage.getItem('facilityId');
  isSaveDisabled: boolean = false;


  
  parentfac=sessionStorage.getItem('parentfac');
  districtname=sessionStorage.getItem('districtname');
  contactpersonname=sessionStorage.getItem('contactpersonname');
  phonE1=sessionStorage.getItem('phonE1');
  nocid: any;
  drug: Category[] = [];
  drugType: FacMonthIndentItems[] = [];
  receiptDetailsBatch: ReceiptDetailsBatch[] = [];
  drugcategory=1
  
  // Arrays to track selected items and requested quantities
  selectedItems: number[] = [];
  requestedQtyList: { inwno:any, issuewh: any }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
this.spinner.show()
    this.route.queryParams.subscribe((params) => {
      this.indentid = params['indentid'];
      this.facreceiptid = params['facreceiptid'];
      this.reqno = params['reqno'];
      this.reqDate=params['reqDate'];
      this.nocid = params['nocid'];
      this.receiptnumber = params['receiptnumber'];
      this.receiptdate = params['receiptdate'];
      this.wHIsueNo = params['wHIsueNo'];
      this.wHIsueDT = params['wHIsueDT'];
      this.status=params['status'];
    });
  
    this.getReceiptDetailsBatch()

  }
  getStatusText(status: any): string {
    switch (status) {
      case 'I':
        return 'Incomplete';
      case 'C':
        return 'Completed';
      case 'IN':
        return 'Incomplete';

      default:
        return status;
    }
  }

  getDrugCategory() {
    this.api.getDrugCategory().subscribe(
      (res: any) => {
        this.drug = res;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  getDrugCategoryType() {
    const facid = sessionStorage.getItem('facilityId');
    this.api.getDrugTypeCategory(facid, 1, 0).subscribe(
      (res: FacMonthIndentItems[]) => {
        this.drugType = res;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  getReceiptDetailsBatch() {
    
    const facid = sessionStorage.getItem('facilityId');

    this.spinner.show()
    this.selectedItems = []; 
    // this.drugcategory=category
    this.api.getReceiptDetailsBatch(this.nocid,facid,this.indentid).subscribe(
      (res: any) => {
        this.receiptDetailsBatch = res;
        // this.sHCitems = [...this.sHCitems]
        console.log(' qa status :',res);

        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  
  

  
  
  // Method to capture requested quantities from the input fields
  updateRequestedQty(event: any,inwno:any) {
   
    const issuewh=parseInt(event.target.value,10);
  
    const itemIndex = this.receiptDetailsBatch.findIndex(item => item.inwno === inwno);
    
    if (itemIndex !== -1) {
      // Check if the value is a valid multiple
      if (issuewh > 0) {
        // Valid value: Mark item as valid and update requested quantity
        // this.receiptDetailsBatch[itemIndex].invalid = false;
        
        // Update or add the requested quantity for this item
        const existingItemIndex = this.requestedQtyList.findIndex(item => item.inwno === inwno);
        if (existingItemIndex !== -1) {
          // Update the existing item quantity
          this.requestedQtyList[existingItemIndex].issuewh = issuewh;
          // this.requestedQtyList[existingItemIndex].sr = sr; // Update SR value
          // this.requestedQtyList[existingItemIndex].unitcount = unitcount; // Update SR value
        } else {
          // Add a new item to the requestedQtyList
          this.requestedQtyList.push({ inwno, issuewh});
        }
      } else {
        // Invalid value: Mark item as invalid and show the error message
        // this.receiptDetailsBatch[itemIndex].invalid = true;
      }
    }
  }
  
  isAnyInvalid(): boolean {
    return true;
    // this.receiptDetailsBatch.some(item => item.invalid); // Check if any item is marked as invalid
  }
  
  
  saveData() {
    
    // Filter the items that have a requested quantity greater than 0
    const itemsToSave = this.receiptDetailsBatch.filter(item => item.issuewh > 0);
    const rqtyValue = this.receiptDetailsBatch.every(item => item.issuewh === item.rqty);

    // If no items are selected for saving, show an alert and stop the process
    if (itemsToSave.length === 0) {
        alert('Please specify a valid requested quantity before saving.');
        return;
    }
    if (rqtyValue) {
      alert('प्राप्ति की सामग्री पूर्व से ही सेव की जा चुकी है ,\n Already Received the items.');
      this.isSaveDisabled = true;
      return;
  }

    // Loop through the items to save
    itemsToSave.forEach((item) => {
      
        const ReceiptItemData: ReceiptItems = {
            facreceiptitemid: 0,
            facreceiptid: this.facreceiptid,
            // qastatus:item.qastatus
          
        };

        

        // Make the API call to save the receipt item
        this.api.postReceiptItems(ReceiptItemData, item.ponoid,0, this.facid, this.facreceiptid, item.inwno,this.indentid).subscribe(
            () => {
                // console.log('Saved:', response + 'fully');
                // Optionally handle success (e.g., show a success message)
                // alert(response)
                
                // this.getReceiptDetailsBatch()
            },
            (error) => {
                console.error('Error in POST request:', error);
                alert(`An error occurred while posting data for item ${item.itemname}.`);
            }
        );
    }
    );
    alert('Items Received Sucessfully, Please Freez after re check')
    this.getReceiptDetailsBatch()
}

  
  backtoPreviousPage(){
    
    this.router.navigate(['receipt-from-warehouse'])
  }
  validateNumberInput(event: KeyboardEvent): void {
    
    // Allow only numeric characters (0-9)
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  removeNonNumeric(event: any): void {
    
    // Replace any non-numeric characters (if pasted) with an empty string
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  freezData(){
    
    // this.spinner.show();
this.api.freezeReceipts(this.facreceiptid).subscribe(
  (res:any)=>{
    console.log('Response:', res);
    alert('Items Received  successfully ');
    this.router.navigate(['receipt-from-warehouse']);
    // this.spinner.hide();

  },
  (error)=>{
    this.toastr.error('Something went wrong :(');
    
  console.log("Error while freezing ",error)
  }

);
}


printPDF() {
  // Step 1: Filter the table data to include only rows with requestedqty > 0
  const filteredItems = this.receiptDetailsBatch.filter(item => item.indentqty > 0);

  // Check if filtered items are available
  if (filteredItems.length === 0) {
    console.warn('No items found with requested quantity greater than 0');
    return; // Exit if no data
  }

  // Step 2: Initialize a new jsPDF instance
  const doc = new jsPDF('l', 'mm', 'a4');

  // Get current date and time
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();

  // Step 3: Set up title and additional information
  const title = 'Facility: ' + (sessionStorage.getItem('firstname') || 'Indent Details');
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth = doc.getTextWidth(title);
  const xOffset = (pageWidth - titleWidth) / 2;

  // Add title and date/time to the document
  doc.setFontSize(18);
  doc.text(title, xOffset, 20); // Centered title at position Y=20
  doc.setFontSize(10);
  doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 10); // Date/Time at position X=10, Y=10

  // Add indent details (Left and right aligned)
  doc.setFontSize(12);
  doc.text(`Parent Facility: ${this.parentfac}`, 30, 30); // Left-aligned at position X=30, Y=30
  doc.text(`District: ${this.districtname}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
  doc.text(`Indent Date: ${this.reqDate}`, 30, 40); // Left-aligned at position X=30, Y=40
  doc.text(`Indent No: ${this.reqno}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 100, Y=40

  doc.text(`Noc Id: ${this.nocid}`, 30, 50); // Left-aligned at position X=30, Y=50
  doc.text(`Status: Incomplete`, pageWidth - 100, 50); // Right-aligned at position X=pageWidth - 100, Y=50

  // Step 4: Define the table columns
  const columns = [
    { header: 'S.No', dataKey: 'sno' },
    // { header: 'SR', dataKey: 'sr' },
    { header: 'Code', dataKey: 'itemcode' },
    { header: 'Item', dataKey: 'itemname' },
    { header: 'Item Type', dataKey: 'itemtypename' },
    { header: 'Strength', dataKey: 'strengtH1' },
    { header: 'Multiple', dataKey: 'multiple' },
    { header: 'Unit Count', dataKey: 'unitcount' },
    { header: 'Requested Quantity', dataKey: 'indentqty' }
  ];

  // Step 5: Prepare the rows for the table
  const rows = filteredItems.map((item, index) => ({
    sno: index + 1,
    // sr: item.sr,
    itemcode: item.itemcode,
    itemname: item.itemname,
    itemtypename: item.itemtypename,
    strengtH1: item.strengtH1,
    multiple: item.multiple,
    unitcount: item.unitcount,
    indentqty: item.indentqty
  }));

  // Step 6: Use the autoTable method
  autoTable(doc, {
    head: [columns.map(col => col.header)], // Add headers from columns
    body: rows.map(row => Object.values(row)), // Map row values in order
    theme: 'striped',
    margin: { top: 60 }, // Adjusted margin top for title and indent details
    styles: { cellPadding: 3, fontSize: 10 },
    didDrawPage: function (data) {
      // Retrieve contactpersonname and phonE1 from sessionStorage
      const contactpersonname = sessionStorage.getItem('contactpersonname') || 'N/A';
      const phonE1 = sessionStorage.getItem('phonE1') || 'N/A';
      
      // Calculate the bottom-right position for the text
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Set font size for the bottom-right text
      doc.setFontSize(10);

      // Add contact person name and phone number at the bottom-right corner of each page
      const footerText = `Contact Person: ${contactpersonname}, Phone: ${phonE1}`;
      doc.text(footerText, pageWidth - doc.getTextWidth(footerText) - 10, pageHeight - 10);
    }
  });

  // Step 7: Save the PDF
  doc.save('Indent-Details.pdf');
}

delete(){
  
  this.api.deleteReceipts(this.facreceiptid).subscribe((res:any)=>{
this.router.navigate(['receipt-from-warehouse'])

  },
    (error)=>{
      console.log(error);
    }
  )
  
}

isFreezeButtonDisabled(): boolean {
  // Check if there is any item where issuewh is not equal to rqty
  return !this.receiptDetailsBatch.every(item => item.issuewh === item.rqty);
}
  
  
  
}
