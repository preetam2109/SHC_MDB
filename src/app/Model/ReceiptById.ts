export class ReceiptById{
    itemid: number;
    itemcode: string;
    itemname: string;
    batchno: string;
    mfgdate: string;
    expdate: string;
    facreceiptid: string;
    batrchreceiptqty: string;
    facreceiptitemid: string;
    inwno: string;
    rstatus: string;
    strength:any;
  
    constructor(
      itemid: number,
      itemcode: string,
      itemname: string,
      batchno: string,
      mfgdate: string,
      expdate: string,
      facreceiptid: string,
      batrchreceiptqty: string,
      facreceiptitemid: string,
      inwno: string,
      rstatus: string,
      strength:any
    ) {
      this.itemid = itemid;
      this.itemcode = itemcode;
      this.itemname = itemname;
      this.batchno = batchno;
      this.mfgdate = mfgdate;
      this.expdate = expdate;
      this.facreceiptid = facreceiptid;
      this.batrchreceiptqty = batrchreceiptqty;
      this.facreceiptitemid = facreceiptitemid;
      this.inwno = inwno;
      this.rstatus = rstatus;
      this.strength=strength;
    }
}