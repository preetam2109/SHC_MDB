export class AAMAdminFacilityItemWiseStock{
    sno:any
    categoryname:string;
        itemcode: string;
        itemtypename: string;
        itemname: string;
        strengtH1: string;
        readyforissue: number;
        facilityid: number;
        itemid: number;
        categoryid: number;
        edltype: string;
        facilityname: string;
        districtname: string;
        locationname: string;
        districtid: string;
        locationid: number;

        constructor( categoryname:string,
            itemcode: string,
            itemtypename: string,
            itemname: string,
            strengtH1: string,
            readyforissue: number,
            facilityid: number,
            itemid: number,
            categoryid: number,
            edltype: string,
            facilityname: string,
            districtname: string,
            locationname: string,
            districtid: string,
            locationid: number){

                this.categoryname=categoryname
                this.itemcode= itemcode,
                this.itemtypename= itemtypename,
                this.itemname =itemname,
                this.strengtH1= strengtH1,
                this.readyforissue= readyforissue,
                this.facilityid= facilityid,
                this.itemid =itemid ,
                this.categoryid =categoryid,
                this.edltype=edltype,
                this.facilityname= facilityname,
                this.districtname=districtname,
                this.locationname= locationname,
                this.districtid =districtid,
                this.locationid =locationid

        }
}