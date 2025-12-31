import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacilityInfo } from 'src/app/Model/FacilityInfo';
import { GetHeaderInfo } from 'src/app/Model/GetHeaderInfo';
import { OpstockCheck } from 'src/app/Model/OpstockCheck';
import { ReceiptID } from 'src/app/Model/ReceiptID';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  FacilityInfo:FacilityInfo[]=[];
  facilityname:any
  parentfac:any
  districtname:any
  phonE1:any
  contactpersonname:any
  warehousename:any
  whemail:any
  whcontact:any
  facid=sessionStorage.getItem('facilityId');
  receiptID:any
stocks:GetHeaderInfo[]=[]
status:any
  
  
  constructor(private api: ApiServiceService,private http: HttpClient,private router: Router) {
    }
  ngOnInit(): void {

    this.api.getOpstockCheck(sessionStorage.getItem('facilityId')).subscribe((res: OpstockCheck[]) => {
    this.status=res[0].stauts
     
    });

    // this.getFacreceiptid(() => {
    //   this.getHeaderInfo();
    // });
    this.getFacilityInfo()
    }
    getFacilityInfo(){
      
      this.api.getFacilityInfo(this.facid,0,0,0).subscribe((res:FacilityInfo[])=>{
          this.FacilityInfo=res;
          console.log(res)
        this.facilityname=this.FacilityInfo[0].facilityname;
        this.parentfac=this.FacilityInfo[0].parentfac;
        this.districtname=this.FacilityInfo[0].districtname;
        this.phonE1=this.FacilityInfo[0].phonE1;
        this.contactpersonname=this.FacilityInfo[0].contactpersonname;
        this.warehousename=this.FacilityInfo[0].warehousename;
        this.whemail=this.FacilityInfo[0].whemail;
        this.whcontact=this.FacilityInfo[0].whcontact;
        sessionStorage.setItem('parentfac', this.parentfac);
        sessionStorage.setItem('districtname', this.districtname);
        sessionStorage.setItem('contactpersonname',this.contactpersonname);
        sessionStorage.setItem('phonE1', this.phonE1);
      })
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
    
    getHeaderInfo(){
      if (this.receiptID) {
        this.api.getHeaderInfo(this.receiptID).subscribe(
          (res: GetHeaderInfo[]) => {
            if (res.length > 0) {
            
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
