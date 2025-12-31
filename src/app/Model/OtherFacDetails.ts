export class OtherFacDetails{
    facilityid: number;
    facname:string;
    forder: number;
    facilitytypeid:number;

    constructor(facilityid: number,
        facname:string,
        forder: number,
        facilitytypeid:number
    ){
            this.facilityid= facilityid;
            this.facname=facname;
            this.forder= forder;
            this.facilitytypeid=facilitytypeid

    }
}