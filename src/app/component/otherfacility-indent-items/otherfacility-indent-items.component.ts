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
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otherfacility-indent-items',
  standalone: true,
   imports: [CommonModule, FormsModule],
  templateUrl: './otherfacility-indent-items.component.html',
  styleUrl: './otherfacility-indent-items.component.css',
 
})
export class OtherfacilityIndentItemsComponent implements OnInit {
  reqDate: string | undefined;
  reqno: string | undefined;
  parentfac=sessionStorage.getItem('parentfac');
  districtname=sessionStorage.getItem('districtname');
  contactpersonname=sessionStorage.getItem('contactpersonname');
  phonE1=sessionStorage.getItem('phonE1');
  nocid: any;
  drug: Category[] = [];
  drugType: FacMonthIndentItems[] = [];
  sHCitems: SHCitems[] = [];
  drugcategory=1
  Paramfacility:any
  indentid:any
  indentitemid=0
  searchTerm: string = '';
  facilitytypeid:any
  private isDataSaved: boolean = false;
  
  // Arrays to track selected items and requested quantities
  selectedItems: number[] = [];
  requestedQtyList: { unitcount:any,sr:number,itemid: number, requestedqty: any }[] = [];

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
      this.reqDate = params['reqDate'];
      this.reqno = params['reqno'];
      this.indentid = params['indentid'];
      this.Paramfacility=params['facility'];
      this.facilitytypeid=params['facilitytypeid'];
    });
    // this.getDrugCategory();
    // this.getDrugCategoryType();
    this.getHCitems(this.drugcategory);

  }

  getDrugCategory() {
    this.api.getDrugCategory().subscribe(
      (res: any) => {
        this.drug = res;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  getDrugCategoryType() {
    const facid = sessionStorage.getItem('facilityId');
    this.api.getDrugTypeCategory(facid, 1, 0).subscribe(
      (res: FacMonthIndentItems[]) => {
        this.drugType = res;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching data', error);
        this.spinner.hide();
      }
    );
  }

  getHCitems(category:number) {
    this.spinner.show()
    this.selectedItems = []; 
    this.drugcategory=category
    this.api.getOtherFacIndentItems(category,this.indentid).subscribe(
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

  onItemSelect(itemid: number, event: any) {
    // Handle when the checkbox is checked
    if (event.target.checked) {
      this.selectedItems.push(itemid);
    } else {
      // Handle when the checkbox is unchecked
      this.selectedItems = this.selectedItems.filter(id => id !== itemid);
  
      // Find the item index in sHCitems
      const itemIndex = this.sHCitems.findIndex(item => item.itemid === itemid);
      if (itemIndex !== -1) {
        // Check if the indentqty is 0 before removing the error message
        if (this.sHCitems[itemIndex].indentqty === 0) {
          this.sHCitems[itemIndex].invalid = false; // Remove error message
        }
      }
  
      // Also remove from requestedQtyList when unchecked
      this.requestedQtyList = this.requestedQtyList.filter(item => item.itemid !== itemid);
    }
  }
  

  
  
  // Method to capture requested quantities from the input fields
  updateRequestedQty(event: any, itemid: number,sr: number,unitcount:any) {
    
    // const requestedqty1 = parseInt(event.target.value, 10)/unitcount;
    const requestedqty=parseInt(event.target.value,10);
    // alert(requestedqty);
    // Find the item in the list
    const itemIndex = this.sHCitems.findIndex(item => item.itemid === itemid);
    
    if (itemIndex !== -1) {
      // Check if the value is a valid multiple
      if (requestedqty > 0 && requestedqty % unitcount === 0) {
        // Valid value: Mark item as valid and update requested quantity
        this.sHCitems[itemIndex].invalid = false;
        
        // Update or add the requested quantity for this item
        const existingItemIndex = this.requestedQtyList.findIndex(item => item.itemid === itemid);
        if (existingItemIndex !== -1) {
          // Update the existing item quantity
          this.requestedQtyList[existingItemIndex].requestedqty = requestedqty;
          this.requestedQtyList[existingItemIndex].sr = sr; // Update SR value
          this.requestedQtyList[existingItemIndex].unitcount = unitcount; // Update SR value
        } else {
          // Add a new item to the requestedQtyList
          this.requestedQtyList.push({ unitcount,itemid, requestedqty, sr });
        }
      } else {
        // Invalid value: Mark item as invalid and show the error message
        this.sHCitems[itemIndex].invalid = true;
      }
    }
  }
  
  isAnyInvalid(): boolean {
    return this.sHCitems.some(item => item.invalid); // Check if any item is marked as invalid
  }
  
  
  saveData() {
    
    if (this.isAnyInvalid()) {
      alert('Some items have invalid quantities. Please fix the errors before saving.');
      return; // Stop the save process if there are invalid items
    }
  
    if (!this.indentid) {
      alert('Indent ID is missing. Please check the input.');
      return;
    }
  
    // Filter only the selected items that have a corresponding requested quantity > 0
    const itemsToSave = this.requestedQtyList.filter(qtyItem =>
      this.selectedItems.includes(qtyItem.itemid) && qtyItem.requestedqty > 0
    );
  
    // If no items are selected for saving, show an alert and stop the process
    if (itemsToSave.length === 0) {
      alert('Please select items and specify a valid requested quantity before saving.');
      return;
    }
  
    let saveCount = 0; // Counter for save operations
    let updateCount = 0; // Counter for update operations
    let hasError = false; // Track if any error occurs
    let errorShown = false; // Flag to track if an error has already been shown

  // Reset the saved flag at the start of save process
  this.isDataSaved = false;

    // Save the filtered items
    itemsToSave.forEach((itemToSave, index) => {
      const matchingItem = this.sHCitems.find(item => item.itemid === itemToSave.itemid);
  
      if (matchingItem) {
        const nocItemData = {
          indentitemid: matchingItem.sr,
          indentid: this.indentid,
          itemid: itemToSave.itemid,
          requestedqty: parseInt(itemToSave.requestedqty, 10),
          facstock: 0,
          approvedqty: 0,
          status: 'N',
          stockinhand: 0,
          // mtransferid:this.indentid
        };
  
        // Determine whether to insert or update
        const isInsert = nocItemData.indentitemid === 0;
  
        this.api.postOtherFacIndentItems(nocItemData, nocItemData.indentitemid,this.facilitytypeid).subscribe(
          () => {
            if (isInsert) {
              saveCount++;
            } else {
              updateCount++;
            }
  
            // If this is the last iteration, show the appropriate message
            if (index === itemsToSave.length - 1) {
              if (saveCount > 0 && updateCount > 0) {
                alert(`${saveCount} items saved and ${updateCount} items updated successfully!`);
              } else if (saveCount > 0) {
                alert(`${saveCount} items saved successfully!`);
              } else if (updateCount > 0) {
                alert(`${updateCount} items updated successfully!`);
              }

            if (!hasError) {
                // Only set saved flag if no errors occurred
                this.isDataSaved = true;
              } else {
                alert('Some items could not be processed due to errors.');
              }
  
              this.getHCitems(this.drugcategory); // Refresh data
            }
          },
          (error) => {
            if (!errorShown) {
              console.error('Error in POST request:', error);
              alert('An error occurred while processing data!');
              errorShown = true; // Set the flag to true to prevent repeated alerts
              hasError = true;
            }

          }
        );
      }
    });
  }
  
  
  backtoPreviousPage(){
    
    this.router.navigate(['indent-to-otherfacility'])
  }
  validateNumberInput(event: KeyboardEvent): void {
    
    // Allow only numeric characters (0-9)
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  removeNonNumeric(event: any): void {
    
    // Replace any non-numeric characters (if pasted) with an empty string
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  filteredItems() {
    
    if (!this.searchTerm) {
      return this.sHCitems; // If no search term, return all items
    }

    return this.sHCitems.filter(item => 
      // item.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.itemcode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.itemtypename.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.itemname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.strengtH1.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  freezData() {
    
    
     // Check if there are no items with indentqty greater than 0
  const anyItemsHaveQty = this.sHCitems.some(item => item.indentqty > 0);

  if (!anyItemsHaveQty) {
    alert('* फ्रीज करने से पहले मांग में सामग्री जोड़े\n* Before Freezing, please add items in the indent.');
    // Optionally, you can add code here to change the color of the alert text to red
    return; // Exit the method entirely
  }
  // First, check if data has been saved
  if (!this.isDataSaved) {
    alert('Please save the indent data first before freezing.');
    return;
  }
  
    // Proceed with freezing data since not all items have zero qty
    this.spinner.show();
    this.api.completeOtherFacIndent(this.indentid).subscribe(
      (res: any) => {
        // console.log('Response:', res);
        alert('मांग सफलतापूर्वक फ्रीज कर वेयरहाउस को भेज दिया गया\nIndent successfully sent to warehouse');
        // Optionally, you can add code here to change the color of the alert text to green
        this.spinner.hide();
        this.router.navigate(['/indent-to-otherfacility'])
        // Optionally reset the flag after successful freeze
        this.isDataSaved = false;
      },
      (error) => {
        console.log("Error while freezing ", error);
        this.toastr.error('Something went wrong :( ');

        this.spinner.hide();
      }
    );
  }
  

printPDF() {
  // Step 1: Filter the table data to include only rows with requestedqty > 0
  const filteredItems = this.sHCitems.filter(item => item.indentqty > 0);

  // Check if filtered items are available
  if (filteredItems.length === 0) {
    console.warn('No items found with requested quantity greater than 0');
    return; // Exit if no data
  }

  // Step 2: Initialize a new jsPDF instance
  const doc = new jsPDF('l', 'mm', 'a4');

  // Get current date and time
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();

  // Step 3: Set up title and additional information
  const title = 'Facility: ' + (sessionStorage.getItem('firstname') || 'Indent Details');
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
  doc.text(`Parent Facility: ${this.parentfac}`, 30, 30); // Left-aligned at position X=30, Y=30
  doc.text(`District: ${this.districtname}`, pageWidth - 100, 30); // Right-aligned at position X=pageWidth - 100, Y=30
  doc.text(`Indent Date: ${this.reqDate}`, 30, 40); // Left-aligned at position X=30, Y=40
  doc.text(`Indent No: ${this.reqno}`, pageWidth - 100, 40); // Right-aligned at position X=pageWidth - 100, Y=40

  doc.text(`Indent Id: ${this.indentid}`, 30, 50); // Left-aligned at position X=30, Y=50
  doc.text(`Status: Incomplete`, pageWidth - 100, 50); // Right-aligned at position X=pageWidth - 100, Y=50

  // Step 4: Define the table columns
  const columns = [
    { header: 'S.No', dataKey: 'sno' },
    // { header: 'SR', dataKey: 'sr' },
    { header: 'Code', dataKey: 'itemcode' },
    { header: 'Item', dataKey: 'itemname' },
    { header: 'Item Type', dataKey: 'itemtypename' },
    { header: 'Strength', dataKey: 'strengtH1' },
    { header: 'Multiple', dataKey: 'multiple' },
    { header: 'Unit Count', dataKey: 'unitcount' },
    { header: 'Requested Quantity', dataKey: 'indentqty' }
  ];

  // Step 5: Prepare the rows for the table
  const rows = filteredItems.map((item, index) => ({
    sno: index + 1,
    // sr: item.sr,
    itemcode: item.itemcode,
    itemname: item.itemname,
    itemtypename: item.itemtypename,
    strengtH1: item.strengtH1,
    multiple: item.multiple,
    unitcount: item.unitcount,
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
}

  
  
  
}
