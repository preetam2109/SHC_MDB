export class IssueVoucherPdf{
    sno:any;
    inwno: number;
  batchno: string;
  mfgdate: string;
  expdate: string;
  facissueqty: number;
  itemcode: string;
  itemname: string;
  strengtH1: string;
  issueno: string;
  issuedt: string;
  wardname: string;
  status: string;

  constructor(data: any) {
    this.inwno = data.inwno;
    this.batchno = data.batchno;
    this.mfgdate = data.mfgdate;
    this.expdate = data.expdate;
    this.facissueqty = data.facissueqty;
    this.itemcode = data.itemcode;
    this.itemname = data.itemname;
    this.strengtH1 = data.strengtH1;
    this.issueno = data.issueno;
    this.issuedt = data.issuedt;
    this.wardname = data.wardname;
    this.status = data.status;
  }
}