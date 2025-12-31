import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { Category } from '../Model/Category';
import { Item } from '../Model/Item';
import { StorageLocation } from '../Model/StorageLocation';
import { OpeningStock } from '../Model/OpeningStock';
import { ReceiptID } from '../Model/ReceiptID';
import { SharedService } from './shared.service';
import { FacMonthIndent } from '../Model/FacMonthIndent';
import { MonthIndentProgram } from '../Model/MonthIndentProgram';
import { FacMonthIndentItems } from '../Model/FacMonthIndentItems';
import { SHCitems } from '../Model/SHCitems';
import { NOCItems } from '../Model/NOCItems';
import { SavedFacIndentItems } from '../Model/SavedFacIndentItems';
import { FacilityInfo } from '../Model/FacilityInfo';
import { ReceiptMasterFromWH } from '../Model/ReceiptMasterFromWH';
import { tbFacilityReceiptsModel } from '../Model/tbFacilityReceiptsModel';
import { ReceiptDetailsBatch } from '../Model/ReceiptDetailsBatch';
import { ReceiptItems } from '../Model/ReceiptItems';
import { StockReport } from '../Model/StockReport';
import { HoldStock } from '../Model/HoldStock';
import { WHstockReport } from '../Model/WHstockReport';
import { NearExpStock } from '../Model/NearExpStock';
import { ReceiptDetails } from '../Model/ReceiptDetails';
import { IncompleteWardIssue } from '../Model/IncompleteWardIssue';
import { WIssueMaster } from '../Model/WIssueMaster';
import { LastIssueDT } from '../Model/LastIssueDT';
import { FacilityIssueBatches } from '../Model/FacilityIssueBatches';
import { FacilityIssueDateWise } from '../Model/FacilityIssueDateWise';
import { OpningClosingItem } from '../Model/OpningClosingItem';
import { GetReceiptItems } from '../Model/GetReceiptItems';
import { stockReportParent } from '../Model/stockReportParent';
import { IssueVoucherPdf } from '../Model/IssueVoucherPdf';
import { getSHCMassItems } from '../Model/getSHCMassItems';
import { ReceiptVouchers } from '../Model/ReceiptVouchers';
import { ReceiptById } from '../Model/ReceiptById';
import { DistrictAchivementStatus } from '../Model/DistrictAchivementStatus';
import { OtherFacilityIndent } from '../Model/OtherFacilityIndent';
import { OtherFacDetails } from '../Model/OtherFacDetails';
import { OtherFacIssueDetails } from '../Model/OtherFacIssueDetails';
import { OpstockCheck } from '../Model/OpstockCheck';
import { UserDataForForgotPassword } from '../Model/UserDataForForgotPassword';
import { ConsumptionReport } from '../Model/ConsumptionReport';
import { KPIdistWise } from '../Model/KPIdistWise';
import { AAMAdminFacilityWiseIssue } from '../Model/AAMAdminFacilityWiseIssue';
import { AAMAdminFacilityItemWiseStock } from '../Model/AAMAdminFacilityItemWiseStock';
import { AAMAdminSHCstockOut } from '../Model/AAMAdminSHCstockOut';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {


  private apiUrl = 'https://dpdmis.in/AAMAPIMR/api';

  private CGMSCHO_API2 = 'https://dpdmis.in/CGMSCHO_API2/api';

  constructor(private sharedService: SharedService,private http:HttpClient) { }
// updateHeaderInfo( usrFacilityID:number,  receiptID:number,  receiptNo:string, receiptDate:string){
// this.http.put(`http://140.238.246.250:8080/api/CGMSCStock/UpdateHeaderInfo`,{ usrFacilityID, receiptID, receiptNo, receiptDate }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
// }
updateHeaderInfo(usrFacilityID: number, receiptID: number, receiptNo: string, receiptDate: string): Observable<any> {
  
  const url = `${this.apiUrl}/CGMSCStock/UpdateHeaderInfo`;
  const params = {
    usrFacilityID: usrFacilityID,
    receiptID: receiptID,
    receiptNo,
    receiptDate
  };
  
  return this.http.put(url, null, { params });
}
// http://140.238.246.250:8080/api/CGMSCStock/getMainCategory?faclityId=2651
getItemCategory(faclityId: any): Observable<Category[]> {
  
  const url = `http://140.238.246.250:8080/api/CGMSCStock/getItemCategory`;
  const params = { faclityId };

  return this.http.get<Category[]>(url, { params });
}
getAyushItems(catid: string): Observable<Item[]> {
  
  // const url = `https://dpdmis.in/FourthTierDpdmisAPI/api/CGMSCStock/getAyushItems`;
  const url = `${this.apiUrl}/CGMSCStock/getAyushItems`;
  // ?catid=52
  const params = { catid };

  return this.http.get<Item[]>(url, { params });
}
getFileStorageLocation(whid:string){
  const url = `http://140.238.246.250:8080/api/CGMSCStock/getFileStorageLocation`;
  const params = { whid };

  return this.http.get<StorageLocation[]>(url, { params });
}

getHeaderInfo(receiptID: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/CGMSCStock/GetHeaderInfo`, {
    params: { ReceiptID: receiptID }
  });
}
saveBatchRecord(mItemID: number,mBatchNo: string,mStockLocation: string,mMfgDate: string,mExpDate: string,mAbsRQty: string,facilityId: string,receiptID:string): Observable<any> {
  
  const params = new HttpParams()
      .set('mItemID', mItemID.toString())
      .set('mBatchNo', mBatchNo)
      .set('mStockLocation', mStockLocation)
      .set('mMfgDate', mMfgDate)
      .set('mExpDate', mExpDate)
      .set('mAbsRQty', mAbsRQty)
      .set('facilityId', facilityId)
      .set('receiptID', receiptID.toString());

  return this.http.put(`${this.apiUrl}/CGMSCStock/SaveBatchRecord`,null,{ params, responseType: 'text' });
}

getOpeningStocksReport(itemid: any, usrFacilityID: string): Observable<OpeningStock> {
  const params = new HttpParams()
    .set('itemid', itemid.toString())
    .set('usrFacilityID', usrFacilityID);

  return this.http.get<OpeningStock>(`${this.apiUrl}/CGMSCStock/getOpeningStocksReport`, { params });
}
deleteOpeningStockRow(mReceiptID: number, mReceiptItemidID: number, minwno: number): Observable<any> {
  
  const params = new HttpParams()
    .set('mReceiptID', mReceiptID)
    .set('mReceiptItemidID', mReceiptItemidID)
    .set('minwno', minwno);

  return this.http.delete(`${this.apiUrl}/CGMSCStock/OpeningStockRowDelete`, { params, responseType: 'text' });
}

freezeOpeningStock(mReceiptID:number){
  
const params = new HttpParams().set('mReceiptID', mReceiptID);
return this.http.put(`${this.apiUrl}/CGMSCStock/FreezeOpeningStock`,{},{ params, responseType: 'text' });
}
getFacreceiptid(usrFacilityID: any): Observable<any> {
  
  return this.http.get<ReceiptID[]>(`${this.apiUrl}/CGMSCStock/GetFacreceiptid?usrFacilityID=${usrFacilityID}`);
}

// getFacreceiptid(usrFacilityID: string): Observable<Receipt[]> {
//   return this.http.get<Receipt[]>(`your-api-url`);
// }

fetchAndSetReceiptID(usrFacilityID: string): void {
  
  this.getFacreceiptid(usrFacilityID).subscribe((res: ReceiptID[]) => {
    if (res && res.length > 0) {
      this.sharedService.setReceiptID(res[0].facreceiptid);
    } else {
      console.error('No receipt ID found in the response');
    }
  }, (error: any) => {
    console.error('Error fetching receipt ID:', error);
  });
}

getFacMonthIndent(facid:any,istatus:string){
  debugger
  return this.http.get<FacMonthIndent[]>(`${this.apiUrl}/Indent/FacMonthIndent?facid=${facid}&istatus=${istatus}`);
}
getIndentTimline(facid:any,distId:any){

  return this.http.get(`${this.apiUrl}/Indent/getIndentTimline?facid=${facid}&distId=${distId}`);

}
getMonthIndentProgram(){
  return this.http.get<MonthIndentProgram[]>(`${this.apiUrl}/Indent/getMonthIndentProgram`);
}
getDrugCategory(){
  return this.http.get<Category[]>(`${this.apiUrl}/Indent/getMainCategory?faclityId=HOD`);
}
getDrugTypeCategory(faclityId:any,Mcatid:number,indendid:number){
  
  return this.http.get<FacMonthIndentItems[]>(`${this.apiUrl}/Indent/getFacMonthIndentItems?faclityId=${faclityId}&Mcatid=${Mcatid}&indendid=${indendid}`);
}
getSHCitems(mcid:number,nocid:number){
  
return this.http.get<SHCitems>(`${this.apiUrl}/Indent/getSHCitems?mcid=${mcid}&nocid=${nocid}`);
}
getSHCMassItems(){
return this.http.get<getSHCMassItems[]>(`${this.apiUrl}/CGMSCStock/getSHCItems`);

}
//http post request
// postNOCitems(nocitems: NOCItems) {
//   
//   return this.http.post('https://dpdmis.in/FourthTierDpdmisAPI/api/Indent/postNOCitems', nocitems,{ responseType: 'text' });
// }
postNOCitems(nocitems: NOCItems, sr: number) {
  

  // Create HttpParams and set the 'sr' value
  let params = new HttpParams().set('sr', sr.toString());

  // Pass the params as part of the HTTP options
  return this.http.post(`${this.apiUrl}/Indent/postNOCitems`, nocitems, {
    params: params,
    responseType: 'text'
  });
  
}

  freezeNOCitems(nocid: any) {
    
    // return this.http.put(`${this.apiUrl}/DataTransfer/TransferDataAsync_Freeze_MASCGMSCNOC_M2O?nocid=${nocid}`, {}, { responseType: 'text' });
    return this.http.post(`${this.apiUrl}/DataTransfer/TransferDataAsync_Freeze_MASCGMSCNOC_M2O?nocid=${nocid}`, {}, { responseType: 'text' });
  }

  deleteIndent(nocid: any) {
    return this.http.delete(`${this.apiUrl}/Indent/deletecgmscNoCitemsALL?nocid=${nocid}`,{ responseType: 'text' });
  }

  getSavedFacIndentItems(nocid:any){
return this.http.get<SavedFacIndentItems[]>(`${this.apiUrl}/Indent/getSavedFacIndentItems?nocid=${nocid}`);

  }

  getFacilityInfo(facId:any,userid:any,whId:any,distId:any){
    
    return this.http.get<FacilityInfo[]>(`${this.apiUrl}/Indent/getFacilityInfo?facId=${facId}&userid=${userid}&whId=${whId}&distId=${distId}`);
  }



  getOTPSaved(userid:any, ipAddress: any){
    
    return this.http.post(`${this.apiUrl}/Login/getOTPSaved?userid=${userid}&ipAddress=${encodeURIComponent(ipAddress)}`,{ responseType: 'text' });
  }


  // getOTPSaved(userid: any, macAddress: any, ipAddress: any) {
  //   const url = `${this.CGMSCHO_API2}/Login/getOTPSaved?userid=${userid}&macAddress=${encodeURIComponent(macAddress)}&ipAddress=${encodeURIComponent(ipAddress)}`;
  //   return this.http.post(url, null, { responseType: 'text' });
  // }



  VerifyOTPLogin(otp:any,userid:any){
    
    return this.http.get(`${this.apiUrl}/Login/VerifyOTPLogin?otp=${otp}&userid=${userid}`,{ responseType: 'text' });
  }
  
  getReceiptMasterFromWH(faclityId:any,status:any){

    return this.http.get<ReceiptMasterFromWH[]>(`${this.apiUrl}/Receipt/getReceiptMasterFromWH?faclityId=${faclityId}&status=${status}`);
  }
  getReceiptIssueNo(facid:any){
    
    return this.http.get(`${this.apiUrl}/Receipt/getReceiptIssueNo?facid=${facid}`,{ responseType: 'text' });
  }

  postReceiptMaster(receiptmaster: tbFacilityReceiptsModel, facid: number) {
    
  
    // Create HttpParams and set the 'sr' value
    let params = new HttpParams().set('facid', facid.toString());
  
    // Pass the params as part of the HTTP options
    return this.http.post(`${this.apiUrl}/Receipt/postReceiptMaster`, receiptmaster, {
      params: params,
      // responseType: 'text'
    });
  }

  getReceiptDetailsBatch(nocid:any,facid:any,indentid:any){
    
    return this.http.get<ReceiptDetailsBatch[]>(`${this.apiUrl}/Receipt/getReceiptDetailsBatch?nocid=${nocid}&facid=${facid}&indentid=${indentid}`)
  }


  postReceiptItems(receiptItems: ReceiptItems,mponoid:any,rackID:any,facid:any,facReceiptId:any,whinwno:any,indentId:any) {
    
  
    // Create HttpParams and set the 'sr' value
    const params = new HttpParams()
    .set('mponoid', mponoid.toString())
    .set('rackID', rackID.toString())
    .set('facid', facid)
    .set('facReceiptId', facReceiptId)
    .set('whinwno', whinwno)
    .set('indentId', indentId)
  
    // Pass the params as part of the HTTP options
    return this.http.post(`${this.apiUrl}/Receipt/postReceiptItems`, receiptItems, {
      params: params, 
      responseType: 'text'
    });
  }

  getStockReport(facilityId:any,itemid:any,iType:any){
    
return this.http.get<StockReport[]>(`${this.apiUrl}/CGMSCStock/stockReport?faclityId=${facilityId}&itemid=${itemid}&catname=${iType}`)
  }
  FacilityIssueCurrectstock(facilityId:any,itemid:any,catname:any,issueid:any){
return this.http.get<StockReport[]>(`${this.apiUrl}/Issue/FacilityIssueCurrectstock?faclityId=${facilityId}&itemid=${itemid}&catname=${catname}&issueid=${issueid}`)
  }

  getHoldStock(facilityId:any){
return this.http.get<HoldStock[]>(`https://dpdmis.in/CGMSCHO_API2/api/CGMSCStock/getHoldStock?faclityId=${facilityId}`)
  }
  getWHstockReport(facid:any){
    
// return this.http.get<WHstockReport[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/CGMSCStock/GetWHStockAAM?facid=${facid}`)
return this.http.get<WHstockReport[]>(`${this.CGMSCHO_API2}/CGMSCStock/GetWHStockAAM?facid=${facid}`)
  }
  getWHStockAAMBatchWise(facid:any){
    
// return this.http.get<WHstockReport[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/CGMSCStock/GetWHStockAAMBatchWise?facid=${facid}`)
return this.http.get<WHstockReport[]>(`${this.apiUrl}/CGMSCStock/GetWHStockAAMBatchWise?facid=${facid}`)
  }
  getNearExpStock(facilityId:any,criteria:any){
    
return this.http.get<NearExpStock[]>(`${this.apiUrl}/CGMSCStock/getNearExpStock?faclityId=${facilityId}&criteria=${criteria}`)
  }
  getReceiptDetails(indentId:any,facid:any){
return this.http.get<ReceiptDetails[]>(`${this.apiUrl}/Receipt/getReceiptDetails?indentId=${indentId}&facid=${facid}`)
  }
  getReceiptVouchers(facId:any,receiptId:any){
return this.http.get<ReceiptVouchers[]>(`${this.apiUrl}/Receipt/getReceiptVouchers?facId=${facId}&receiptId=${receiptId}`)
  }

  deleteReceipts(receiptId:any){
    
return this.http.delete(`${this.apiUrl}/Receipt/deleteReceipts?receiptId=${receiptId}`,{ responseType: 'text' });
  }

  freezeReceipts(receiptId: any) {
    
    return this.http.put(`${this.apiUrl}/Receipt/completeReceipts?receiptId=${receiptId}`, {}, { responseType: 'text' });
  }
  getIncompleteWardIssue(faclityId:any,status:any,wardid:any){

return this.http.get<IncompleteWardIssue[]>(`${this.apiUrl}/issue/getIncompleteWardIssue?faclityId=${faclityId}&status=${status}&wardid=${wardid}`)

  }


  postIssueNo(facid: any,issueData: WIssueMaster) {
    
  
    // Create HttpParams and set the 'sr' value
    let params = new HttpParams().set('facid', facid.toString());
  
    // Pass the params as part of the HTTP options
    return this.http.post(`${this.apiUrl}/issue/postIssueNo`, issueData, {
      params: params,
      // responseType: 'text'
    });
  }

 
  postWardIssue(facid: any,issueData: any) {
    
  
    // Create HttpParams and set the 'sr' value
    let params = new HttpParams().set('facid', facid.toString());
  
    // Pass the params as part of the HTTP options
    return this.http.post(`${this.apiUrl}/issue/postWardIssue`, issueData, {
      params: params,
      responseType: 'text'
    });
  }
  deleteWardIssues(issueId: any) {
    return this.http.delete(`${this.apiUrl}/issue/deleteWardIssues?IssueID=${issueId}`,{ responseType: 'text' });
  }

  getLastIssueDT(facid:any){
    // return this.http.get<LastIssueDT[]>(`https://dpdmis.in//FourthTierDpdmisAPI/api/Issue/getLastIssueDT?facid=${facid}`);
    return this.http.get<LastIssueDT[]>(`${this.apiUrl}/Issue/getLastIssueDT?facid=${facid}`);

  }

  FacilityIssueBatches(faclityIssueItemId:any){
    
    return this.http.get<FacilityIssueBatches[]>(`${this.apiUrl}/Issue/getFacilityIssueBatches?faclityIssueItemId=${faclityIssueItemId}`);

  }
  freezeWardIssues(issueId: any) {
    return this.http.put(`${this.apiUrl}/Issue/completeWardIssues?IssueID=${issueId}`, {}, { responseType: 'text' });
  }
  deleteIssueItemIdIfExist(IssueItemID:any){
    return this.http.get(`${this.apiUrl}/Issue/deleteIssueItemIdIfExist?IssueItemID=${IssueItemID}`);

  }

  getFacilityIssueDateWise(StartDt:string,EndDt:string,facilityId:any,distid:any){
    return this.http.get<FacilityIssueDateWise[]>(`https://dpdmis.in/CGMSCHO_API2/api/Facility/FacilityIssueDateWise?StartDt=${StartDt}&EndDt=${EndDt}&facilityId=${facilityId}&distid=${distid}`);
  }
  GetReceiptItems(facId:any){
    return this.http.get<GetReceiptItems[]>(`${this.apiUrl}/CGMSCStock/GetReceiptItems?facId=${facId}`);
  }
  getOpningClosingItem(facId:any,itemId:any,fromDate:any){
    
    return this.http.get<OpningClosingItem[]>(`${this.apiUrl}/CGMSCStock/GetOpningClosingItem?facId=${facId}&itemId=${itemId}&fromDate=${fromDate}`);

  }



  getstockReportParent(faclityId: any, itemid: any, catname: any) {
    
    // const url = 'https://dpdmis.in/FourthTierDpdmisAPI/api/CGMSCStock/stockReportParent';
    const url = `${this.apiUrl}/CGMSCStock/stockReportParent`;
  
    const params = new HttpParams()
      .set('faclityId', encodeURIComponent(faclityId))
      .set('itemid', encodeURIComponent(itemid))
      .set('catname', encodeURIComponent(catname));
  
    return this.http.get<stockReportParent[]>(url, { params }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to fetch stock report. Please try again.'));
      })
    );
  }
  

      
      getIssueVoucherPdf(issueId:any){
        
    return this.http.get<IssueVoucherPdf[]>(`${this.apiUrl}/Issue/getIssueVoucherPdf?issueId=${issueId}`)
      }

      getReceiptById(facId:any,receiptId:any){
        return this.http.get<ReceiptById[]>(`${this.apiUrl}/Receipt/getReceiptById?facId=${facId}&receiptId=${receiptId}`)
          }
          getDistrictAchivementStatus(){
        // return this.http.get<DistrictAchivementStatus[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/CGMSCStock/getDistrictAchivementStatus`)
        return this.http.get<DistrictAchivementStatus[]>(`${this.apiUrl}/CGMSCStock/getDistrictAchivementStatus`)
          }


          getOtherFacilityIndent(facid:any){
            return this.http.get<OtherFacilityIndent[]>(`${this.apiUrl}/Indent/OtherFacilityIndent?facid=${facid}`)

          }
          getBlockFac(facid:any){
            return this.http.get<OtherFacDetails[]>(`${this.apiUrl}/Indent/getBlockFac?facid=${facid}`)

          }
//           postOtherFacilityIndent(facid:any,Target_facid:any,programid:any,indentDt:any){
// 
//             if(sessionStorage.getItem('facilityTypeId')==='377'){
              
//               return this.http.post(`${this.apiUrl}/Indent/postOtherFacilityIndent?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}`,{},{ responseType: 'text' })
//             }else{


//               return  this.http.post(`${this.apiUrl}/Indent/postOtherFacilityIndent?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}`,{},{ responseType: 'text' })

//                this.http.post(`${this.apiUrl}/Ora/postOtherFacilityIndent1?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}`,{},{ responseType: 'text' })
//             }

            
//           }
postOtherFacilityIndent(facid: any, Target_facid: any, programid: any, indentDt: any,selectedFacilityTypeId:any): Observable<any> {
  ;
  if (selectedFacilityTypeId===377) {
    return this.http.post(
      `${this.apiUrl}/Indent/postOtherFacilityIndent?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}`,
      {},
      { responseType: 'text' }
    );
  } else {
    
    // Parallel execution
    const firstRequest = this.http.post(
      `${this.apiUrl}/Indent/postOtherFacilityIndent?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}`,
      {},
      { responseType: 'text' }
    );

    // const secondRequest = this.http.post(
    //   `${this.apiUrl}/Ora/postOtherFacilityIndent1?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}`,
    //   {},
    //   { responseType: 'text' }
    // );

    return forkJoin([firstRequest]);
  }
}

postOtherFacilityIndent1(facid: any, Target_facid: any, programid: any, indentDt: any,mTranferId:any){

    return this.http.post(`${this.apiUrl}/Ora/postOtherFacilityIndent1?facid=${facid}&indentDt=${indentDt}&programid=${programid}&Target_facid=${Target_facid}&mTranferId=${mTranferId}`,{},{ responseType: 'text' });

}

          getOtherFacIndentItems(mcid:any,indentid:any){
            return this.http.get<SHCitems[]>(`${this.apiUrl}/Indent/getOtherFacIndentItems?mcid=${mcid}&indentid=${indentid}`)

          }
          
          postOtherFacIndentItems(data: {
          
            
            indentitemid: number;
            indentid: number;
            itemid: number;
            requestedqty: number;
            facstock: number;
            approvedqty: number;
            status: string;
            stockinhand: number;
            // mtransferid:number
          }, sr: any,
          facilitytypeid:any
        ): Observable<any> {
          
          
            if(facilitytypeid===377){

              return this.http.post(`${this.apiUrl}/Indent/postOtherFacIndentitems?sr=${sr}`, data, { responseType: 'text' });
            }else{

              const firstrequest= this.http.post(`${this.apiUrl}/Indent/postOtherFacIndentitems?sr=${sr}`, data, { responseType: 'text' });

              const secondRequest= this.http.post(`${this.apiUrl}/Ora/postOtherFacIndentitems?sr=${sr}`, data, { responseType: 'text' });

              return forkJoin([firstrequest,secondRequest]);
            }

          }
          
          completeOtherFacIndent(indentId:any){
            if(sessionStorage.getItem('facilityTypeId')==='377'){

              return this.http.put(`${this.apiUrl}/Indent/completeOtherFacIndent?indentId=${indentId}`,{},{ responseType: 'text' })
            }else{
              return this.http.put(`${this.apiUrl}/Ora/completeOtherFacIndent?indentId=${indentId}`,{},{ responseType: 'text' })

            }


          }

          deleteOtherFaceIdent(indentId: any) {
            
            const mariadbDelete = this.http.delete(`${this.apiUrl}/Indent/deleteOtherFaceIdent?indentId=${indentId}`,{ responseType: 'text' });
            const OracleDelete = this.http.delete(`${this.apiUrl}/Ora/deleteOtherFaceIdent?indentId=${indentId}`,{ responseType: 'text' });

            return forkJoin([mariadbDelete,OracleDelete]);
          }

          printOtherFacIndentDetails(indentId: any){
          return this.http.get<SHCitems[]>(`${this.apiUrl}/Indent/OtherFacIndentDetails?indentId=${indentId}`);

          }

          getOtherFacIssueDetails(faclityId:any,status:any, issueid:any, recno:any){
            
          return this.http.get<OtherFacIssueDetails[]>(`${this.apiUrl}/Receipt/getOtherFacIssueDetails?faclityId=${faclityId}&status=${status}&issueid=${issueid}&recno=${recno}`);

          }

          postReceiptMasterSP(tofacid:any,indentid: any, issueid: any, facid: number, receiptmaster: tbFacilityReceiptsModel) {
            
          
            // Create HttpParams and set the values
            let params = new HttpParams()
            .set('tofacid', tofacid.toString())
              .set('indentid', indentid.toString())
              .set('facid', facid.toString())
              .set('issueid', issueid.toString());
          
            // Pass the params as part of the HTTP options
            return this.http.post(
              `${this.apiUrl}/Receipt/postReceiptMasterSP`,
              receiptmaster,
              {
                params: params,
                // responseType: 'text'
              }
            );
          }
          

          getReceiptIssueSP(facid:any){
    
            // return this.http.get(`https://dpdmis.in//FourthTierDpdmisAPI/api/Receipt/getReceiptIssueNoSP?facid=${facid}`,{ responseType: 'text' });
            return this.http.get(`${this.apiUrl}/Receipt/getReceiptIssueNoSP?facid=${facid}`,{ responseType: 'text' });
          }

          getReceiptDetailsBatchSP(facReceiptId:any,facid:any,indentid:any){
            
            // chenges here
            return this.http.get<ReceiptDetailsBatch[]>(`${this.apiUrl}/Receipt/getReceiptDetailsBatchSP?facReceiptId=${facReceiptId}&facid=${facid}&indentid=${indentid}`)
          }




          postReceiptItemsSP(receiptItems: ReceiptItems,indentId:any,rackID:any,facid:any,facReceiptId:any,whinwno:any) {
            
          
            // Create HttpParams and set the 'sr' value
            const params = new HttpParams()
            .set('rackID', rackID.toString())
            .set('indentId', indentId)
            .set('facid', facid)
            .set('facReceiptId', facReceiptId)
            .set('whinwno', whinwno)
          
            // Pass the params as part of the HTTP options
            return this.http.post(`${this.apiUrl}/Receipt/postReceiptItemsSP`, receiptItems, {
              params: params,
              responseType: 'text'
            });
          }

          getOpstockCheck( facid:any){
            return this.http.get<OpstockCheck[]>(`${this.apiUrl}/Receipt/getOpstockCheck?facid=${facid}`)

          }

          changePassword(userId: number, newPass: string): Observable<any> {
            
            // Set headers if needed (e.g., if the API requires specific headers)
            const headers = new HttpHeaders({
              'Content-Type': 'application/json'
            });
        
            // Construct the complete URL with query parameters
            const url = `${this.apiUrl}/Issue/ChangpasswordbyID?userid=${userId}&newpass=${newPass}`;
        
            // Send the POST request (adjust method if necessary)
            return this.http.post(url, {}, { headers });
          }

          getUserDataForForgotPassword(useremaiid:any){
            
            return this.http.get<UserDataForForgotPassword>(`${this.apiUrl}/AAMAdmin/getUserDataForForgotPassword?useremaiid=${useremaiid}`)

          }


          getConsumptionReport(stktype:any,facId:any,itemId:any,fromDate:any,todate:any){
            
            return this.http.get<ConsumptionReport[]>(`${this.apiUrl}/CGMSCStock/ConsumptionReport?stktype=${stktype}&facId=${facId}&itemId=${itemId}&fromDate=${fromDate}&todate=${todate}`);
            // api/CGMSCStock/ConsumptionReport?stktype=B&facId=23446&itemId=0&fromDate=01-Oct-2024&todate=30-Nov-2024
        
          }
          
          getKPIdistWise(distId:any){
            
            // return this.http.get<KPIdistWise[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/AAMAdmin/KPIdistWise`);
            // https://dpdmis.in/AAMAPIMR/api/AAMAdmin/KPIFacWiseDrillDown?distId=2203
            // return this.http.get<KPIdistWise[]>(`${this.apiUrl}/AAMAdmin/KPIdistWise`);
            return this.http.get<KPIdistWise[]>(`${this.apiUrl}/AAMAdmin/KPIFacWiseDrillDown?distId=${distId}`);
        
          }
      

          getFacilityWiseIssue(distId:any,facId:any,itemId:any,fromDate:any,todate:any){
            // return this.http.get<AAMAdminFacilityWiseIssue[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/AAMAdmin/getFacilityWiseIssue?distId=${distId}&facId=${facId}&itemId=${itemId}&fromDate=${fromDate}&todate=${todate}`);
            return this.http.get<AAMAdminFacilityWiseIssue[]>(`${this.apiUrl}/AAMAdmin/getFacilityWiseIssue?distId=${distId}&facId=${facId}&itemId=${itemId}&fromDate=${fromDate}&todate=${todate}`);
        
          }
          getFacilityItemWiseStock(distId:any,facId:any,itemId:any){
            // return this.http.get<AAMAdminFacilityItemWiseStock[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/AAMAdmin/getFacilityItemWiseStock?distId=${distId}&facId=${facId}&itemId=${itemId}`);
            return this.http.get<AAMAdminFacilityItemWiseStock[]>(`${this.apiUrl}/AAMAdmin/getFacilityItemWiseStock?distId=${distId}&facId=${facId}&itemId=${itemId}`);
        
          }
          getSHCstockOut(distId:any){
            // return this.http.get<AAMAdminSHCstockOut[]>(`https://dpdmis.in/FourthTierDpdmisAPI/api/AAMAdmin/getSHCstockOut?distId=${distId}`);
            return this.http.get<AAMAdminSHCstockOut[]>(`${this.apiUrl}/AAMAdmin/getSHCstockOut?distId=${distId}`);

          }
          

          AAMHealthPerformance(){
            return this.http.get<any[]>(`${this.apiUrl}/AAMAdmin/AAMHealthPerformance`);
          }
          KPIFacWiseDrillDown(distId:any){
            return this.http.get<any[]>(`${this.apiUrl}/AAMAdmin/KPIFacWiseDrillDown?distId=${distId}`);
          }


          KPIFacilityDetai(distId:any){
            return this.http.get<any[]>(`${this.apiUrl}/AAMAdmin/KPIFacilityDetai?distId=${distId}`);
            
          }
          // updateFacilityContact(facid: any,issueData: any) {
          //   // https://dpdmis.in/AAMAPIMR/api/AAMAdmin/updateFacilityContact?facilityId=27955&contactPersonName=Khushboo Sarva&phone1=9399805726
          // // https://dpdmis.in/AAMAPIMR/api
          //   // Create HttpParams and set the 'sr' value
          //   // let params = new HttpParams().set('facid', facid.toString());
          
          //   // // Pass the params as part of the HTTP options
          //   // return this.http.put(`${this.apiUrl}/issue/postWardIssue`, issueData, {
          //   //   params: params,
          //   //   responseType: 'text'
          //   // });
            
          // }
          updateFacilityContact(facilityId: any,contactPersonName: any,phone1:any) {
            // https://dpdmis.in/AAMAPIMR/api/AAMAdmin/updateFacilityContact?facilityId=27955&contactPersonName=Khushboo Sarva&phone1=9399805726
        
            return this.http.put(`${this.apiUrl}/AAMAdmin/updateFacilityContact?facilityId=${facilityId}&contactPersonName=${contactPersonName}&phone1=${phone1}`,{});

          }



}












