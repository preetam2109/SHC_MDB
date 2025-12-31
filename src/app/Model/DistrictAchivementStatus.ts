export class DistrictAchivementStatus{
    districtid: number;
    districtname: string;
    target: number;
    achivement: number;
    per: number;

    constructor(districtid: number,
        districtname: string,
        target: number,
        achivement: number,
        per: number){
            this.districtid=districtid;
            this.districtname=districtname;
            this.target=target;
            this.achivement=achivement;
            this.per= per;

    }
}