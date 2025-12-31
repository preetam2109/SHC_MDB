import { AfterViewInit, ChangeDetectorRef, Component,ElementRef,OnInit, ViewChild} from '@angular/core';
import { FacMonthIndent } from 'src/app/Model/FacMonthIndent';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { Router } from '@angular/router';
import { SavedFacIndentItems } from 'src/app/Model/SavedFacIndentItems';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IncompleteWardIssue } from 'src/app/Model/IncompleteWardIssue';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { WIssueMaster } from 'src/app/Model/WIssueMaster';
import { LastIssueDT } from 'src/app/Model/LastIssueDT';
import { IssueVoucherPdf } from 'src/app/Model/IssueVoucherPdf';
@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent {
  FacMonthIndentReport: IncompleteWardIssue[] = [];
  FacMonthIndentReportStatusCheck: IncompleteWardIssue[] = [];
  facid=sessionStorage.getItem('facilityId');
  savedFacIndentItems:SavedFacIndentItems[]=[]
  parentfac=sessionStorage.getItem('parentfac');
  districtname=sessionStorage.getItem('districtname');
  contactpersonname=sessionStorage.getItem('contactpersonname');
  phonE1=sessionStorage.getItem('phonE1');
  status='I'
  LastConsuptionDate!:any |null
  showError: boolean = false;
  issueVoucherPdf:IssueVoucherPdf[]=[]
  hasIncompleteItems: boolean = false;





  isModalOpen = false;
  selectedOption: any;
  selectedDate: any 
  todayDate: string = '';
  wrequestdate: string | undefined;
  wrequestby: string | undefined;


  resetInputs() {
    this.selectedOption = null;  // Reset radio button selection
    this.selectedDate = null;     // Reset date input
    this.wrequestby = '';         // Reset remarks input
    this.showError = false;       // Reset error messages
  }
  
  openPopup() {
    

      this.isModalOpen = true;
  }

  closePopup() {
    this.isModalOpen = false;
    this.resetInputs();
  }

  submit() {
    
// 
    
    // console.log('Selected Option:', this.selectedOption);
    // console.log('Selected Date:', this.selectedDate);
    const facid = sessionStorage.getItem('facilityId'); // Assuming facid is a constant
    // const url = `https://dpdmis.in//FourthTierDpdmisAPI/api/api/issue/postIssueNo?facid=${facid}`;

    const wIssueMaster : WIssueMaster ={
      issueid: 0, // It's auto-generated
      facilityid: facid, // Value from route params
      //issueno: "123",
      issuedate: this.selectedDate, // Stock quantity

      // issueddate: this.todayDate,
      
      wrequestdate: this.selectedDate,
      wrequestby: this.wrequestby, // Allotted quantity (same as issueQty)
      // isuseapp: 'Y',
      // issuetype: "NO", // Issue quantity
      wardid: this.selectedOption,
    };

    this.api.postIssueNo(facid,wIssueMaster).subscribe(
      (response:any) => {
        // console.log('Success:', response);
        // alert("Success")
        // this.router.navigate(['indent-to-warehouse'])

        this.closePopup();
        this.getFacMonthIndentReport(this.status) 

        // Add your logic to handle the form submission

      },
      (error) => {
        console.error('Error:', error);
        this.closePopup();
        
        // Handle error, e.g., show an error message
      }
    );



   
  }





  
  
  constructor(private router:Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private http: HttpClient,private cdr: ChangeDetectorRef,
     
  ) {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }


  ngOnInit(): void {
  this.getFacMonthIndentReport(this.status) 
  this.GetLastIssueDT() 
  }

  GetLastIssueDT(){
    
    this.api.getLastIssueDT(this.facid).subscribe((res:LastIssueDT[])=>{
// console.log(res)
if(res[0].issuedate===null){

  this.LastConsuptionDate='NA'
}else{
  this.LastConsuptionDate=res[0].issuedate
}
      // alert(this.LastConsuptionDate)


    },
    (error)=>{
      
      alert("Something Went Wrong !")
    }
  )
  }
  

  getStatusText(status: any): string {
    switch (status) {
      case 'I':
        return 'Incomplete';
      case 'IN':
        return 'Incomplete';  
      case 'C':
        return 'Completed';
      default:
        return status;
    }
  }
  validateInputs() {
    
    this.showError = false; // Reset error state
  
    const isDateFuture = this.isFutureDate(this.selectedDate);
    const isBeforeLastConsumption = this.isBeforeLastConsumptionDate(this.selectedDate);
    
    
    if (!this.selectedOption || !this.selectedDate || isDateFuture || !this.wrequestby || isBeforeLastConsumption) {
      this.showError = true; // Show errors if any input is invalid
      return; // Prevent submission
    }
    
  
    // All inputs are valid, proceed with your logic (e.g., submit the form)
    this.submit(); // Call your submit method here
  }
   // Validate if the selected date is before the last consumption date
   isBeforeLastConsumptionDate(selectedDate: string): boolean {
    const selected = new Date(selectedDate);
    const lastConsumption = new Date(this.LastConsuptionDate); // Convert lastConsumptionDate to Date
    return selected < lastConsumption;
  }

  // Combined validation
  validateDate(): void {
    if (!this.selectedDate || this.isFutureDate(this.selectedDate) || this.isBeforeLastConsumptionDate(this.selectedDate)) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  isFutureDate(dateString: string): boolean {
    const selectedDate = new Date(dateString);
    const today = new Date();
    return selectedDate > today; // Check if selected date is in the future
  }

  getFacMonthIndentReport(status:any) {

    if(status==='C'){

      this.spinner.show();
      this.api.getIncompleteWardIssue(this.facid,status,0).subscribe(
        (res:IncompleteWardIssue[])=> {
          this.FacMonthIndentReport = res.map((item, index) => ({
            ...item,
            sno: index + 1
          }));
          // console.log(res)
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching data', error);
          this.spinner.hide();
        }
      );

    }else{

      this.spinner.show();
      this.api.getIncompleteWardIssue(this.facid,status,0).subscribe(
        (res:IncompleteWardIssue[])=> {
          this.FacMonthIndentReport = res.map((item, index) => ({
            ...item,
            sno: index + 1
          }));
          this.FacMonthIndentReportStatusCheck = res.map((item, index) => ({
            ...item,
            sno: index + 1
          }));
          // console.log(res)
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching data', error);
          this.spinner.hide();
        }
      );

    }



   


  }
  
  AddNewIndent(){
    if(this.getIncompleteCount()<=1){

      this.router.navigate(['/add-new-indent'])
    }else{
      alert('Cannot add new indent. More than 1 incomplete indent exists.');
    }
  }
    // Method to calculate the number of incomplete statuses
    getIncompleteCount(): number {
      return this.FacMonthIndentReportStatusCheck.filter(item => item.status === 'IN').length;
    }
  WarehouseIndent(item: any) {
    
    // const reqDate = item.reqDate;
    // const reqno = item.reqno;
  //  const nocid=item.nocid; 
   const issueid=item.issueid;
   const wardname=item.wardname;
   const issueno=item.issueno;
   const issuedate=item.issuedate;
    this.router.navigate(['/wardIssue'], { queryParams: { wardname, issueno, issuedate,issueid } });
  }


  deleteIndent(issueid:any){
    this.spinner.show();
    this.api.deleteWardIssues(issueid).subscribe((res:any)=>{
      // alert(res);
      this.getFacMonthIndentReport(this.status)  
      this.spinner.hide();
    },
    (error)=>{
      console.log("Error while deleting ",error)

    }
    );
  }


  printINdent(item: any) {
    
    const issueid=item.issueid;
    const wardname = item.wardname;
    const issueno = item.issueno;
    const issuedate = item.issuedate;
    const status1=item.status;
    const status = status1 === 'C' ? 'Completed' : 'Incomplete';
  
    // Fetch data from the API
    this.api.getIssueVoucherPdf(issueid).subscribe(
      (res: IssueVoucherPdf[]) => {
        // Map and assign the received data to the component variable
        this.issueVoucherPdf = res.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
  
        // Filter items with requested quantity > 0
        const filteredItems = this.issueVoucherPdf.filter(
          (item) => item.facissueqty > 0
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
        const dateString = now.toLocaleDateString();
        const timeString = now.toLocaleTimeString();
  
        // Set up title and additional information
        const title =
          'Facility: ' + (sessionStorage.getItem('firstname') || 'Consuption Details');
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
        doc.text(`Ward Name: ${wardname}`, 30, 30); // Left-aligned at position X=30, Y=30
        doc.text(`Issue No: ${issueno}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
        doc.text(`Issued Date: ${issuedate}`, 30, 40); // Left-aligned at position X=10, Y=40
        doc.text(`Status: ${status}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 60, Y=40
        // doc.text(`Indent Date: ${wardname}`, 30, 40); // Left-aligned at position X=10, Y=30
        // doc.text(`Indent No: ${issueno}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 60, Y=30
  
  
        // Define the table columns
        const columns = [
          { header: 'S.No', dataKey: 'sno' },
          { header: 'Wardname', dataKey: 'wardname' },
          { header: 'Code', dataKey: 'itemcode' },
          { header: 'Item', dataKey: 'itemname' },
          { header: 'Strength', dataKey: 'strengtH1' },
          // { header: 'Item Type', dataKey: 'itemtypename' },
          { header: 'Issue QTY', dataKey: 'facissueqty' },
          { header: 'Mfg Dt', dataKey: 'mfgdate' },
          { header: 'Exp Dt', dataKey: 'expdate' },
          { header: 'Status', dataKey: 'status' }
        ];
  
        // Prepare the rows for the table
        const rows = filteredItems.map((item, index) => ({
          sno: index + 1,
          wardname: item.wardname,
          itemcode: item.itemcode,
          itemname: item.itemname,
          strengtH1: item.strengtH1,
          facissueqty: item.facissueqty,
          mfgdate: item.mfgdate,
          expdate: item.expdate,
          status: item.status

          // itemtypename: item.itemtypename,
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
  doc.save('Consuption-Details.pdf');
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
