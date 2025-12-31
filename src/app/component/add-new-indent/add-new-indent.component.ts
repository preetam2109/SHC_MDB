import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MonthIndentProgram } from 'src/app/Model/MonthIndentProgram';
import { ApiServiceService } from 'src/app/service/api-service.service';


@Component({
  selector: 'app-add-new-indent',
  templateUrl: './add-new-indent.component.html',
  styleUrls: ['./add-new-indent.component.css']
})
export class AddNewIndentComponent implements OnInit {
  indentForm!: FormGroup;
  MonthIndentProgram:MonthIndentProgram[]=[]
  minDate: string; // Minimum date value to prevent past dates
  currentDate: string; // Default date value for the indent form
  // selectedPrograms: number[] = []; // Store selected program IDs

  constructor(private toastr: ToastrService,private router: Router,private spinner: NgxSpinnerService,private api: ApiServiceService,private cdr: ChangeDetectorRef,private http:HttpClient){
// Initialize the current date and minDate properties
const today = new Date();
this.currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
this.minDate = this.currentDate; // Set the minimum date to today's date
  }

  ngOnInit(): void {
    
    this.getMonthIndentProgramcCategory()

    this.indentForm = new FormGroup({
      programid: new FormControl('', Validators.required),  // Dropdown for program
      indentDt: new FormControl(this.currentDate, Validators.required)    // Date input with default current date
    });


 // Listen for changes in program selection
//  this.indentForm.get('programid')?.valueChanges.subscribe(selectedId => {
//   if (selectedId && !this.selectedPrograms.includes(selectedId)) {
//     this.selectedPrograms.push(selectedId);
//   }
// });

    }

  getMonthIndentProgramcCategory(){
    this.api.getMonthIndentProgram().subscribe((res:MonthIndentProgram[])=>{
      
        this.MonthIndentProgram = res;
        // console.log("ggggggggg"+JSON.stringify(res))
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
    if (this.indentForm.valid) {
      const indentData = this.indentForm.value;
      const formattedDate = this.formatDate(indentData.indentDt); // Format date as mm/dd/yyyy
      const programid = indentData.programid;
      const facid = sessionStorage.getItem('facilityId'); // Assuming facid is a constant

      // const selectedProgramId = this.indentForm.value.programid;
    
     // Prevent duplicate program selection
    // if (this.selectedPrograms.includes(programid)) {

    //   this.toastr.warning("This program has already been selected.");
    //   return;
    // }

      const url = `https://dpdmis.in/AAMAPIMR/api/Indent/postWhIndentNo?facid=${facid}&indentDt=${encodeURIComponent(formattedDate)}&programid=${programid}`;

      this.http.post(url, {}).subscribe(
        (response:any) => {
          const reqDate = response.result.value[0].reqDate;
          const reqno = response.result.value[0].reqno;
          // console.log(reqDate);
          // console.log(reqno);
          // console.log('Success:', response);
          // alert('Indent:'+response);
          this.router.navigate(['indent-to-warehouse'])

        },
        (error) => {
          console.error('Error:', error);
          this.spinner.hide();
          this.toastr.info(error.error);

          
          // Handle error, e.g., show an error message
        }
      );
    }
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

  

