export class OtherFacIssueDetails{
    sno:any
        issueid: number;
        facilityname: string;
        indentno: string;
        indentdate: string;
        issueno: string;
        issueddate: string;
        nos: number;
        facindentid: number;
        facreceiptid: number;
        facreceiptno: string;
        facreceiptdate: string;
        status: string;


        constructor(issueid: number,
            facilityname: string,
            indentno: string,
            indentdate: string,
            issueno: string,
            issueddate: string,
            nos: number,
            facindentid: number,
            facreceiptid: number,
            facreceiptno: string,
            facreceiptdate: string,
            status: string){

                this.issueid= issueid;
                this.facilityname=facilityname;
                this.indentno= indentno;
                this.indentdate= indentdate;
                this.issueno= issueno;
                this.issueddate= issueddate;
                this.nos= nos;
                this.facindentid=facindentid;
                this.facreceiptid=facreceiptid;
                this.facreceiptno= facreceiptno;
                this.facreceiptdate= facreceiptdate;
                this.status= status;

        }
}