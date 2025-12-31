import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FacilityInfo } from 'src/app/Model/FacilityInfo';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-first-time-password-change',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './first-time-password-change.component.html',
  styleUrl: './first-time-password-change.component.css'
})
export class FirstTimePasswordChangeComponent {
emailError: any;
passwordResetForm: FormGroup;
showPassword = false;
macAddress:any='00:00:00:00:00:00'; // Placeholder
  ipAddress: string = '';
  browserInfo:any





  FacilityInfo:FacilityInfo[]=[];
  facilityname:any
  parentfac:any
  districtname:any
  phonE1:any
  contactpersonname:any
  warehousename:any
  whemail:any
  whcontact:any
  userid:any
  emailid:any
  facilityid:any
  currentPasswordFromSession=sessionStorage.getItem('currentPassword');
  currentpassword:any;
  showCurrentPassword = false;
showNewPassword = false;
showRetypePassword = false;

  constructor(private spinner: NgxSpinnerService,private fb: FormBuilder,private api: ApiServiceService,private http: HttpClient,private router: Router){
    this.passwordResetForm = this.fb.group({
      currentpassword: ['', Validators.required],
      newpassword: ['', [Validators.required, Validators.minLength(8)]],
      retypenewpassword: ['', Validators.required],
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    }, { validators: this.passwordsMatch });

  }
  otp: string = ''; 

  ngOnInit(): void {
    this.browserInfo= this.getBrowserInfo();
    
    sessionStorage.setItem('userAgent',this.browserInfo.userAgent );
    this.getIPAddress();
 
    this.getFacilityInfo()
    this.spinner.hide();
    
    }

  getFacilityInfo(){
      
    this.api.getFacilityInfo(sessionStorage.getItem('facilityId'),0,0,0).subscribe((res:FacilityInfo[])=>{
      this.FacilityInfo=res;
      // console.log(res)
      this.facilityname=this.FacilityInfo[0].facilityname;
      this.parentfac=this.FacilityInfo[0].parentfac;
      this.districtname=this.FacilityInfo[0].districtname;
      this.phonE1=this.FacilityInfo[0].phonE1;
      this.contactpersonname=this.FacilityInfo[0].contactpersonname;
      this.warehousename=this.FacilityInfo[0].warehousename;
      this.whemail=this.FacilityInfo[0].whemail;
      this.whcontact=this.FacilityInfo[0].whcontact;
      this.userid=this.FacilityInfo[0].userid
      this.emailid=this.FacilityInfo[0].emailid
      this.facilityid=this.FacilityInfo[0].facilityid

    })
  }
  togglePasswordVisibility(field: 'current' | 'new' | 'retype'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'retype':
        this.showRetypePassword = !this.showRetypePassword;
        break;
    }
  }
  checkCurrentpassword(){

  }
  validCurrentPassword() {
    const enteredCurrentPassword = this.passwordResetForm.get('currentpassword')?.value;

    if (enteredCurrentPassword !== this.currentPasswordFromSession) {
      alert('वर्तमान का पासवर्ड एंट्री किये गए पासवर्ड से मिलान नहीं हो रहा \n Current/Old Password does not match with Entered current Password');
      this.passwordResetForm.get('currentpassword')?.setErrors({ incorrectPassword: true });
    }
  }
  onSubmit() {
    
    if (this.passwordResetForm.valid) {
      const formValues = this.passwordResetForm.value;
      
      // const userId = ;  // This should be dynamically fetched from session or another source
      const newPass = formValues.newpassword;

      // Call the API to change the password
      this.api.changePassword(this.userid, newPass).subscribe({
        next: (response) => {
          // console.log('Password changed successfully:', response);
          this.verifyOTP()
          // alert('Password changed successfully');
        },
        error: (error) => {
          console.error('Error changing password:', error);
          alert('Error changing password');
          this.spinner.hide();
          
        }
      });
    } else {
      alert('Please fill out the form correctly');
    }
  }
   // Method to verify OTP
   verifyOTP() {
    if (this.passwordResetForm.valid) {
      // Retrieve OTP value and user ID from session
      this.otp = this.passwordResetForm.get('otp')?.value;
      // this.userid = sessionStorage.getItem('userid');

      // If OTP and userId are valid, call the API
      if (this.otp && this.userid) {
        this.api.VerifyOTPLogin(this.otp, this.userid).subscribe(
          (res: any) => {
            // console.log("Response", res);
            // Show SweetAlert for successful OTP verification
            Swal.fire({
              title: 'Password changed successfully!',
              text: 'Please Log in with New Password.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Navigate to the home page after SweetAlert is closed
              this.router.navigate(['login']);
            });
          },
          (error) => {
            // Show SweetAlert for OTP verification error
            Swal.fire({
              title: 'Error',
              text: 'Invalid OTP! Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    } else {
      // Show SweetAlert for invalid OTP input
      Swal.fire({
        title: 'Invalid OTP!',
        text: 'Please enter a valid 6-digit OTP.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }


  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const newpassword = control.get('newpassword')?.value;
    const retypenewpassword = control.get('retypenewpassword')?.value;
    return newpassword && retypenewpassword && newpassword === retypenewpassword ? null : { passwordMismatch: true };
  }

  backbutton(){
    this.router.navigate(['login']);
  
  }



  sendOTP(): void {
    
    // Show a loading indicator
    Swal.fire({
      title: 'Sending OTP...',
      text: 'Please wait while we send the OTP to your registered mobile number \n'+this.phonE1,
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    // Call API to send OTP
    this.api.getOTPSaved(this.userid,this.ipAddress).subscribe(
      (res: any) => {
        // Close the loading indicator
        Swal.close();
  
        // Show success alert
        Swal.fire({
          title: 'OTP Sent!',
          text: 'An OTP has been sent to your registered mobile number \n'+this.phonE1,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Navigate to the OTP page after confirmation
          // this.router.navigate(['/otp']); // Replace with your route
        });
      },
      (error: any) => {
        // Handle error and show failure alert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send OTP. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  getIPAddress() {
    this.http.get<any>('https://api.ipify.org?format=json')
      .subscribe(
        (res) => {
          this.ipAddress = res.ip;
          sessionStorage.setItem('ipAddress', this.ipAddress);
          // console.log('this.ipAddress=',this.ipAddress);
        },
        (err) => {
          console.error('Error fetching IP:', err);
        }
      );
  }
  getBrowserInfo() {
    return {
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    };
  }

}
