import { ChangeDetectorRef, Component,OnInit} from '@angular/core';
import { FacMonthIndent } from 'src/app/Model/FacMonthIndent';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { Router } from '@angular/router';
import { SavedFacIndentItems } from 'src/app/Model/SavedFacIndentItems';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule, DatePipe } from '@angular/common';
import { OtherFacilityIndent } from 'src/app/Model/OtherFacilityIndent';
import { OtherFacDetails } from 'src/app/Model/OtherFacDetails';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHCitems } from 'src/app/Model/SHCitems';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-indent-to-otherfacility',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './indent-to-otherfacility.component.html',
  styleUrl: './indent-to-otherfacility.component.css'
})
export class IndentToOtherfacilityComponent {

  OtherFacilityIndentReport: OtherFacilityIndent[] = [];
  facid=sessionStorage.getItem('facilityId');
  savedFacIndentItems:SHCitems[]=[]
  parentfac=sessionStorage.getItem('parentfac');
  districtname=sessionStorage.getItem('districtname');
  contactpersonname=sessionStorage.getItem('contactpersonname');
  phonE1=sessionStorage.getItem('phonE1');

  firstindentopening:any;
  firstindentclosing:any;
  indentopeningdate:any;
  indentclosingdate:any;
  regularopeningcase:any;
  minDate: string; // Minimum date value to prevent past dates
  currentDate: string; // Default date value for the indent form

  isModalOpen = false;
  selectedOption: any=null;
  selectedDate: any 
  form: FormGroup;

  otherFacDetails:OtherFacDetails[]=[]
  selectedFacilityId: string | undefined;
  indentid:any
  selectedFacilityTypeId:any


  
  
  constructor (private fb: FormBuilder,private router:Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private http: HttpClient,private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public datePipe: DatePipe) {

      const today = new Date();
this.currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
this.minDate = this.currentDate; // Set the minimum date to today's date

this.form = this.fb.group({
  facilityid: [''], // Initialize facilityid control
  indentDt: [this.minDate] // Initialize other controls as needed
});
  }



  ngOnInit(): void {
    this.getOtherFacilityIndent()  
    this.getIndentTimline()
    this.OtherFacDetailsDropDown()
  }


//   postOtherFacilityIndent(){
//     this.api.postOtherFacilityIndent(this.facid,3333,1,this.minDate).subscribe((res:any)=>{

// console.log(res)        

//     },
//     (error)=>{
//         console.log(error)
//     }
//   )
//   }
// onItemSelect(event: any): void {
//   const selectedValue = event.target.value;
//   // console.log("Selected Facility ID:", selectedValue);
//   this.selectedFacilityId=selectedValue





  
// }
onItemSelect(event: any): void {
  const selectedValue = event.target.value;
  
  // Parse the JSON string back to an object
  const selectedItem = JSON.parse(selectedValue);

  // Extract the facility ID and facility type ID
  this.selectedFacilityId = selectedItem.facilityid;
  this.selectedFacilityTypeId = selectedItem.facilitytypeid;

  // console.log(" kaushal sir Selected Facility ID:", this.selectedFacilityId);
  // console.log(" kaushal sir Selected Facility Type ID:", this.selectedFacilityTypeId);
}


  submit() {
    

// const selectedFacilityId = this.form.get('facilityid')?.value;
// console.log("Selected Facility ID in submit:", selectedFacilityId);
    this.api.postOtherFacilityIndent(this.facid,this.selectedFacilityId,1,this.minDate,this.selectedFacilityTypeId).subscribe((res:any)=>{

      // console.log('Raw Response:', res);

    // Check if res is already parsed
    let parsedResponse;
    try {
      parsedResponse = typeof res[0] === 'string' ? JSON.parse(res) : res;
    } catch (error) {
      console.error('Error parsing response:', error);
      return;
    }

    // Extract values
    
    const values = parsedResponse?.result?.value;
    // console.log('Extracted Values:', values);

    if (values && values.length > 0) {
      const indentId = values[0]?.indentid;
      // console.log('Indent ID:', indentId);

      // Make the second API call
      this.api.postOtherFacilityIndent1(this.facid, this.selectedFacilityId, 1, this.minDate, indentId)
        .subscribe((secondRes: any) => {
          // console.log('Second Response:', secondRes);
        });
    } 
      // this.indentid=res.result.value[0].indendid
      // if(this.indentid>0 && this.selectedFacilityTypeId!=377 ){
      //     this.api.postOtherFacilityIndent1(this.facid,this.selectedFacilityId,1,this.minDate,this.indentid).subscribe((res:any)=>{

      //     })
      // }
      
      this.closePopup(); 
    this.getOtherFacilityIndent()  

      
          },
          (error:any)=>{
              console.log(error)
              this.toastr.info(error.message);
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
  IndentGenStatus(status: any): string {
    
    switch (status) {
      case '0':
        return 'Close';
      case '1':
        return 'Open';
      default:
        return status;
    }
  }


  OtherFacDetailsDropDown(){
    
    // 
    this.spinner.show();

    this.api.getBlockFac(this.facid).subscribe(
      (BlockFac: OtherFacDetails[]) => {
        this.otherFacDetails = BlockFac;
        this.spinner.hide();
        
      },

      error => {
        console.error(error);
        this.spinner.hide();
        
      }
    );

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

  getOtherFacilityIndent() {
    
    this.spinner.show();
    this.api.getOtherFacilityIndent(this.facid).subscribe(
      (res:OtherFacilityIndent[])=> {
        this.OtherFacilityIndentReport = res.map((item, index) => ({
          ...item,
          sno: index + 1
        }));
        // console.log(' kaushal sir indent id check',res)
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
        this.toastr.info(error.message);


      }
    );
  }

  openPopup() {
    

    this.isModalOpen = true;
}

closePopup() {
  this.isModalOpen = false;
  // this.resetInputs();
}
  
  AddNewIndent(){
      this.router.navigate(['/add-new-indent'])
    
    // if(this.regularopeningcase==='1'){
    //   if(this.getIncompleteCount()===1){
    //   this.router.navigate(['/add-new-indent'])

    //     alert('कृपया Incomplete indent को पहले Complete करें ।');

    //   }else{
    //   this.router.navigate(['/add-new-indent'])

    //   }
    //   // this.router.navigate(['/add-new-indent'])

    // }
    // else{
    //   alert('वेयरहाऊस को इंडेंट करने की समयसीमा समाप्त हो चुकी है। कृपया संबंधित PHC/CHC को इंडेंट कर दवा प्राप्त करें।')

    // }
    // if(this.getIncompleteCount()<=1 && this.regularopeningcase==='1'){

    //   this.router.navigate(['/add-new-indent'])
    // }else if(this.regularopeningcase==='0'){
    // }

    // else{
    // }
  }
    // Method to calculate the number of incomplete statuses
    getIncompleteCount(): number {
      return this.OtherFacilityIndentReport.filter(item => item.status === 'I').length;
    }
  WarehouseIndent(item: any) {
    
    //write logic 
    const reqDate = item.indentdate;
    const reqno = item.indentno;
   const status=item.status;
   const facility=item.facilityname;
   const indentid=item.indentid; 
   const facilitytypeid=item.facilitytypeid; 

   this.router.navigate(['/other-facility-indentItems'], { queryParams: { reqDate, reqno, status,facility,indentid,facilitytypeid } });
  //  if(this.regularopeningcase==='1'){

  //  }
  //  else{
  //   // this.router.navigate(['/add-new-indent'])
  //   alert('वेयरहाऊस को इंडेंट करने की समयसीमा समाप्त हो चुकी है। कृपया संबंधित PHC/CHC को इंडेंट कर दवा प्राप्त करें।')

  //   }
    // this.router.navigate(['/add-new-indent'])

  


  }


  deleteIndent(indentid:any){
    
    this.spinner.show();
    this.api.deleteOtherFaceIdent(indentid).subscribe((res:any)=>{
      
      alert(res);
      
      this.getOtherFacilityIndent()  
      this.spinner.hide();
    },
    (error)=>{
      console.log("Error while deleting ",error)
      this.toastr.error('Something went wrong :( ');
      this.spinner.hide();

    }
    );
  }


  printINdent(item: any) {
    
    // console.log(item)
    const reqDate = item.indentdate;
    const reqno = item.indentno;
    const status1=item.status;
    const status = status1 === 'C' ? 'Completed' : 'Incomplete';
  
    // Fetch data from the API
    this.api.printOtherFacIndentDetails(item.indentid).subscribe(
      (res: SHCitems[]) => {
        // Map and assign the received data to the component variable
        this.savedFacIndentItems = res.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
  
        // Filter items with requested quantity > 0
        const filteredItems = this.savedFacIndentItems.filter(
          (item) => item.indentqty > 0
        );
  
        // Check if filtered items are available
        if (filteredItems.length === 0) {
          console.warn('No items found with indentqty quantity greater than 0');
          this.toastr.info('No items found !')
          return; // Exit if no data
        }
  
        // Initialize a new jsPDF instance
        const doc = new jsPDF('l', 'mm', 'a4');
  
        // Get current date and time
        const now = new Date();
        const dateString = this.datePipe.transform(now, 'dd-MM-yyyy') || '';
        const timeString = now.toLocaleTimeString();
  
        // Set up title and additional information
        const title ='Other Facility Indent '  
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
        // doc.text(`Facility: ${sessionStorage.getItem('firstname')}`, 30, 30); // Left-aligned at position X=30, Y=30
        doc.text(`Parent Facility: ${this.parentfac}`, 30, 30); // Left-aligned at position X=30, Y=30
        
        doc.text(`Indent No: ${reqno}`,  30, 40); // Right-aligned at position X=pageWidth - 60, Y=30
        doc.text(`District: ${this.districtname}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
        doc.text(`Indent Date: ${reqDate}`, 30, 50); // Left-aligned at position X=10, Y=30
        // doc.text(`Indent No: ${reqno}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 60, Y=30
        doc.text(`Facility: ${sessionStorage.getItem('firstname')}`,pageWidth - 100, 40); // Left-aligned at position X=30, Y=30

  
        // doc.text(`Noc Id: ${nocid}`, 30, 50); // Left-aligned at position X=10, Y=40
        doc.text(`Status: ${status}`, pageWidth - 100, 50); // Right-aligned at position X=pageWidth - 60, Y=40
  
        // Define the table columns
        const columns = [
          { header: 'S.No', dataKey: 'sno' },
          // { header: 'SR', dataKey: 'sr' },
          { header: 'Code', dataKey: 'itemcode' },
          { header: 'Item', dataKey: 'itemname' },
          { header: 'Item Type', dataKey: 'itemtypename' },
          { header: 'Strength', dataKey: 'strengtH1' },
          // { header: 'Multiple', dataKey: 'multiple' },
          // { header: 'Unit Count', dataKey: 'unitcount' },
          { header: 'Indented Qty Nos', dataKey: 'indentqty' }
        ];
  
        // Prepare the rows for the table
        const rows = filteredItems.map((item, index) => ({
          sno: index + 1,
    // sr: item.sr,
    itemcode: item.itemcode,
    itemname: item.itemname,
    itemtypename: item.itemtypename,
    strengtH1: item.strengtH1,
    // multiple: item.multiple,
    // unitcount: item.unitcount,
    indentqty: item.indentqty
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
  doc.save('Other-Facility-Indent-Details.pdf');
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
  //       this.OtherFacilityIndentReport = res.map((item, index) => ({
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
