import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MonthIndentProgram } from 'src/app/Model/MonthIndentProgram';
import { tbFacilityReceiptsModel } from 'src/app/Model/tbFacilityReceiptsModel';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-receipt-date-entry',
  templateUrl: './receipt-date-entry.component.html',
  styleUrls: ['./receipt-date-entry.component.css']
})
export class ReceiptDateEntryComponent {
  indentForm!: FormGroup;
  MonthIndentProgram:MonthIndentProgram[]=[]
  minDate: string; // Minimum date value to prevent past dates
  currentDate: string; // Default date value for the indent form
   whid!:number
  facid!:number
   indentid!:number
   receiptnumber:any
   facreceiptid:any


  constructor(private toastr: ToastrService,private route: ActivatedRoute,private router: Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private cdr: ChangeDetectorRef,private http:HttpClient){
// Initialize the current date and minDate properties
// const today = new Date();
// this.currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
// this.minDate = this.currentDate; // Set the minimum date to today's date

      // Initialize the current date and minDate properties
  const today = new Date();

  // Set current date (YYYY-MM-DD)
  this.currentDate = today.toISOString().split('T')[0];
  
  // Set minDate to 7 days back (YYYY-MM-DD)
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 7);
  this.minDate = pastDate.toISOString().split('T')[0];


  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.whid = params['whid'];
      this.facid = params['facid'];
      this.indentid = params['indentid'];
    });
    this.getMonthIndentProgramcCategory()

    this.indentForm = new FormGroup({
      programid: new FormControl('', Validators.required),  // Dropdown for program
      indentDt: new FormControl(this.currentDate, Validators.required)    // Date input with default current date
    });
    }

    backbutton(){
      this.router.navigate(['receipt-from-warehouse']);
    
    }



  getMonthIndentProgramcCategory(){
    this.api.getMonthIndentProgram().subscribe((res:MonthIndentProgram[])=>{
      
        this.MonthIndentProgram = res;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }
  onSubmit() {
    
    const indentData = this.indentForm.value;
    const formattedDate = indentData.indentDt

      const facid = sessionStorage.getItem('facilityId'); // Assuming facid is a constant
      
      this.api.getReceiptIssueNo(facid).subscribe(
        (res:any) => {
          // alert(res)
          this.receiptnumber=res
          // console.log('Success:', res);
          if(this.receiptnumber!=null){
            const WReceiptMaster: tbFacilityReceiptsModel={
              facreceiptid: 0,
              facilityid: this.facid,
              indentid: this.indentid,
              warehouseid: this.whid,
              facreceiptdate: formattedDate,
              status: "I",
              isuseapp: "Y",
              facreceiptno: this.receiptnumber,
              facreceipttype: "NO"

            };

             this.api.postReceiptMaster(WReceiptMaster,this.facid).subscribe((res:any)=>{
              
              // alert(JSON.stringify(res))
              // console.log('get status',res)
              const indentid = res.result.value[0].indentid;
              const nocid = res.result.value[0].nocid;
              const receiptnumber=this.receiptnumber
              const receiptdate=res.result.value[0].facreceiptdate;
              const wHIsueNo=res.result.value[0].whissueno;
              const wHIsueDT=res.result.value[0].whissuedt;
              const reqno=res.result.value[0].reqno;
              const reqDate=res.result.value[0].reqdate;
              const facreceiptid=res.result.value[0].facreceiptid;
              const status=res.result.value[0].status;
              // console.log('indentid'+indentid)
              // console.log('nocid'+nocid)
              

              
              
              this.router.navigate(['receipt-batches'],{ queryParams: { nocid,indentid,receiptnumber,receiptdate,wHIsueNo,wHIsueDT,reqno,reqDate,facreceiptid,status }});
              

             },
             (error)=>{
              console.log(error)
              this.toastr.info(error.message)

             }
             )

          }

       

        },
        (error) => {
          console.error('Error:', error);
         
        }
      );
  }
   // Utility function to format date as mm/dd/yyyy
   private formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2); // Adding leading zero if necessary
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }
  

  }

  

