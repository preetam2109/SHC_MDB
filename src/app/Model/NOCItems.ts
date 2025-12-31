export class  NOCItems{
    sr: number;
    itemid: any;
    nocid: number;
    requestedqty: number;
    whstock: number;
    cgmsclremarks: string;
    status: string;
    approvedqty: number;
    bookedqty: number;
    bookedflag: string;
    stockinhand: number;

    constructor(sr: number,
        itemid: any,
        nocid: number,
        requestedqty: number,
        whstock: number,
        cgmsclremarks: string,
        status: string,
        approvedqty: number,
        bookedqty: number,
        bookedflag: string,
        stockinhand: number,){

            this.sr= sr;
            this.itemid=itemid;
            this.nocid= nocid;
            this.requestedqty= requestedqty;
            this.whstock= whstock;
            this.cgmsclremarks= cgmsclremarks;
            this.status= status;
            this.approvedqty= approvedqty;
            this.bookedqty= bookedqty;
            this.bookedflag= bookedflag;
            this.stockinhand= stockinhand;
        

        }

}