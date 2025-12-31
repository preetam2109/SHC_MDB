export class AAMAdminSHCstockOut{
    sno:any
    facilityid: number;
    districtname: string;
    locationname: string;
    parentfac: string;
    facilityname: string;
    nositems: number;
    stkavil: number;
    stockout: number;
    districtid: number;

    constructor(facilityid: number,
        districtname: string,
        locationname: string,
        parentfac: string,
        facilityname: string,
        nositems: number,
        stkavil: number,
        stockout: number,
        districtid: number){

            this.facilityid=facilityid,
            this.districtname= districtname,
            this.locationname= locationname,
            this.parentfac= parentfac,
            this.facilityname= facilityname,
            this.nositems= nositems,
            this.stkavil= stkavil,
            this.stockout= stockout,
            this.districtid= districtid

    }
}