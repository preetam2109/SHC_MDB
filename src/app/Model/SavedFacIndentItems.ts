export class  SavedFacIndentItems{
    sno!:number
    sr: number;
    itemID: number;
    itemname: string;
    stockinhand: number;
    whindentQTY: number;
    status: string;
    itemcode: string;
    itemtypename: string;
    strengtH1: string;
    mcategory: string;
    mcid: string;

    constructor(
        sr: number,
        itemID: number,
        itemname: string,
        stockinhand: number,
        whindentQTY: number,
        status: string,
        itemcode: string,
        itemtypename: string,
        strengtH1: string,
        mcategory: string,
        mcid: string,


        ){
            this.sr= sr;
            this.itemID= itemID;
            this.itemname= itemname;
            this.stockinhand= stockinhand;
            this.whindentQTY= whindentQTY;
            this.status= status;
            this.itemcode= itemcode,
            this.itemtypename= itemtypename,
            this.strengtH1= strengtH1,
            this.mcategory= mcategory,
            this.mcid= mcid
    
        }
    
        
        
}
