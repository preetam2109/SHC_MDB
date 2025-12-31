import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OpeningStock } from 'src/app/Model/OpeningStock';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-opening-stock-report',
  templateUrl: './opening-stock-report.component.html',
  styleUrls: ['./opening-stock-report.component.css']
})
export class OpeningStockReportComponent {
goBack() {
  this.router.navigate(['/OpStocks'])
}
  stocks:OpeningStock[]=[]
  openingStockDate: string 
  usrFacilityID:any=sessionStorage.getItem('facilityId'); // Set the appropriate value


  constructor(public router:Router,public api: ApiServiceService){
    const currentDate = new Date();
    this.openingStockDate = currentDate.toLocaleDateString('en-GB');
  }

  ngOnInit() {
    this.getOpeningStocksReport();

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

}
