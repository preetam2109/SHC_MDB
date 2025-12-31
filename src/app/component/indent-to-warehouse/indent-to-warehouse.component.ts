import { ChangeDetectorRef, Component,OnInit} from '@angular/core';
import { FacMonthIndent } from 'src/app/Model/FacMonthIndent';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { Router } from '@angular/router';
import { SavedFacIndentItems } from 'src/app/Model/SavedFacIndentItems';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-indent-to-warehouse',
  templateUrl: './indent-to-warehouse.component.html',
  styleUrls: ['./indent-to-warehouse.component.css']
})
export class IndentToWarehouseComponent implements OnInit {
  FacMonthIndentReport: FacMonthIndent[] = [];
  facid=sessionStorage.getItem('facilityId');
  savedFacIndentItems:SavedFacIndentItems[]=[]
  parentfac=sessionStorage.getItem('parentfac');
  districtname=sessionStorage.getItem('districtname');
  contactpersonname=sessionStorage.getItem('contactpersonname');
  phonE1=sessionStorage.getItem('phonE1');

  firstindentopening:any;
  firstindentclosing:any;
  indentopeningdate:any;
  indentclosingdate:any;
  regularopeningcase:any;



  
  
  constructor(private toastr: ToastrService,private router:Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private http: HttpClient,private cdr: ChangeDetectorRef,
    public datePipe: DatePipe) {
  }


  ngOnInit(): void {
    this.getFacMonthIndentReport()  
    this.getIndentTimline()
  }
  

  getStatusText(status: any): string {
    switch (status) {
      case 'P':
        return 'Pending For Approval';
      case 'I':
        return 'Incomplete';  
      case 'C':
        return 'Approved';
      default:
        return status;
    }
  }
  IndentGenStatus(status: any): string {
    // 
    switch (status) {
      case 0:
        return 'Close';
      case 1:
        return 'Open';
      default:
        return status;
    }
  }
  getIndentTimline(){
    this.api.getIndentTimline(this.facid,0).subscribe((res:any)=>{
      this.firstindentopening=res[0].firstindentopening;
      this.firstindentclosing=res[0].firstindentclosing
      this.indentopeningdate=res[0].indentopeningdate
      this.indentclosingdate=res[0].indentclosingdate
      this.regularopeningcase=res[0].regularopeningcase
      // console.log('IndentTimline',res);

    })
  }

  getFacMonthIndentReport() {
    
    this.spinner.show();
    this.api.getFacMonthIndent(this.facid,'A').subscribe(
      (res:FacMonthIndent[])=> {
        this.FacMonthIndentReport = res.map((item, index) => ({
          ...item,
          sno: index + 1
        }));
        console.log('indent id check',res)
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }
  
  AddNewIndent(){
    
    if(this.regularopeningcase===1){
      if(this.getIncompleteCount()===1){
        alert('कृपया Incomplete indent को पहले Complete/Delete करें ।');

      }else{
      this.router.navigate(['/add-new-indent'])

      }
      // this.router.navigate(['/add-new-indent'])

    }
    else{
      alert('पैरेंट फैसिलिटी को इंडेंट करने की समयसीमा समाप्त हो चुकी है। कृपया संबंधित PHC/CHC को इंडेंट कर दवा प्राप्त करें।')

    }
    // if(this.getIncompleteCount()<=1 && this.regularopeningcase==='1'){

    //   this.router.navigate(['/add-new-indent'])
    // }else if(this.regularopeningcase==='0'){
    // }

    // else{
    // }
  }
    // Method to calculate the number of incomplete statuses
    getIncompleteCount(): number {
      return this.FacMonthIndentReport.filter(item => item.istatus === 'I').length;
    }
  WarehouseIndent(item: any) {
    //write logic 
    const reqDate = item.reqDate;
    const reqno = item.reqno;
   const nocid=item.nocid; 

   if(this.regularopeningcase===1){
    this.router.navigate(['/warehouse-indent'], { queryParams: { reqDate, reqno, nocid } });

   }
   else{
    // this.router.navigate(['/add-new-indent'])
    alert('पैरेंट फैसिलिटी को इंडेंट करने की समयसीमा समाप्त हो चुकी है। कृपया संबंधित PHC/CHC को इंडेंट कर दवा प्राप्त करें।')

    }
    // this.ro            uter.navigate(['/add-new-indent'])

  


  }


  deleteIndent(nocid:any){
    this.spinner.show();
    this.api.deleteIndent(nocid).subscribe((res:any)=>{
      alert(res);
      this.getFacMonthIndentReport()  
      this.spinner.hide();
    },
    (error)=>{
      this.spinner.hide();

      console.log("Error while deleting ",error)

    }
    );
  }


  printINdent(item: any) {
    
    const reqDate = item.reqDate;
    const reqno = item.reqno;
    const nocid = item.nocid;
    const status1=item.istatus;
    const status = status1 === 'C' ? 'Completed' : 'Incomplete';
  
    // Fetch data from the API
    this.api.getSavedFacIndentItems(nocid).subscribe(
      (res: SavedFacIndentItems[]) => {
        // Map and assign the received data to the component variable
        this.savedFacIndentItems = res.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
  
        // Filter items with requested quantity > 0
        const filteredItems = this.savedFacIndentItems.filter(
          (item) => item.whindentQTY > 0
        );
  
        // Check if filtered items are available
        if (filteredItems.length === 0) {
          console.warn('No items found with requested quantity greater than 0');
          this.toastr.info('No data found !');
          return; // Exit if no data
        }
  
        // Initialize a new jsPDF instance
        const doc = new jsPDF('l', 'mm', 'a4');
  
        // Get current date and time
        const now = new Date();
        const dateString = this.datePipe.transform(now, 'dd-MM-yyyy') || '';
        const timeString = now.toLocaleTimeString();
  
        // Set up title and additional information
        // const title ='Warehouse - Indent'  
        const title ='Parent Facility - Indent'  
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
        doc.text(`Facility: ${sessionStorage.getItem('firstname')}`, 30, 30); // Left-aligned at position X=30, Y=30
        doc.text(`Parent Facility: ${this.parentfac}`, 30, 40); // Left-aligned at position X=30, Y=30
        doc.text(`District: ${this.districtname}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
        doc.text(`Indent Date: ${reqDate}`, 30, 50); // Left-aligned at position X=10, Y=30
        doc.text(`Indent No: ${reqno}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 60, Y=30
  
        // doc.text(`Noc Id: ${nocid}`, 30, 50); // Left-aligned at position X=10, Y=40
        doc.text(`Status: ${status}`, pageWidth - 100, 50); // Right-aligned at position X=pageWidth - 60, Y=40
  
        // Define the table columns
        const columns = [
          { header: 'S.No', dataKey: 'sno' },
          // { header: 'SR', dataKey: 'sr' },
          { header: 'Code', dataKey: 'itemcode' },
          { header: 'Item Type', dataKey: 'itemtypename' },
          { header: 'Item', dataKey: 'itemname' },
          { header: 'Strength', dataKey: 'strengtH1' },
          { header: 'Indented Qty', dataKey: 'whindentQTY' }
        ];
  
        // Prepare the rows for the table
        const rows = filteredItems.map((item, index) => ({
          sno: index + 1,
          // sr: item.sr,
          itemcode: item.itemcode,
          itemtypename: item.itemtypename,
          itemname: item.itemname,
          strengtH1: item.strengtH1,
          whindentQTY: item.whindentQTY
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
  doc.save('Indent-Details.pdf');
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }
  

// getsavedFacIndentItems() {
  //   this.spinner.show();
  //   this.api.getSavedFacIndentItems(this.facid).subscribe(
  //     (res:any)=> {
  //       this.FacMonthIndentReport = res.map((item, index) => ({
  //         ...item,
  //         sno: index + 1
  //       }));
  //       console.log(res)
  //       this.spinner.hide();
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.error('Error fetching data', error);
  //       this.spinner.hide();
  //     }
  //   );
  // }


}
