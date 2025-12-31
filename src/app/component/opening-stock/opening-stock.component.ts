import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/Model/Category';
import { GetHeaderInfo } from 'src/app/Model/GetHeaderInfo';
import { getSHCMassItems } from 'src/app/Model/getSHCMassItems';
import { Item } from 'src/app/Model/Item';
import { OpeningStock } from 'src/app/Model/OpeningStock';
import { OpstockCheck } from 'src/app/Model/OpstockCheck';
import { ReceiptID } from 'src/app/Model/ReceiptID';
import { StorageLocation } from 'src/app/Model/StorageLocation';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-opening-stock',
  templateUrl: './opening-stock.component.html',
  styleUrls: ['./opening-stock.component.css']
})
export class OpeningStockComponent {

  categories: Category[] = [];
  public item: getSHCMassItems[] = [];
  storage:StorageLocation[]=[]
  header!:GetHeaderInfo
  selectedItem: string = '';
  items: any = null;
  formSubmitted = false;

  selectStorageLocation:string='0';
  usrFacilityID:any=sessionStorage.getItem('facilityId'); // Set the appropriate value
  receiptID: any = 0; // Default value or fetched from somewhere
  receiptNo: any = 'AG';
  receiptDate: string = '';
  selectedCategory: string = '';
  openingStockDate: string 
  stocks:OpeningStock[]=[]
  showButtons: boolean = true;
  whid:any=sessionStorage.getItem('facilityId');
  batchNo: string = '';
  batchQuantity: string = '';
  mfgDate: string = '';
  expDate: string = '';
  // isGenerated:boolean=false

  constructor(private router:Router,private sharedService: SharedService,private cdr:ChangeDetectorRef,public toastr: ToastrService,public spinner: NgxSpinnerService,private datePipe: DatePipe,public api: ApiServiceService) {
    this.openingStockDate=''
   }

   ngOnInit() {
    this.api.getOpstockCheck(sessionStorage.getItem('facilityId')).subscribe((res: OpstockCheck[]) => {
      // console.log("API Response:", res[0]);
      if (res[0].opreceiptid === 0 && res[0].stauts === '0') {
        ;
        // this.showButtons=false

        // this.getFacreceiptid(() => {
        //   this.getHeaderInfo();
        //   ;
        //   this.onCategoryChange();
        //   ;
        //   this.getOpeningStocksReport();
        // });
      } else if (res[0].stauts === 'I' && res[0].opreceiptid === 0) {
        ;
        this.showButtons=false

        this.getFacreceiptid(() => {
          this.getHeaderInfo();
          ;
          this.onCategoryChange();
          ;
          this.getOpeningStocksReport();
        });
      } else {
        this.getFacreceiptid(() => {
          this.getHeaderInfo();
          this.onCategoryChange();
          this.getOpeningStocksReport();
        });
      }
    });
  
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'dd-MM-yyyy');
    this.openingStockDate = formattedDate !== null ? formattedDate : '';
  }
  
  getFacreceiptid(callback: () => void){
    
    this.api.getFacreceiptid(this.usrFacilityID).subscribe((res:ReceiptID[])=>{
      // console.log("receiptID is  ",JSON.stringify(res))

      this.receiptID= res[0].facreceiptid;
      // console.log(this.receiptID)
      this.sharedService.setReceiptID(this.receiptID);
      // let aaa=this.sharedService.setReceiptID(this.receiptID);
      // let bbb = this.sharedService.getReceiptID();
      // console.log('asdf',bbb);
      // sessionStorage.setItem('receiptID', this.receiptID);
      // this.receiptID=JSON.stringify(res.facreceiptid);
      // alert(this.receiptID)
      callback();
    })
  }

  onUpdate(): void {
    // 
    
    this.receiptDate=this.openingStockDate
    // console.log(this.receiptDate)
    this.api.updateHeaderInfo(this.usrFacilityID, this.receiptID, this.receiptNo, this.receiptDate).subscribe((res:any) => {
        // console.log(res);
        // alert(res)
        // sessionStorage.setItem('receiptID', res);
        // localStorage.setItem('receiptID', res);

        alert('ओपनिंग स्टॉक न. सफलतापूर्वक जेनरेट हो गया , अब आप एक एक कर स्टोर में रखे स्टॉक की एंट्री करें \n Op Stock No Generated Successfully , Now Add one by one' );
        // this.isGenerated=true
        this.showButtons=false
        // let isgenerated=this.isGenerated
        this.router.navigate(['OpStocks'])
      },
      error => {
        console.error(error);
        alert('Update Failed');
      }
      
    );
  }

  // getHeaderInfo(): void {
  //   
  //  this.receiptID=localStorage.getItem('receiptID');
  //   this.api.getHeaderInfo(this.receiptID).subscribe(
  //     (res: GetHeaderInfo[]) => {
  //       console.log('Response:', JSON.stringify(res, null, 2));
  //       this.header = res;
        
  //       //  this.receiptNo=this.header.;
  //       //  alert("Receipt number "+this.receiptNo)
  //       console.log('Header data:', JSON.stringify(this.header, null, 2));
  //     },
  //     (error: any) => {
  //       console.error(error);
  //     }
  //   );
  // }
  getHeaderInfo(): void {
     
    // this.receiptID = localStorage.getItem('receiptID');
    //  let hello =this.sharedService.getReceiptID();
    //  console.log('dgfgfgf',hello)
    //  sessionStorage.getItem('receiptID');
    if (this.receiptID) {
      this.showButtons=false
      this.api.getHeaderInfo(this.receiptID).subscribe(
        (res: GetHeaderInfo[]) => {
          if (res.length > 0) {
            this.header = res[0];
            // console.log('get header info ',JSON.stringify(res))
            this.receiptNo = this.header.facreceiptno;
            // console.log('facreceiptno:', this.receiptNo);
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
  backtoPreviousPage(){
    this.router.navigate(['/OpStocks']);
  }


  fetchCategories(): void {
    // 
    const faclityId = sessionStorage.getItem('facilityId'); // Replace with actual facility ID
    this.api.getItemCategory(faclityId).subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        // console.log(JSON.stringify(categories))
      },
      error => {
        console.error(error);
      }
    );
  }
  onCategoryChange(){
    // 
    this.spinner.show();

    this.api.getSHCMassItems().subscribe(
      (item: getSHCMassItems[]) => {
        this.item = item;
        this.spinner.hide();
        
      },

      error => {
        console.error(error);
      }
    );

  }
  getStorageLocation(whid:string){
    // 
    // whid='2621'
this.api.getFileStorageLocation(whid).subscribe((res:StorageLocation[])=>{
// console.log(res)
this.storage=res
})

  }
  validateDateInput(event: KeyboardEvent) {
    const allowedChars = /[0-9\-]/;
    const inputChar = String.fromCharCode(event.keyCode || event.which);
  
    if (!allowedChars.test(inputChar)) {
      event.preventDefault(); // Prevent the input if the character is not allowed
    }
  }
  
  OnSaveBatch(batchForm: NgForm) {
    
    this.spinner.show();
    this.formSubmitted = true; // Set the flag to true on form submit attempt
    // Check if the form is valid before proceeding
    if (batchForm.invalid || !this.items) {  // Add this.items check here
      Object.values(batchForm.controls).forEach(control => {
        control.markAsTouched();
      });
      if (!this.items) {
        this.toastr.error('Please select an item.');
      } else {
        this.toastr.error('Please fill in all required fields.');
      }
      this.spinner.hide();
      return;
    }
  
    // Convert input dates to Date objects for comparison
    const today = new Date();
    const mfgDateParts = this.mfgDate.split('-'); // assuming format is dd-MM-yyyy
    const expDateParts = this.expDate.split('-');
  
    const mfgDate = new Date(`${mfgDateParts[2]}-${mfgDateParts[1]}-${mfgDateParts[0]}`);
    const expDate = new Date(`${expDateParts[2]}-${expDateParts[1]}-${expDateParts[0]}`);
  
    // Validate mfgDate should not be in the future
    if (mfgDate > today) {
      this.toastr.error('Mfg दिनांक आज के दिनांक से ज्यादा नहीं हो सकता \n Mfg date cannot be greater than today\'s date');
      this.spinner.hide();
      return;
    }
  
    // Validate expDate should not be in the past
    if (expDate < today) {
      this.toastr.error(' Exp दिनांक आज के दिनांक से पूर्वं  का  नहीं हो सकता \n Exp date cannot be less than today\'s date');
      this.spinner.hide();
      return;
    }
  
    // If validation passes, proceed to save the batch record
    this.api.saveBatchRecord(
      this.items?.itemid,
      this.batchNo,
      this.selectStorageLocation='0',
      this.mfgDate,
      this.expDate,
      this.batchQuantity,
      this.usrFacilityID,
      this.receiptID
    ).subscribe(
      (res: any) => {
        this.stocks.push(res);
        this.stocks = [...this.stocks];
        this.cdr.detectChanges();
        this.toastr.success('दवा बैच का स्टॉक सफलतापूर्वक सुरक्षित किया गया \n,Drug Batch Saved Successfully!');
        this.getOpeningStocksReport();
        
        // Reset input fields and form
        this.resetInputFields();
        batchForm.resetForm();  // Clear form inputs
        this.formSubmitted = false;  // Reset the formSubmitted flag
  
        sessionStorage.setItem('itemid', this.items);
    this.spinner.hide();

      },
      (error: any) => {
        console.error('Error saving batch record:', error);
        this.toastr.error('Failed to add batch record');
        this.spinner.hide();

      }
    );
  }
  



  getOpeningStocksReport(){

// let itemid=sessionStorage.getItem('itemid');
this.api.getOpeningStocksReport('0',this.usrFacilityID).subscribe((res:any)=>{
  
// console.log("opening stock report"+JSON.stringify(res));
this.stocks=res
this.stocks=[...this.stocks];
},
(error: any) => {

  console.error('Error showing batch record:', error);
  alert('Failed to load batch record');
}
);
}
resetInputFields() {
  this.items = '';
  this.selectedCategory='';
  this.batchNo = '';
  this.selectStorageLocation = '';
  this.mfgDate = '';
  this.expDate = '';
  this.batchQuantity = '';

  
}

deleteStock(stock: any): void {
  
  const confirmDelete = window.confirm(' क्या आप इस बैच नंबर को हटाना चाहते हैं \n Are you sure you want to Delete this Batch no?');
  if (confirmDelete) {
  this.api.deleteOpeningStockRow(this.receiptID, stock.receiptitemid, stock.inwno).subscribe(
    
    (res: any) => {
      
      this.toastr.success(res);
      // Remove the deleted stock from the array
      this.stocks = this.stocks.filter(s => s !== stock);
    },
    (error: any) => {
      console.error('Error deleting stock row:', error);
      this.toastr.error('Failed to delete stock row');
    }
  
  );
  }
}

config = {
  displayKey: "itemcode", // Bind label
  search: true,
  height: '200px',
  placeholder: 'Select Item',
  // customComparator: () => {}, // Optional: custom sorting
  limitTo: this.item.length, // Limits the displayed options
};



}

