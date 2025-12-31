import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReceiptDetails } from 'src/app/Model/ReceiptDetails';
import { ReceiptMasterFromWH } from 'src/app/Model/ReceiptMasterFromWH';
import { ReceiptVouchers } from 'src/app/Model/ReceiptVouchers';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { CommonModule } from '@angular/common';
import { OtherFacIssueDetails } from 'src/app/Model/OtherFacIssueDetails';
import { ReceiptDetailsBatch } from 'src/app/Model/ReceiptDetailsBatch';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipt-from-other-facility',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt-from-other-facility.component.html',
  styleUrl: './receipt-from-other-facility.component.css'
})
export class ReceiptFromOtherFacilityComponent {
  receiptMasterFromWH:OtherFacIssueDetails[]=[];
  facid=sessionStorage.getItem('facilityId');
  receiptdetails:OtherFacIssueDetails[]=[];
  nocid:any
  receiptVouchers:ReceiptDetailsBatch[]=[]
  status:any='I';
  parentfac=sessionStorage.getItem('parentfac');
  districtname=sessionStorage.getItem('districtname');
  contactpersonname=sessionStorage.getItem('contactpersonname');
  phonE1=sessionStorage.getItem('phonE1');
  facreceiptid:any

  constructor(public datePipe: DatePipe,private router:Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private http: HttpClient,private cdr: ChangeDetectorRef,private toastr: ToastrService,
  
     
    ) {
    }
  ngOnInit(): void {
    this.getOtherFacIssueDetails(this.status)    
  }
getOtherFacIssueDetails(status:any){
  this.spinner.show();
this.api.getOtherFacIssueDetails(this.facid,status,0,0).subscribe((res:OtherFacIssueDetails[])=>{
  this.receiptMasterFromWH = res.map((item, index) => ({
    ...item,
    sno: index + 1
  }));
  // console.log(res)
  
  
  this.spinner.hide();
  this.cdr.detectChanges();

},
(error)=>{
  alert(error);
  this.spinner.hide();
}

)
}
getStatusText(status: any): string {
  switch (status) {
    case 'I':
      return 'Incomplete';
    case 'C':
      return 'Completed';
    default:
      return status;
  }
}
receiptEntry(item:any){
  
  
  // const whid=item.warehouseid
  const facid=this.facid
  const tofacilityid=item.facilityid;
  const facindentid=item.facindentid
  const issueid=item.issueid
  const  facreceiptdate=item.facreceiptdate
  
  if(facreceiptdate !=null){
    this.api.getOtherFacIssueDetails(this.facid,this.status,0,0).subscribe((res: OtherFacIssueDetails[]) => {
      this.receiptdetails = res;
  
      // Extract the values you need from the response
      this.facreceiptid=res[0].facreceiptid
      const facreceiptid = res[0].facreceiptid;
      const reqno = res[0].indentno;
      const reqdate = res[0].indentdate;
      const whissueno = res[0].issueno;
      const whissuedt = res[0].issueddate;
      const facreceiptno = res[0].facreceiptno;
      const facreceiptdate = res[0].facreceiptdate;
      const status = res[0].status;
      const issueid = res[0].issueid;
      const facindentid = res[0].facindentid;
      const facilityname=res[0].facilityname;
      
  
      // Navigate and pass the values using queryParams
      this.router.navigate(['otherfac-receipt-batches'], {
        queryParams: {
          facilityname:facilityname,
          facreceiptid: facreceiptid,
          reqno: reqno,
          reqDate: reqdate,
          wHIsueNo: whissueno,
          wHIsueDT: whissuedt,
          receiptnumber: facreceiptno,
          receiptdate: facreceiptdate,
          status:status,
          issueid:issueid,
          facindentid:facindentid

        }
      });
    });
  }
  
  else{

    this.router.navigate(['receipt-date-entry-otherfacility'], { queryParams: {tofacilityid,facid,facindentid,issueid } });
  }
}
backbutton(){
  this.router.navigate(['receipt-from-warehouse']);

}
deleteReceipt(receiptid:any){
  
  this.api.deleteReceipts(receiptid).subscribe((res:any)=>{
    alert(res)
    // console.log(res);
    this.getOtherFacIssueDetails(this.status)    


  },
    (error)=>{
      this.toastr.error('Something went wrong :( ');

      console.log(error);
    }
  )

}
printReceiptVoucher(item:any){

  const reqDate = item.indentdate;
  const reqno = item.indentno;
  const wHIsueNo = item.indentno;
  const wHIsueDT = item.issueddate;
  const receiptnumber = item.facreceiptno;
  const receiptdate = item.facreceiptdate;
  const status1=item.status;
  const status = status1 === 'C' ? 'Completed' : 'Incomplete';

  // Fetch data from the API

  this.api.getReceiptDetailsBatchSP(item.facreceiptid,this.facid,item.facindentid).subscribe(
    
    (res: ReceiptDetailsBatch[]) => {
      // Map and assign the received data to the component variable
      this.receiptVouchers = res.map((item, index) => ({
        ...item,
        sno: index + 1,
      }));

      // Filter items with requested quantity > 0
      const filteredItems = this.receiptVouchers.filter(
        item => item.rqty > 0
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
      const dateString = this.datePipe.transform(now.toLocaleDateString(), 'dd-MM-yyyy') || '';
      const timeString = now.toLocaleTimeString();

      // Set up title and additional information
      const title = 'Facility: ' + (sessionStorage.getItem('firstname') || 'Other Fac Details');

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
  
      doc.text(`From Facility: ${this.parentfac}`, 30, 30); // Left-aligned at position X=30, Y=30
      doc.text(`District: ${this.districtname}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
      doc.text(`Indent DT: ${reqDate}`, 30, 40); // Left-aligned at position X=30, Y=40
      doc.text(`Indent No: ${reqno}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 100, Y=40
      doc.text(`Issue No: ${wHIsueNo}`, 30, 50); // Right-aligned at position X=pageWidth - 100, Y=40
      doc.text(`Issued DT: ${wHIsueDT}`, pageWidth - 100, 50); // Right-aligned at position X=pageWidth - 100, Y=40
      doc.text(`Receipt No: ${receiptnumber}`, 30, 60); // Right-aligned at position X=pageWidth - 100, Y=40
      doc.text(`Received DT: ${receiptdate}`, pageWidth - 100, 60); // Right-aligned at position X=pageWidth - 100, Y=40
      doc.text(`Status: ${status}`, 30, 70); // Right-aligned at position X=pageWidth - 100, Y=50

      // Define the table columns
  // Step 4: Define the table columns
  const columns = [
    { header: 'S.No', dataKey: 'sno' },
    // { header: 'SR', dataKey: 'sr' },
    { header: 'Code', dataKey: 'itemcode' },
    { header: 'Type', dataKey: 'itemtypename' },
    { header: 'Item', dataKey: 'itemname' },
    { header: 'Strength', dataKey: 'strengtH1' },
    { header: 'Issued from Facility', dataKey: 'issuewh' },
    { header: 'Batch', dataKey: 'batchno' },
    { header: 'Mfg Dt', dataKey: 'mfgdate' },
    { header: 'Exp Dt', dataKey: 'expdate' },
    // { header: 'Multiple', dataKey: 'multiple' },
    // { header: 'Unit Count', dataKey: 'unitcount' },
    { header: 'Received QTY', dataKey: 'rqty' }
  ];

      // Prepare the rows for the table
      const rows = filteredItems.map((item, index) => ({
        sno: index + 1,
        // sr: item.sr,
        itemcode: item.itemcode,
        itemtypename: item.itemtypename,
        itemname: item.itemname,
        strengtH1: item.strengtH1,
        issuewh: item.issuewh,
        batchno: item.batchno,
        mfgdate: item.mfgdate,
        expdate: item.expdate,
        // multiple: item.multiple,
        // unitcount: item.unitcount,
        indentqty: item.rqty
      }));

     
// Step 6: Use the autoTable method
autoTable(doc, {
  head: [columns.map(col => col.header)], // Add headers from columns
  body: rows.map(row => Object.values(row)), // Map row values in order
  theme: 'grid',
  margin: { top: 75 }, // Adjusted margin top for title and indent details
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
doc.save('Received_voucher_otherfac.pdf');
    },
    (error) => {
      this.toastr.error('Something went wrong :( ');

      console.error('Error fetching data', error);
      this.spinner.hide();
    }
  );
}
}
