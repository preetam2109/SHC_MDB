import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MonthIndentProgram } from 'src/app/Model/MonthIndentProgram';
import { tbFacilityReceiptsModel } from 'src/app/Model/tbFacilityReceiptsModel';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipt-date-entry-otherfacility',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './receipt-date-entry-otherfacility.component.html',
  styleUrl: './receipt-date-entry-otherfacility.component.css'
})
export class ReceiptDateEntryOtherfacilityComponent {
  indentForm!: FormGroup;
  MonthIndentProgram:MonthIndentProgram[]=[]
  minDate: string; // Minimum date value to prevent past dates
  currentDate: string; // Default date value for the indent form
   whid!:number
  facid!:number
   indentid!:number
   facindentid:any
   receiptnumber:any
   facreceiptid:any
   issueid:any
   tofacid:any


  constructor( private route: ActivatedRoute,private router: Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private cdr: ChangeDetectorRef,private http:HttpClient,private toastr: ToastrService,){
// Initialize the current date and minDate properties
const today = new Date();
this.currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
this.minDate = this.currentDate; // Set the minimum date to today's date
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.whid = params['whid'];
      this.facid = params['facid'];
      this.facindentid = params['facindentid'];
      this.issueid=params['issueid']
      this.tofacid=params['tofacilityid']
    });
    this.getMonthIndentProgramcCategory()

    this.indentForm = new FormGroup({
      programid: new FormControl('', Validators.required),  // Dropdown for program
      indentDt: new FormControl(this.currentDate, Validators.required)    // Date input with default current date
    });
    }

    backbutton(){
      this.router.navigate(['receipt-from-other-facility']);
    
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
// this.tofacid=tofacilityid
    const facid = sessionStorage.getItem('facilityId'); // Assuming facid is a constant
      
      this.api.getReceiptIssueSP(facid).subscribe(
        (res:any) => {
          // alert(res)
          this.receiptnumber=res
          // console.log('Success:', res);
          if(this.receiptnumber!=null){
            const WReceiptMaster={
              facreceiptid: 0,
              facilityid: this.facid,
              indentid: this.facindentid,
              warehouseid: 0,
              facreceiptdate: formattedDate,
              status: "I",
              isuseapp: "Y",
              facreceiptno: this.receiptnumber,
              facreceipttype: "SP",
              // issueid:this.issueid

            };
            

             this.api.postReceiptMasterSP(this.tofacid,this.facindentid,this.issueid,this.facid,WReceiptMaster).subscribe((res:any)=>{
              
              // alert(JSON.stringify(res))
              // console.log('get status',res)
              const facindentid = res.result.value[0].facindentid;
              // const nocid = res.result.value[0].nocid;
              const receiptnumber=this.receiptnumber
              const receiptdate=res.result.value[0].facreceiptdate;
              const wHIsueNo=res.result.value[0].issueno;
              const wHIsueDT=res.result.value[0].issueddate;
              const reqno=res.result.value[0].indentno;
              const reqDate=res.result.value[0].indentdate;
              const facreceiptid=res.result.value[0].facreceiptid;
              const status=res.result.value[0].status;
              const issueid=res.result.value[0].issueid
              // console.log('indentid'+indentid)
              // console.log('nocid'+nocid)
              

              
              
              this.router.navigate(['otherfac-receipt-batches'],{ queryParams: { receiptnumber,receiptdate,wHIsueNo,wHIsueDT,reqno,reqDate,facreceiptid,status,issueid,facindentid }});
              

             },
             (error)=>{
              // hey
      this.toastr.error('Something went wrong :( ');

              console.log(error)

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

  

