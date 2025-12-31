export class ReceiptDetailsBatch{
    sno!:number
    inwno: number;
    sr: number;
    itemid: number;
    multiple: number;
    unitcount: number;
    indentqty: number;
    issuewh: number;
    itemcode: string;
    itemtypename: string;
    itemname: string;
    strengtH1: string;
    batchno: string;
    mfgdate: string;
    expdate: string;
    rqty: number;
    ponoid:number;
    qastatus:any;

    constructor(inwno: number,
        sr: number,
        itemid: number,
        multiple: number,
        unitcount: number,
        indentqty: number,
        issuewh: number,
        itemcode: string,
        itemtypename: string,
        itemname: string,
        strengtH1: string,
        batchno: string,
        mfgdate: string,
        expdate: string,
        rqty: number,
        ponoid:number,
        qastatus:any
    ){

    this.inwno= inwno,
    this.sr= sr,
    this.itemid= itemid,
    this.multiple= multiple,
    this.unitcount= unitcount,
    this.indentqty= indentqty,
    this.issuewh= issuewh,
    this.itemcode= itemcode,
    this.itemtypename= itemtypename,
    this.itemname= itemname,
    this.strengtH1= strengtH1,
    this.batchno= batchno,
    this.mfgdate= mfgdate,
    this.expdate= expdate,
    this.rqty= rqty,
    this.ponoid=ponoid,
    this.qastatus=qastatus

    }
}