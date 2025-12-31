export class ReceiptMasterFromWH{
    sno!:any
    nocid: number;
    reqdate: string;
    reqno: string;
    nositemsreq: string;
    whissueno: string;
    whissuedt: string;
    facreceiptno: string;
    facreceiptdate: string;
    rstatus: string;
    nositemsissued: number;
    indentid: number;
    facreceiptid: number;
    facilityid: number;
    warehouseid: number;
  
    constructor(
      nocid: number,
      reqdate: string,
      reqno: string,
      nositemsreq: string,
      whissueno: string,
      whissuedt: string,
      facreceiptno: string,
      facreceiptdate: string,
      rstatus: string,
      nositemsissued: number,
      indentid: number,
      facreceiptid: number,
      facilityid: number,
      warehouseid: number
    ) {
      this.nocid = nocid;
      this.reqdate = reqdate;
      this.reqno = reqno;
      this.nositemsreq = nositemsreq;
      this.whissueno = whissueno;
      this.whissuedt = whissuedt;
      this.facreceiptno = facreceiptno;
      this.facreceiptdate = facreceiptdate;
      this.rstatus = rstatus;
      this.nositemsissued = nositemsissued;
      this.indentid = indentid;
      this.facreceiptid = facreceiptid;
      this.facilityid = facilityid;
      this.warehouseid = warehouseid;
    }
}