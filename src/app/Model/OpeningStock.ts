export class  OpeningStock{
    id: number;
    inwno: number;
    openinG_QTY: number;
    receiptdate: string;
    facilityid: number;
    itemid: number;
    itemcode: string;
    unit: string;
    strengtH1: string;
    itemname: string;
    batchno: string;
    mfgdate: string;
    expdate: string;
    absrqty: string;
    receiptid: number;
    receiptitemid: number
    itemStock: any;
    // batchStock: any;

    constructor(id: number,
        inwno: number,
        openinG_QTY: number,
        receiptdate: string,
        facilityid: number,
        itemid: number,
        itemcode: string,
        unit: string,
        strengtH1: string,
        itemname: string,
        batchno: string,
        mfgdate: string,
        expdate: string,
        absrqty: string,
        receiptid: number,
        receiptitemid: number){

    this.id=id;
    this.inwno= inwno;
    this.openinG_QTY= openinG_QTY;
    this.receiptdate=receiptdate;
    this.facilityid=facilityid;
    this.itemid=itemid;
    this.itemcode=itemcode;
    this.unit=unit;
    this.strengtH1= strengtH1;
    this.itemname=itemname;
    this.batchno=batchno;
    this.mfgdate=batchno;
    this.expdate= expdate;
    this.absrqty=absrqty;
    this.receiptid=receiptid;
    this.receiptitemid=receiptitemid;

    }
 
}