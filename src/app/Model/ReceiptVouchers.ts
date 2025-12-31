export class ReceiptVouchers{
    itemid: number;
    itemcode: string;
    itemname: string;
    batchno: string;
    expdate: string;  
    issuewh: string;
    indentid: string;
    facreceiptid: string;
    absrqty: string;
    batrchreceiptqty: string;
    locationno: string;
    stocklocation: string;
    facreceiptitemid: string;
    inwno: string;
    rstatus: string;
    ristatus: string;

    constructor(
        itemid: number,
        itemcode: string,
        itemname: string,
        batchno: string,
        expdate: string,
        issuewh: string,
        indentid: string,
        facreceiptid: string,
        absrqty: string,
        batrchreceiptqty: string,
        locationno: string,
        stocklocation: string,
        facreceiptitemid: string,
        inwno: string,
        rstatus: string,
        ristatus: string
      ) {
        this.itemid = itemid;
        this.itemcode = itemcode;
        this.itemname = itemname;
        this.batchno = batchno;
        this.expdate = expdate;
        this.issuewh = issuewh;
        this.indentid = indentid;
        this.facreceiptid = facreceiptid;
        this.absrqty = absrqty;
        this.batrchreceiptqty = batrchreceiptqty;
        this.locationno = locationno;
        this.stocklocation = stocklocation;
         this.facreceiptitemid=facreceiptitemid
         this.inwno=inwno;  
         this.rstatus=rstatus;  
         this.ristatus=ristatus;  
    }
}