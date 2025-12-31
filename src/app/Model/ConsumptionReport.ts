export class ConsumptionReport{
        sno:any;
        id: number;
        inwno: number;
        itemid: number;
        itemcode: string;
        issuedate: string;
        strengtH1: string;
        itemname: string;
        batchno: string;
        mfgdate: string;
        expdate: string;
        issueqty: number;
        wardid: number;
        wardname: string;

        constructor(id: number,
            inwno: number,
            itemid: number,
            itemcode: string,
            issuedate: string,
            strengtH1: string,
            itemname: string,
            batchno: string,
            mfgdate: string,
            expdate: string,
            issueqty: number,
            wardid: number,
            wardname: string){

                this.id= id,
                this.inwno= inwno,
                this.itemid= itemid,
                this.itemcode= itemcode,
                this.issuedate= issuedate,
                this.strengtH1= strengtH1,
                this.itemname= itemname,
                this.batchno= batchno,
                this.mfgdate= mfgdate,
                this.expdate= expdate,
                this.issueqty= issueqty,
                this.wardid= wardid,
                this.wardname= wardname

        }
}