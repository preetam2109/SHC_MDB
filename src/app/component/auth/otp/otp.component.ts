import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacilityInfo } from 'src/app/Model/FacilityInfo';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { BasicAuthenticationService } from 'src/app/service/authentication/basic-authentication.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OTPComponent implements OnInit {
  otp: string = '';
  userid:any
  message: string = '';
  constructor(public loginService: BasicAuthenticationService,private router: Router,private api: ApiServiceService,private http: HttpClient) {}
  facid=sessionStorage.getItem('facilityId');
  phonE1:any
  FacilityInfo:FacilityInfo[]=[];
  emailid: any;
  pwd: any;
  macAddress:any='00:00:00:00:00:00'; // Placeholder
  ipAddress: string = '';
  browserInfo:any

  ngOnInit(): void {
    this.browserInfo= this.getBrowserInfo();
    
    sessionStorage.setItem('userAgent',this.browserInfo.userAgent );
    this.getIPAddress();
  
  this.getFacilityInfo()
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

  getFacilityInfo(){
      
    this.api.getFacilityInfo(this.facid,0,0,0).subscribe((res:FacilityInfo[])=>{
      this.FacilityInfo=res;
      this.userid=this.FacilityInfo[0].userid
      // console.log(this.userid)
      this.phonE1=this.FacilityInfo[0].phonE1;
      if (this.phonE1 && this.phonE1.length >= 3) {
        // console.log('mas0',this.phonE1)

        const maskedPart = this.phonE1.slice(0, -3).replace(/\d/g, 'X');
        // console.log('mas1',maskedPart)
        const visiblePart = this.phonE1.slice(-4);
        // console.log('mas2',visiblePart)

        this.phonE1= maskedPart + visiblePart;
        // console.log('mas3',this.phonE1)
        
      }
    })
  }

  

  // Method to verify the OTP entered by the user
  verifyOTP() {
    
    if (this.otp.length === 5) {
      // Retrieve user ID from session storage
      this.userid = sessionStorage.getItem('userid');
  
      // Call the API to verify the OTP
      this.api.VerifyOTPLogin(this.otp, this.userid).subscribe(
        (res: any) => {
          console.log("Response", res);
  
          // Show SweetAlert for successful OTP verification
          Swal.fire({
            title: 'Login Successful!',
            text: 'You have successfully logged in.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Navigate to the home page after the SweetAlert is closed
            this.router.navigate(['home']);
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
    } else {
      // Show SweetAlert for invalid OTP input
      Swal.fire({
        title: 'Invalid OTP!',
        text: 'Please enter a 5-digit OTP.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  

  // Method to handle OTP resend functionality
  // sendOTP() {

  //   this.api.getOTPSaved(this.userid).subscribe((res:any)=>{
  //     //  Display SweetAlert for OTP confirmation
  //         Swal.fire({
  //           title: 'OTP Sent!',
  //           text: 'An OTP has been sent to your registered mobile number.',
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         }).then(() => {
  //           // Navigate to OTP page after the SweetAlert is closed
  //         });
  //   })
  //   // this.loginService.executeAuthenticationService(this.emailid, this.pwd).subscribe(

  //   //   res => {
  //   //     console.log('Response from server:', res); // Log the server response
  //   //     if (res.message === "Successfully Login") {
  //   //       console.log('Login successful', res);
  //   //       // this.invalidLogin = false;
  //   //       // this.router.navigate(['/otp']);
  //   //       // this.spinner.hide();
  
  //   //       // Display SweetAlert for OTP confirmation
  //   //       // Swal.fire({
  //   //       //   title: 'OTP Sent!',
  //   //       //   text: 'An OTP has been sent to your registered mobile number.',
  //   //       //   icon: 'success',
  //   //       //   confirmButtonText: 'OK'
  //   //       // }).then(() => {
  //   //       //   // Navigate to OTP page after the SweetAlert is closed
  //   //       // });
  //   //     } else {
  //   //       // this.invalidLogin = true;
  //   //       // this.errorMessage = res.message || 'Invalid login credentials'; // Use backend error message
  //   //       // this.spinner.hide();
  //   //     }
  //   //   },
  //   //   error => {
  //   //     // this.invalidLogin = true;
  //   //     // this.errorMessage = 'Invalid Credentials'; // Default error message
  //   //     // console.error('Login error:', error); // Log the error
  //   //     // this.spinner.hide();
  //   //   }
  //   // );
  // }
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
          this.router.navigate(['/otp']); // Replace with your route
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
  
}