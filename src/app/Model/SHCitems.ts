export class SHCitems{

itemid: number;
itemcode: string;
itemtypename: string;
itemname: string;
strengtH1: string;
multiple: number;
unitcount: number;
indentqty:number;
invalid?: boolean;
sr:number; 


constructor(itemid: number,
    itemcode: string,
    itemtypename: string,
    itemname: string,
    strengtH1: string,
    multiple: number,
    unitcount: number,
    indentqty:number,
    sr:number
    ){

        this.itemid= itemid;
        this.itemcode= itemcode;
        this.itemtypename= itemtypename;
        this.itemname= itemname;
        this.strengtH1= strengtH1;
        this.multiple= multiple;
        this.unitcount= unitcount;
        this.indentqty=indentqty;
        this.sr=sr;

}
}