import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/Model/Category';
import { FacMonthIndentItems } from 'src/app/Model/FacMonthIndentItems';
import { NOCItems } from 'src/app/Model/NOCItems';
import { SHCitems } from 'src/app/Model/SHCitems';
import { ApiServiceService } from 'src/app/service/api-service.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'; 
import { StockReport } from 'src/app/Model/StockReport';
import { ConsumptionGrid } from 'src/app/Model/ConsumptionGrid';
import { FacilityIssueBatches } from 'src/app/Model/FacilityIssueBatches';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-ward-issue',
  templateUrl: './ward-issue.component.html',
  styleUrls: ['./ward-issue.component.css']
})
export class WardIssueComponent {
  reqDate: string | undefined;
  issueid:any
  facissueqty:any
  wardname:any;
  issueno:any;
  issuedate:any;
  nocid: any;
  drug: Category[] = [];
  drugType: FacMonthIndentItems[] = [];
  sHCitems: ConsumptionGrid[] = [];
  FacilityIssueBatches: FacilityIssueBatches[] = [];
  issueQtyArray: any[] = [];
  facilityIssueBatchesMap: { [key: number]: any[] } = {};
  searchTerm: string = '';
  


  drugcategory=1
  
  // Arrays to track selected items and requested quantities
  selectedItems: number[] = [];
  requestedQtyList: { itemId: number, facissueqty: any,issueitemid:any }[] = [];

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private api: ApiServiceService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
this.spinner.show()
    this.route.queryParams.subscribe((params) => {
      this.wardname = params['wardname'];
      this.issueno = params['issueno'];
      this.issuedate = params['issuedate'];
      this.issueid = params['issueid'];
    });
    // this.getDrugCategory();
    // this.getDrugCategoryType();

    this.getHCitems();
     // After fetching HC items, fetch the facility issue batches for each item
  this.getHCitemsWithBatches();





    
    
       
    
  }
  filteredItems() {
    
    if (!this.searchTerm) {
      return this.sHCitems; // If no search term, return all items
    }

    return this.sHCitems.filter(item => 
      // item.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.itemtypename.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.strength1.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


getHCitemsWithBatches() {
  // Ensure items are loaded first
  // this.spinner.show();
  this.api.FacilityIssueCurrectstock(sessionStorage.getItem('facilityId'), 0, 0, this.issueid)
    .subscribe((res: any) => {
      this.sHCitems = res;
      // alert(JSON.stringify(this.sHCitems))

      // Call getFacilityIssueBatches for each item
      this.sHCitems.forEach(item => {
        const issueItemId = item.issueitemid; // Or appropriate property
        this.getFacilityIssueBatches(issueItemId);

      });
      
      this.spinner.hide();
    }, (error) => {
      console.error('Error fetching HC items', error);
      this.spinner.hide();
    });
}

  

  getFacilityIssueBatches(issueitemid: any) {
    
    this.spinner.show();
    // Call the API to get the facility issue batches
    this.api.FacilityIssueBatches(issueitemid).subscribe(
      (res: FacilityIssueBatches[]) => {
        // console.log('Received batches for issueitemid:', issueitemid, res);
        
        // Store the result in the facilityIssueBatchesMap for the specific issueitemid
        this.facilityIssueBatchesMap[issueitemid] = res;
      },
      (error) => {
        console.error('Error fetching batches for issueitemid:', issueitemid, error);
        alert(error);
      }
    );
  }

  
  // Method to update the IssueQty array when quantity is input
  updateIssueQty(event: any, itemId: number,issueitemid:number) {
    const enteredQty = event.target.value;

    // Check if the item already exists in the issueQtyArray
    const existingItem = this.issueQtyArray.find(item => item.itemId === itemId);

    if (existingItem) {
      // If the item exists, update its IssueQty
      existingItem.facissueqty = enteredQty;
    } else {
      // If it doesn't exist, add a new entry
      this.issueQtyArray.push({ itemId: itemId, facissueqty: enteredQty,issueitemid:issueitemid });
    }
  }

  getHCitems() {
    const facid = sessionStorage.getItem('facilityId');

    this.spinner.show()
    this.selectedItems = []; 
    
    this.api.FacilityIssueCurrectstock(facid,0,0,this.issueid).subscribe(
      (res: any) => {
        this.sHCitems = res;
        // this.sHCitems = [...this.sHCitems]
        // console.log('SHC data:', JSON.stringify(res));

        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  onItemSelect(itemId: any, event: any) {
    // if (event.target.checked) {
    //   this.selectedItems.push(itemId); // Add item to selectedItems if checked
    // } else {
    //   const index = this.selectedItems.indexOf(itemId);
    //   if (index > -1) {
    //     this.selectedItems.splice(index, 1); // Remove item if unchecked
    //   }
    // }
  
    // console.log('Updated Selected Items:', this.selectedItems);
  }
  

  
  
  // Method to capture requested quantities from the input fields
  // updateRequestedQty(event: any, itemId: number,issueitemid:number) {
  //   
  //   const requestedqty = parseInt(event.target.value, 10);
    
  //   // Find the item in the sHCitems list
  //   const itemIndex = this.sHCitems.findIndex(item => item.itemId === itemId);
    
  //   if (itemIndex !== -1) {
  //     // Ensure requested quantity is valid
  //     if (requestedqty > 0) {
  //       const existingItemIndex = this.requestedQtyList.findIndex(item => item.itemId === itemId);
        
  //       if (existingItemIndex !== -1) {
  //         // Update the quantity for the existing item
  //         this.requestedQtyList[existingItemIndex].facissueqty = requestedqty;
  //         this.requestedQtyList[existingItemIndex].issueitemid =issueitemid
  //       } else {
  //         // Add a new item to the requestedQtyList
  //         
  //         this.requestedQtyList.push({ itemId, facissueqty: requestedqty,issueitemid});
  //       }
  //     }
  //   }
  // }
  
  
  // isAnyInvalid(): boolean {
  //   return this.sHCitems.some(item => item.invalid); // Check if any item is marked as invalid
  // }
  
  
  saveData() {
    
    this.spinner.show();
    const invalidItems = this.sHCitems.filter(item => item.facissueqty > item.readyForIssue);
  
    if (invalidItems.length > 0) {
      alert("One or more items have invalid quantities.");
      this.spinner.hide(); // Hide spinner if invalid items are found
      return; // Prevent form submission if there are invalid items
    }
    if (!this.issueid) {
      alert('issueid is missing. Please check the input.');
      this.spinner.hide(); // Hide spinner if issueid is missing
      return;
    }
  
    const itemsToSave = this.issueQtyArray.filter(qtyItem => qtyItem.facissueqty > 0 && !isNaN(qtyItem.facissueqty));
  
    if (itemsToSave.length === 0) {
      alert('Please specify a valid requested quantity before saving.');
      this.spinner.hide(); // Hide spinner if no valid quantities are specified
      return;
    }
  
    let successfulCount = 0; // Initialize a counter for successful saves
    const totalItems = itemsToSave.length; // Total items to save
  
    itemsToSave.forEach(itemToSave => {
      const matchingItem = this.sHCitems.find(item => item.itemId === itemToSave.itemId);
  
      if (matchingItem) {
        const nocItemData = {
          issueitemid: itemToSave.issueitemid,
          issueid: this.issueid,
          itemId: itemToSave.itemId,
          currentstock: itemToSave.facissueqty,
          allotted: itemToSave.facissueqty,
          issueqty: itemToSave.facissueqty,
        };
  
        const facid = sessionStorage.getItem('facilityId');
  
        this.api.postWardIssue(facid, nocItemData).subscribe(
          (response: any) => {
            successfulCount++; // Increment successful save count
            console.log(`Item added successfully: ${itemToSave.itemId}`); // Optional logging
  
            // Check if all items have been processed
            if (successfulCount === totalItems) {
              alert(`वाउचर में सामग्री जोड़ा गया ! \n Items Added Successfully`);
              this.getHCitems();
              this.getHCitemsWithBatches();
              this.spinner.hide();
            }
          },
          (error) => {
            console.error('Error in POST request:', error);
            this.spinner.hide();
            this.toastr.info(error.error);

            

            // Optionally, handle errors or show an alert
          }
        );
      } else {
        // Handle case where matching item is not found, if needed
        console.warn(`No matching item found for itemId: ${itemToSave.itemId}`);
      }
    });
  }
  
  
  backtoPreviousPage(){
    
    this.router.navigate(['consuption'])
  }
  validateNumberInput(event: KeyboardEvent): void {
    
    // Allow only numeric characters (0-9)
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  validateIssueQty(item: any): boolean {
    return item.facissueqty <= item.readyForIssue; // readyForIssue represents Current Stock
  }
  
  removeNonNumeric(event: any): void {
    
    // Replace any non-numeric characters (if pasted) with an empty string
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  freezData() {
    

    // Check each item in sHCitems for issueitemid
    // for (const item of this.sHCitems) {
    //     const issueItemId = item.issueitemid; // Or appropriate property
    //     if (issueItemId === 0) {
    //         alert('Issueitemid is zero. You cannot freeze.');
    //         return; // Exit the method entirely
    //     }
    // }

    this.spinner.show();
    this.api.freezeWardIssues(this.issueid).subscribe(
        (res: any) => {
            // console.log('Response:', res);
            alert('वितरण को सफलतापूर्वक फ्रीज कर दिया गया , Consumption Freeze Successfully');
            this.spinner.hide();
            this.router.navigate(['consuption']);
        },
        (error) => {

            console.log("Error while freezing ", error);
            this.spinner.hide();
            this.toastr.info(error.error);



        }
    );
}


deleteIssueItemIdIfExist(issueitemid:any){
  this.api.deleteIssueItemIdIfExist(issueitemid).subscribe((res:any)=>{
    alert('Item removed Sucessfully !')
    this.getHCitems();
    this.getHCitemsWithBatches();
  },
(error)=>{
  console.log(error);
})

}

printPDF() {
  
  
}

  
  
  
}
