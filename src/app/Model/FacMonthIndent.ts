export class FacMonthIndent{
sno!:number;
nocid: number;
nositemsreq: number;
nosissued: number;
warehouseid: number;
reqDate: string;
reqno: string;
whissuedt: string;
istatus: string;
indentid: number;
facreceiptid: number;

constructor(nocid: number,
    nositemsreq: number,
    nosissued: number,
    warehouseid: number,
    reqDate: string,
    reqno: string,
    whissuedt: string,
    istatus: string,
    indentid: number,
    facreceiptid: number
    ){


        this.nocid= nocid;
        this.nositemsreq= nositemsreq;
        this.nosissued=nosissued;
        this.warehouseid= warehouseid;
        this.reqDate= reqDate;
        this.reqno= reqno;
        this.whissuedt= whissuedt;
        this.istatus= istatus;
        this.indentid= indentid;
        this.facreceiptid= facreceiptid;



}


}