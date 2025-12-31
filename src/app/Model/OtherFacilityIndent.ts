export class OtherFacilityIndent{
        sno:any
        indentno: string;
        indentdate: string;
        facilityname: string;
        facilityid: string;
        fromfacilityid: string;
        indentid: string;
        status: string;
    
        constructor(
            indentno: string,
            indentdate: string,
            facilityname: string,
            facilityid: string,
            fromfacilityid: string,
            indentid: string,
            status: string
        ) {
            this.indentno = indentno;
            this.indentdate = indentdate;
            this.facilityname = facilityname;
            this.facilityid = facilityid;
            this.fromfacilityid = fromfacilityid;
            this.indentid = indentid;
            this.status = status;
        }
    }
    