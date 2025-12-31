import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BasicAuthenticationService } from 'src/app/service/authentication/basic-authentication.service';
import { HardcodedAuthenticationService } from 'src/app/service/authentication/hardcoded-authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend
} from 'ng-apexcharts';
import { ApiServiceService } from 'src/app/service/api-service.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('chart') chart: ChartComponent | undefined;
  public cO: Partial<ChartOptions> | undefined;
  chartOptions: ChartOptions;
  activeTab: string = 'aamLogin';
  username: any;
  emailid: any;
  pwd: any;
  password: any;
  showAdminPassword: boolean = false;
  email: any;
  errorMessage = "Invalid Credential";
  adminErrorMessage: string = 'Invalid admin credentials';
  invalidLogin = false;
  invalidAdminLogin: boolean = false;
  phonE1: any;
  showFullText = false;
  showPassword = false;
  emailError = '';
  passwordError = '';
  adminEmail: string = '';
  adminPwd: string = '';

  
  constructor(
    public api: ApiServiceService,
    private spinner: NgxSpinnerService,
    public loginService: BasicAuthenticationService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    public hardcodedAuthenticationService: HardcodedAuthenticationService
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 400,
        events: {},
      },
      plotOptions: {
        bar: {
          horizontal: false, // Switch to vertical bars
          columnWidth: '50%', // Adjust width to make bars thinner
          borderRadius: 4, // Add slight rounding to bars
        },
      },
      xaxis: {
        categories: [], // Placeholder, will be set dynamically
      },
      yaxis: {
        min: 0,
        max: 12, // Adjusted to fit the data range (can be updated as needed)
        labels: {
          formatter: (val) => `${val}%`, // Show percentages on y-axis
        },
        title: {
          text: undefined,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return `${val}%`; // Show values with percentage symbol
        },
        offsetY: -10,
        style: {
          fontSize: '12px',
          colors: ['#000'], // Darker color for contrast
        },
      },
      fill: {
        colors: ['#3498db'], // Set the color for the bars here
        opacity: 1,
      },
      stroke: {
        width: 1,
        colors: ['#fff'], // Optional, white stroke to give a border effect around bars
      },
      title: {
        text: 'District wise Rollout',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return `${val}%`; // Show percentage in tooltip
          },
        },
      },
      legend: {
        show: false, // Hide legend as the chart doesn’t require it
      },
    };
    
    
    this.loadData();
  }
  ngOnInit(): void {
   
    
    this.loadData()
   
    
  }
  forgetAdminPassword() {

       this.router.navigate(['/forgetpassword']);

  }
  toggleAdminPasswordVisibility() {
    this.showAdminPassword = !this.showAdminPassword;
  }
  handleAdminLogin() {
    
    sessionStorage.clear();
    localStorage.clear();
    // Handle Admin Login form submission
    this.invalidAdminLogin = !this.adminEmail || !this.adminPwd;
    this.loginService.executeAuthenticationServiceAAMConsultant(this.adminEmail, this.adminPwd).subscribe(
      res => {
        console.log('Response from server:', res); // Log the server response
        if (res) {    
              
            console.log('Login successful', res);
            sessionStorage.setItem('AAMConsultant',res.emailid)
            sessionStorage.setItem('districtid',res.districtid)
            sessionStorage.setItem('firstname',res.districtname)


            this.invalidAdminLogin = false;
            this.router.navigate(['/homeDAC']);
            this.spinner.hide();
         
        } else {
          this.invalidAdminLogin = true;
          this.adminErrorMessage = res.message || 'Invalid login credentials'; // Use backend error message
          this.spinner.hide();
        }
      },
      error => {
        this.invalidAdminLogin = true;
        this.adminErrorMessage = 'Invalid Credentials'; // Default error message
        console.error('Login error:', error); // Log the error
        this.spinner.hide();
      }
    );
  }
  
  loadData(): void {
    this.spinner.show();
    this.api.getDistrictAchivementStatus().subscribe(
      (data: any) => {
        const districtname: string[] = [];
        const target: number[] = [];
        const achivement: number[] = [];
        const per: number[] = [];

        data.forEach((item: { districtname: string; target: number; achivement: number; per: number; }) => {
          districtname.push(item.districtname);
          target.push(item.target);
          achivement.push(item.achivement);
          per.push(item.per);
        });

       

        this.chartOptions.series = [
          // {
          //   name: 'target',
          //   data: target
          // },
          // {
          //   name: 'achivement',
          //   data: achivement
          // },
          {
            name: 'per',
            data: per
          }
        ];
        this.chartOptions.xaxis = {
          categories: districtname
        };
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error: any) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Email validation logic
  validateEmail(): void {
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@dpdmis\.in$/; // Valid email pattern for dpdmis.in domain
    const isNumeric = /^\d+$/.test(this.emailid);           // Check if it's numeric
    
    if (!isNumeric && !emailPattern.test(this.emailid)) {
      // If the input is not numeric and doesn't match the email pattern
      this.emailError = "Email must be in a valid format and end with @dpdmis.in.";
    } else if (isNumeric && this.emailid.length !== 10) {
      // If the input is numeric and not exactly 10 digits
      this.emailError = "Mobile number must be exactly 10 digits.";
    } else {
      // Clear the error if validation passes
      this.emailError = ''; 
    }
  }
  

  // Password validation logic
  // validatePassword(): void {
  //   const passwordPattern = /^\d{10}$/; // Ensure password is a 10-digit number
  //   if (!passwordPattern.test(this.pwd)) {
  //     this.passwordError = 'Password must be a 10-digit number.';
  //   } else {
  //     this.passwordError = '';
  //   }
  // }

  toggleText() {
    this.showFullText = !this.showFullText; // Toggle the visibility of full text
  }

  forgetpassword() {
    this.router.navigate(['/forgetpassword']);
  }

  handleLogin() {
    
    // sessionStorage.clear();
    // localStorage.clear();
    this.emailid = this.emailid.trim();

    // Call validation methods
    this.validateEmail();
    // this.validatePassword();
  
    // Debugging output
  
    if (this.emailError) {
      // If there are validation errors, set invalidLogin to true and show the error message
      this.invalidLogin = true;
      this.errorMessage = 'Invalid Credentials.';
      return; // Exit the function without proceeding with login
    }
  
    // Proceed with login if validation passes
    this.spinner.show();
  
    // Log email and password for debugging purposes
    // console.log('Email:', this.emailid, 'Password:', this.pwd);

    this.loginService.executeAuthenticationService(this.emailid, this.pwd).subscribe(
      res => {
        // console.log('Response from server:', res); // Log the server response
        if (res.message === "Successfully Login") {
          if(this.pwd==='Common@123'){
            sessionStorage.setItem('currentPassword',this.pwd)
            this.router.navigate(['/first-time-password-change']);
            // ,{queryParams:{emailid:this.emailid,pwd:this.pwd}}
          }
          else{

            console.log('Login successful', res);
            this.invalidLogin = false;
            this.router.navigate(['/otp']);
            // temporary removing otp 
            // this.router.navigate(['/home']);
            this.spinner.hide();
          }
  
          // Display SweetAlert for OTP confirmation
          // Swal.fire({
          //   title: 'OTP Sent!',
          //   text: 'An OTP has been sent to your registered mobile number.',
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // }).then(() => {
          //   // Navigate to OTP page after the SweetAlert is closed
          // });
        } else {
          this.invalidLogin = true;
          this.errorMessage = res.message || 'Invalid login credentials'; // Use backend error message
          this.spinner.hide();
        }
      },
      error => {
        this.invalidLogin = true;
        this.errorMessage = 'Invalid Credentials'; // Default error message
        console.error('Login error:', error); // Log the error
        this.spinner.hide();
      }
    );
  }
}
