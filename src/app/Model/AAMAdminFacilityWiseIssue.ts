export class AAMAdminFacilityWiseIssue{
        sno:any;
        id: number;
        itemid: number;
        itemcode: string
        itemname: string;
        strengtH1: string;
        issueqty: number;
        issuedate: string;
        wardid: number;
        wardname: string;
        inwno: number;
        batchno: number;
        mfgdate: string;
        expdate: string;
        facilityname: string;
        facilityid: number;
        districtname: string;
        locationname: string;
        districtid: number;
        locationid: number;

        constructor(id: number,
            itemid: number,
            itemcode: string,
            itemname: string,
            strengtH1: string,
            issueqty: number,
            issuedate: string,
            wardid: number,
            wardname: string,
            inwno: number,
            batchno: number,
            mfgdate: string,
            expdate: string,
            facilityname: string,
            facilityid: number,
            districtname: string,
            locationname: string,
            districtid: number,
            locationid: number){


                this.id= id,
                this.itemid= itemid,
                this.itemcode= itemcode,
                this.itemname= itemname,
                this.strengtH1= strengtH1,
                this.issueqty= issueqty,
                this.issuedate= issuedate,
                this.wardid= wardid,
                this.wardname= wardname,
                this.inwno= inwno,
                this.batchno= batchno,
                this.mfgdate= mfgdate,
                this.expdate= expdate,
                this.facilityname= facilityname,
                this.facilityid= facilityid,
                this.districtname= districtname,
                this.locationname= locationname,
                this.districtid= districtid,
                this.locationid= locationid

        }
}