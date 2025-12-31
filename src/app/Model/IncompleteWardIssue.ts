export class IncompleteWardIssue{
        wardid: number;
        wardname: string;
        issueno: string;
        issuedate: string;
        wrequestdate: string;
        wrequestby: string;
        status: string;
        indentid: number;
        issueid: number;


        constructor(wardid: number,
            wardname: string,
            issueno: string,
            issuedate: string,
            wrequestdate: string,
            wrequestby: string,
            status: string,
            indentid: number,
            issueid: number){

                this.wardid=wardid,
                this.wardname= wardname,
                this.issueno= issueno,
                this.issuedate= issuedate,
                this.wrequestdate= wrequestdate,
                this.wrequestby= wrequestby,
                this.status= status,
                this.indentid= indentid,
                this.issueid= issueid

        }
}