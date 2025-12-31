import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetHeaderInfo } from 'src/app/Model/GetHeaderInfo';
import { OpeningStock } from 'src/app/Model/OpeningStock';
import { OpstockCheck } from 'src/app/Model/OpstockCheck';
import { ReceiptById } from 'src/app/Model/ReceiptById';
import { ReceiptID } from 'src/app/Model/ReceiptID';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { SharedService } from 'src/app/service/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opening-stock-status',
  templateUrl: './opening-stock-status.component.html',
  styleUrls: ['./opening-stock-status.component.css']
})
export class OpeningStockStatusComponent {
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
  stocks: GetHeaderInfo[]=[]
  receiptbyId:ReceiptById[]=[]
  receiptID: any = 0;
  facilityName=sessionStorage.getItem('firstname')
  usrFacilityID:any=sessionStorage.getItem('facilityId');
opstockCheckvar:OpstockCheck[]=[];
isgeneratedInitial:any=false;


  constructor(private route: ActivatedRoute,public datePipe: DatePipe,private spinner: NgxSpinnerService,public router:Router,public api: ApiServiceService,private sharedService: SharedService) { }

  ngOnInit(): void {
    

//     this.route.queryParams.subscribe((params) => {
// 
//       if(params['isgenerated']!==undefined){
        
//         this.isgeneratedInitial = params['isgenerated'];
//       }
      


      

//     });
   
    
      this.api.getOpstockCheck(sessionStorage.getItem('facilityId')).subscribe((res:OpstockCheck[])=>{
        
        this.opstockCheckvar=res[0].opreceiptid;
        // console.log('check status ',res[0].stauts)
        // console.log('check status ',res[0].opreceiptid)
        // console.log('check status ',res[0])

        if(res[0].opreceiptid===0 && res[0].stauts==='0'){


        }else if(res[0].stauts==='I' && res[0].opreceiptid===0){

          this.getFacreceiptid(() => {
            this.getHeaderInfo();
          });
        }

        else{


          this.getFacreceiptid(() => {
            this.getHeaderInfo();
          });

        }
  
      }
    )
  
    // this.spinner.show()

   
   
    
  }
 

  getRowLength(): number {
    // 
    // console.log(this.stocks.length)
    return this.stocks ? this.stocks.length : 0;
      // Check if stocks is defined
  }
  GeneratePage(){
    
    this.router.navigate(['OpStock'])
  }
  getFacreceiptid(callback: () => void){
    
    
    this.api.getFacreceiptid(this.usrFacilityID).subscribe((res:ReceiptID[])=>{
      
      // console.log("receiptID is  ",JSON.stringify(res))

      this.receiptID= res[0].facreceiptid;
      // console.log(this.receiptID)
      this.sharedService.setReceiptID(this.receiptID);
      // let aaa=this.sharedService.setReceiptID(this.receiptID);
      // let bbb = this.sharedService.getReceiptID();
      // console.log('asdf',bbb);
      // sessionStorage.setItem('receiptID', this.receiptID);
      // this.receiptID=JSON.stringify(res.facreceiptid);
      // alert(this.receiptID)
      callback();
    })
  }

  getHeaderInfo(): void {
    
   // this.receiptID = localStorage.getItem('receiptID');
   //  let hello =this.sharedService.getReceiptID();
   //  console.log('dgfgfgf',hello)
   //  sessionStorage.getItem('receiptID');
  //  this.spinner.show()
   if (this.receiptID) {
     this.api.getHeaderInfo(this.receiptID).subscribe(
       (res: GetHeaderInfo[]) => {
         if (res.length > 0) {
           this.stocks = res;
          //  console.log('get header info ',JSON.stringify(res))
          //  this.spinner.hide();
          //  this.receiptNo = this.header.facreceiptno;
         } else {
           console.error('No data returned from API');
         }
       },
       (error: any) => {
         console.error(error);
         this.spinner.hide();

       }
     );
   }
 }
 getRouterLink(status: any){
  
  if (status === 'C') {
    this.router.navigate(['/OpStocksR']);  // URL for completed status
  }else {
    // this.router.navigate(['/DefaultPage']);  // Default URL or handle other statuses
    this.router.navigate(['/OpStock']);  // URL for incomplete status

  }
}

freezeStock() {
  // Show the confirmation dialog
  

  Swal.fire({
    title: 'Are you sure?',
    text: "ओपनिंग स्टॉक विवरण को फ्रीज करना चाहते हैं, क्योंकि फ़्रीज़ होने के पश्चात सुधार संभव नहीं है?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, freeze it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    // Check if the user clicked the "Yes" button
    if (result.isConfirmed) {
      // Proceed with freezing the stock
      this.spinner.show();
      this.api.freezeOpeningStock(this.receiptID).subscribe(
        res => {
          Swal.fire(
            'Success!',
            'ओपनिंग स्टॉक विवरण सफलतापूर्वक फ़्रीज़ कर दिया गया! \n Opening Stock Details Freezed Sucessfully!',
            'success'
          );
          JSON.stringify('freeze stock response' + res);
          this.getFacreceiptid(() => {
            this.getHeaderInfo();
          });
          this.spinner.hide();

        },
        (error: any) => {
          console.error(error);
          Swal.fire(
            'Error!',
            'There was an error freezing the stock details.',
            'error'
          );
          this.spinner.hide();

        }
      );
    }
  });
}

printOpeningStockReport(item:any){
  
  const facreceiptno = item.facreceiptno;
  const facreceiptdate =item.facreceiptdate;


  // const wHIsueNo = item.whissueno;
  // const wHIsueDT = item.whissuedt;
  // const receiptnumber = item.facreceiptno;
  // const receiptdate = item.facreceiptdate;
  const status1=item.status;
  const status = status1 === 'C' ? 'Completed' : 'Incomplete';

  // Fetch data from the API
  this.api.getReceiptById(this.usrFacilityID,item.facreceiptid).subscribe(
    (res: ReceiptById[]) => {
      // Map and assign the received data to the component variable
      this.receiptbyId = res.map((item, index) => ({
        ...item,
        sno: index + 1,
      }));

      // Filter items with requested quantity > 0
      const filteredItems = this.receiptbyId.filter(
        (item) => parseInt(item.batrchreceiptqty) > 0
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
      const header='Opening Stock Details'
      const title = 'Facility: ' + (sessionStorage.getItem('firstname') || 'Opening Stock');  
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
      doc.setFontSize(10);
      doc.text(`Date: ${dateString} Time: ${timeString}`, 10, 10); // Date/Time at position X=10, Y=10

      // Add indent details (Left and right aligned)
      doc.setFontSize(12);
      doc.text(`Opening Stock No: ${facreceiptno}`, 30, 30); // Left-aligned at position X=30, Y=30
      // doc.text(`Indent Date: ${reqDate}`, 30, 40); // Left-aligned at position X=30, Y=30
      doc.text(`Opening Stock Date: ${facreceiptdate}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
      // doc.text(`WH Issue Date: ${wHIsueDT}`, 30, 50); // Left-aligned at position X=10, Y=30
      // doc.text(`Receipt No: ${receiptnumber}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 60, Y=30
      // doc.text(`Receipt Dt: ${receiptdate}`, 30, 58); // Left-aligned at position X=10, Y=30

      // doc.text(`Noc Id: ${nocid}`, 30, 50); // Left-aligned at position X=10, Y=40
      doc.text(`Status: ${status}`, 30, 40); // Right-aligned at position X=pageWidth - 60, Y=40

      // Define the table columns
      const columns = [
        { header: 'S.No', dataKey: 'sno' },
        // { header: 'SR', dataKey: 'sr' },
        { header: 'Code', dataKey: 'itemcode' },
        { header: 'Item', dataKey: 'itemname' },
        { header: 'Strength', dataKey: 'strength' },
        { header: 'Batch No', dataKey: 'batchno' },
        { header: 'Batch Qty', dataKey: 'batrchreceiptqty' },
        { header: 'Mfg DT', dataKey: 'mfgdate' },
        { header: 'Exp DT', dataKey: 'expdate' },
        // { header: 'Issue WH', dataKey: 'issuewh' },
        // { header: 'Absrqty', dataKey: 'absrqty' },
        // { header: 'Status', dataKey: 'rstatus' },
      ];

      // Prepare the rows for the table
      const rows = filteredItems.map((item, index) => ({
        sno: index + 1,
        // sr: item.sr,
        itemcode: item.itemcode,
        itemname: item.itemname,
        strength: item.strength,
        batchno: item.batchno,
        batrchreceiptqty: item.batrchreceiptqty,
        mfgdate: item.mfgdate,
        expdate: item.expdate,
        // issuewh: item.issuewh,
        // absrqty: item.absrqty,
        // rstatus: this.getStatusText(item.rstatus),
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
doc.save('OpeningStock.pdf');
    },
    (error) => {
      console.error('Error fetching data', error);
      this.spinner.hide();
    }
  );

}


}