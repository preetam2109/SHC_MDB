export class ConsumptionGrid{

    sno!:number
    itemId: number;
    categoryName: string;
    itemCode: string;
    itemtypename: string;
    itemName: string;
    strength1: string;
    readyForIssue: number;
    facilityId: number;
    categoryId: number;
    edlType: string;
    facissueqty:number;
    issueitemid: number;

  


    


    constructor(itemId: number,
        categoryName: string,
        itemCode: string,
        itemtypename: string,
        itemName: string,
        strength1: string,
        readyForIssue: number,
        facilityId: number,
        categoryId: number,
        edlType: string,
        facissueqty:number,
        issueitemid:number){

                this.itemId= itemId,
                this.categoryName= categoryName,
                this.itemCode= itemCode,
                this.itemtypename= itemtypename,
                this.itemName= itemName,
                this.strength1= strength1,
                this.readyForIssue= readyForIssue,
                this.facilityId= facilityId,
                this.categoryId= categoryId,
                this.edlType= edlType
                this.facissueqty=facissueqty
                this.issueitemid=issueitemid

    }

}