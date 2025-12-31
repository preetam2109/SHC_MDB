import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild,DoCheck } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HardcodedAuthenticationService } from './service/authentication/hardcoded-authentication.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { GetHeaderInfo } from './Model/GetHeaderInfo';
import { SharedService } from './service/shared.service';
import { ApiServiceService } from './service/api-service.service';
import { ReceiptID } from './Model/ReceiptID';
import { OpstockCheck } from './Model/OpstockCheck';
import { BasicAuthenticationService } from './service/authentication/basic-authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck {
showAAMMenuVisiblity(){
  
if(this.roleName === 'AAM'){
  this.router.navigate(['home'])
}else{
  this.router.navigate(['homeDAC'])

}
}
  deferredPrompt: any;
  showButton = false;
@ViewChild('drawer') drawer!: MatDrawer;
title='SHC';
isLoginPage = false;
username:any;
receiptID:any
stocks:GetHeaderInfo[]=[]
status:any
opstockCheckvar:OpstockCheck[]=[];
roleName: string | null = null;

@HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event) {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    this.showButton = true;
  }

constructor(private cdr: ChangeDetectorRef,public api: ApiServiceService,private toastr: ToastrService,private router: Router,private hardcodedAuthemtication:HardcodedAuthenticationService,public basicAuthentication:BasicAuthenticationService) {}

logout() {
this.basicAuthentication.logout();
this.toastr.success('Logout Successfully');
sessionStorage.clear();
this.router.navigate(['login'])

}
  ngOnInit(): void {
    
    const role = this.basicAuthentication.getRole();
    this.roleName = role.roleName;
    // this.getFacreceiptid(() => {
    //   this.getHeaderInfo();
    // });
    
    this.username=sessionStorage.getItem('firstname');
    this.cdr.detectChanges();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = (event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/forgetpassword' || event.urlAfterRedirects === '/otp' || event.urlAfterRedirects ==='/first-time-password-change' );
      }
      
    });
   
    
  }

  ngDoCheck(): void {
    
  
    const role = this.basicAuthentication.getRole();
    this.roleName = role.roleName;
    this.username=sessionStorage.getItem('firstname');
    this.cdr.detectChanges();

  }
  showAAMMenu() {

    // 
    return this.roleName === 'AAM';
    
  }
  showAAMConsultantMenu() {
    return this.roleName === 'AAM Consultant';
  }

  addToHomeScreen() {
    // Hide the app provided install promotion
    this.showButton = false;
    // Show the install prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string; }) => {
      if (choiceResult.outcome === 'accepted') {
        // console.log('User accepted the A2HS prompt');
      } else {
        // console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }
  hideAddToHomeScreen(){
    this.showButton=false
  }
  handleOutsideClick(event:Event){
    if(this.showButton){
      this.hideAddToHomeScreen()
    }
      }
      handleInsideClick(event:Event){
    event.stopPropagation();
      }
    



      getFacreceiptid(callback: () => void) {
        this.api.getFacreceiptid(sessionStorage.getItem('facilityId')).subscribe((res: ReceiptID[]) => {
            if (!res || res.length === 0 || res[0].facreceiptid === undefined || res[0].facreceiptid === null) {
                alert('कृपया पहले ओपनिंग स्टॉक विवरण दर्ज कर फ्रीज़ करें, तत्पश्चात इंडेंट तो वेयरहाउस किया जा सकेगा|');
                this.router.navigate(['OpStocks']);
            } else {
                // If facreceiptid exists, assign it to receiptID
                this.receiptID = res[0].facreceiptid;
                callback();
            }
        },
        (error) => {
            console.error('Error fetching facreceiptid:', error);
            alert('Error occurred while fetching receipt ID.');
            this.router.navigate(['OpStocks']);
        });
    }
      


  getStatus(menuType:any) {
    

    this.api.getOpstockCheck(sessionStorage.getItem('facilityId')).subscribe((res:OpstockCheck[])=>{
      // console.log('receiptid check',res)
      this.opstockCheckvar=res[0].opreceiptid;
      // console.log('receiptid check',this.opstockCheckvar)
      if(res[0].opreceiptid===0){
        alert('कृपया पहले ओपनिंग स्टॉक विवरण दर्ज कर फ्रीज़ करें, तत्पश्चात इंडेंट तो वेयरहाउस किया जा सकेगा|');
        this.router.navigate(['OpStocks']);
      }else{
  // Navigate based on which menu item was clicked
  if (menuType === 'indent-to-otherfacility') {
    this.router.navigate(['/indent-to-otherfacility']);
  } else if (menuType === 'indent-to-warehouse') {
    this.router.navigate(['/indent-to-warehouse']);
  }
  // Add more conditions if there are additional menu items
}
},
    (error: any) => {
            console.error(error);
          }
  )
  
  // First fetch the latest receiptID and header info
  // this.getFacreceiptid(() => {
    //   if (this.receiptID) {
    //     // Now that we have the receiptID, fetch the header info and decide navigation
    //     this.api.getHeaderInfo(this.receiptID).subscribe(
    //       (res: GetHeaderInfo[]) => {
    //         if (res.length > 0) {
    //           this.status = res[0].status; // Update the status based on the API response
  
    //           // Navigate based on the updated status
    //           if (this.status === 'C') {
    //             this.router.navigate(['/indent-to-warehouse']);
    //           } else {
    //             alert('कृपया पहले ओपनिंग स्टॉक विवरण दर्ज कर फ्रीज़ करें, तत्पश्चात इंडेंट तो वेयरहाउस किया जा सकेगा|');
    //             this.router.navigate(['OpStocks']);
    //           }
    //         } else {
    //           console.error('No data returned from API');
    //         }
    //       },
    //       (error: any) => {
    //         console.error(error);
    //       }
    //     );
    //   }
    // });
  }
  
  
  getHeaderInfo(){
    if (this.receiptID) {
      this.api.getHeaderInfo(this.receiptID).subscribe(
        (res: GetHeaderInfo[]) => {
          if (res.length > 0) {
          console.log("header details",res)
            this.status=res[0].status

            // alert(this.status)
          
          } else {
            console.error('No data returned from API');
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
}
