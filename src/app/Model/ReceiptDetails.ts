export class ReceiptDetails{
        facreceiptid: number;
        nocid: number;
        indentid: number;
        reqno: string;
        reqdate: string;
        whissueno: string;
        whissuedt: string;
        facreceiptno: string;
        facreceiptdate: string;
        status: string;

        constructor(facreceiptid: number,
            nocid: number,
            indentid: number,
            reqno: string,
            reqdate: string,
            whissueno: string,
            whissuedt: string,
            facreceiptno: string,
            facreceiptdate: string,
            status: string){

        this.facreceiptid= facreceiptid,
        this.nocid= nocid,
        this.indentid= indentid,
        this.reqno= reqno,
        this.reqdate= reqdate,
        this.whissueno= whissueno,
        this.whissuedt= whissuedt,
        this.facreceiptno= facreceiptno,
        this.facreceiptdate= facreceiptdate,
        this.status= status;
        
        }
}