export class FacilityIssueDateWise{
    sno:number
    facilityid: number;
    itemid: number;
    inwno: number;
    issueqty: number;
    itemcode: string;
    itemname: string;
    strengtH1: string;
    wardname: string;
    issueddate: string; 
    districtid: number;


    constructor(sno:number,facilityid: number,
        itemid: number,
        inwno: number,
        issueqty: number,
        itemcode: string,
        itemname: string,
        strengtH1: string,
        wardname: string,
        issueddate: string, 
        districtid: number){
            this.sno=sno;
            this.facilityid=facilityid,
            this.itemid=itemid,
            this.inwno= inwno,
            this.issueqty=issueqty,
            this.itemcode=itemcode,
            this.itemname=itemname,
            this.strengtH1=strengtH1,
            this.wardname=wardname,
            this.issueddate=issueddate, 
            this.districtid=districtid

    }
}