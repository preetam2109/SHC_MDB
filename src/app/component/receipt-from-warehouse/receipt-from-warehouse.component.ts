import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReceiptDetails } from 'src/app/Model/ReceiptDetails';
import { ReceiptMasterFromWH } from 'src/app/Model/ReceiptMasterFromWH';
import { ReceiptVouchers } from 'src/app/Model/ReceiptVouchers';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-receipt-from-warehouse',
  templateUrl: './receipt-from-warehouse.component.html',
  styleUrls: ['./receipt-from-warehouse.component.css']
})
export class ReceiptFromWarehouseComponent implements OnInit {
  receiptMasterFromWH:ReceiptMasterFromWH[]=[];
  facid=sessionStorage.getItem('facilityId');
  receiptdetails:ReceiptDetails[]=[];
  nocid:any
  receiptVouchers:ReceiptVouchers[]=[]

  constructor(private toastr: ToastrService,public datePipe: DatePipe,private router:Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private http: HttpClient,private cdr: ChangeDetectorRef,
     
    ) {
    }
  ngOnInit(): void {
    this.getReceiptMasterFromWH()    
  }
getReceiptMasterFromWH(){
  this.spinner.show();
this.api.getReceiptMasterFromWH(this.facid,'I').subscribe((res:ReceiptMasterFromWH[])=>{
  this.receiptMasterFromWH = res.map((item, index) => ({
    ...item,
    sno: index + 1
  }));
  // console.log('kaushal sir ',res)
  
  
  this.spinner.hide();
  this.cdr.detectChanges();

},
(error)=>{
  this.spinner.hide();
  this.toastr.info('Oops! Something Went Wrong \n We encountered an unexpected error while processing your request.')
  // alert(error);
}

)
}
getStatusText(status: any): string {
  switch (status) {
    case 'IN':
      return 'Incomplete';
    case 'C':
      return 'Completed';
    default:
      return status;
  }
}
receiptEntry(item:any){
  
  const whid=item.warehouseid
  const facid=item.facilityid
  const indentid=item.indentid
  const  facreceiptdate=item.facreceiptdate
  
  if(facreceiptdate !=null){
    this.api.getReceiptDetails(indentid, facid).subscribe((res: ReceiptDetails[]) => {
      this.receiptdetails = res;
  
      // Extract the values you need from the response
      const facreceiptid = res[0].facreceiptid;
      this.nocid = res[0].nocid;
      const indentid = res[0].indentid;
      const reqno = res[0].reqno;
      const reqdate = res[0].reqdate;
      const whissueno = res[0].whissueno;
      const whissuedt = res[0].whissuedt;
      const facreceiptno = res[0].facreceiptno;
      const facreceiptdate = res[0].facreceiptdate;
      const status = res[0].status;
  
      // Navigate and pass the values using queryParams
      this.router.navigate(['receipt-batches'], {
        queryParams: {
          facreceiptid: facreceiptid,
          nocid: this.nocid,
          indentid: indentid,
          reqno: reqno,
          reqDate: reqdate,
          wHIsueNo: whissueno,
          wHIsueDT: whissuedt,
          receiptnumber: facreceiptno,
          receiptdate: facreceiptdate,
          status:status
        }
      });
    });
  }
  
  else{

    this.router.navigate(['receipt-date-entry'], { queryParams: { whid,facid,indentid } });
  }
}
backbutton(){
  this.router.navigate(['receipt-from-warehouse']);

}
deleteReceipt(receiptid:any){
  
  this.api.deleteReceipts(receiptid).subscribe((res:any)=>{
    alert(res)
    // console.log(res);
    this.getReceiptMasterFromWH()    


  },
    (error)=>{
      console.log(error);
    }
  )

}
printReceiptVoucher(item:any){

  const reqDate = item.reqdate;
  const reqno = item.reqno;
  const wHIsueNo = item.whissueno;
  const wHIsueDT = item.whissuedt;
  const receiptnumber = item.facreceiptno;
  const receiptdate = item.facreceiptdate;
  const status1=item.rstatus;
  const status = status1 === 'C' ? 'Completed' : 'Incomplete';

  // Fetch data from the API
  this.api.getReceiptVouchers(this.facid,item.facreceiptid).subscribe(
    (res: ReceiptVouchers[]) => {
      // Map and assign the received data to the component variable
      this.receiptVouchers = res.map((item, index) => ({
        ...item,
        sno: index + 1,
      }));

      // Filter items with requested quantity > 0
      const filteredItems = this.receiptVouchers.filter(
        (item) => parseInt(item.issuewh) > 0
      );

      // Check if filtered items are available
      if (filteredItems.length === 0) {
        console.warn('No items found with requested quantity greater than 0');
        return; // Exit if no data
      }

      // Initialize a new jsPDF instance
      const doc = new jsPDF('l', 'mm', 'a4');

      // Get current date and time
      const now = new Date();
      const dateString = this.datePipe.transform(now, 'dd-MM-yyyy') || '';
      const timeString = now.toLocaleTimeString();

      // Set up title and additional information
      const title ='Receipt from  Warehouse'  
        // (sessionStorage.getItem('firstname') || 'Indent Details');
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
      doc.text(`Indent No: ${reqno}`, 30, 30); // Left-aligned at position X=30, Y=30
      doc.text(`Indent Date: ${reqDate}`, 30, 40); // Left-aligned at position X=30, Y=30
      doc.text(`WH Issue No: ${wHIsueNo}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
      doc.text(`WH Issue Date: ${wHIsueDT}`, 30, 50); // Left-aligned at position X=10, Y=30
      doc.text(`Receipt No: ${receiptnumber}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 60, Y=30
      doc.text(`Receipt Dt: ${receiptdate}`, 30, 58); // Left-aligned at position X=10, Y=30

      // doc.text(`Noc Id: ${nocid}`, 30, 50); // Left-aligned at position X=10, Y=40
      doc.text(`Status: ${status}`, pageWidth - 100, 50); // Right-aligned at position X=pageWidth - 60, Y=40

      // Define the table columns
      const columns = [
        { header: 'S.No', dataKey: 'sno' },
        // { header: 'SR', dataKey: 'sr' },
        { header: 'Code', dataKey: 'itemcode' },
        { header: 'Item', dataKey: 'itemname' },
        { header: 'Batch No', dataKey: 'batchno' },
        { header: 'Exp Dt', dataKey: 'expdate' },
        { header: 'Issue WH', dataKey: 'issuewh' },
        { header: 'Absrqty', dataKey: 'absrqty' },
        { header: 'Batrch Receipt Qty', dataKey: 'batrchreceiptqty' },
        { header: 'Rstatus', dataKey: 'rstatus' },
      ];

      // Prepare the rows for the table
      const rows = filteredItems.map((item, index) => ({
        sno: index + 1,
        // sr: item.sr,
        itemcode: item.itemcode,
        itemname: item.itemname,
        batchno: item.batchno,
        expdate: item.expdate,
        issuewh: item.issuewh,
        absrqty: item.absrqty,
        batrchreceiptqty: item.batrchreceiptqty,
        rstatus: item.rstatus,
        // strengtH1: item.strengtH1,
        // whindentQTY: item.whindentQTY
      }));

     
// Step 6: Use the autoTable method
autoTable(doc, {
  head: [columns.map(col => col.header)], // Add headers from columns
  body: rows.map(row => Object.values(row)), // Map row values in order
  theme: 'grid',
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

    // const footerText = `Contact Person: ${contactpersonname}, Phone: ${phonE1}`;
    
    // doc.text(footerText, pageWidth - doc.getTextWidth(footerText) - 10, pageHeight - 10);
    const footerText = [
      'Incharge', // First line
      `Name: ${contactpersonname}`, // Second line
      `Mob: ${phonE1}` // Third line
    ];
    
    // Adjust X and Y positions for the text
    doc.text(footerText, pageWidth - doc.getTextWidth('Mob: ' + phonE1) - 20, pageHeight - 20); 
    
  }
});

// Step 7: Save the PDF
doc.save('Receipt-Details.pdf');
    },
    (error) => {
      console.error('Error fetching data', error);
      this.spinner.hide();
    }
  );
}
}
