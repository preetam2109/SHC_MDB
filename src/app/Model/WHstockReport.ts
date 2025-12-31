export class WHstockReport{
    sno!:number
    itemid: string;
    itemname: string;
    itemcode:string;
    itemtypename: number;
    unitcount:number;
    strength1: string;
    uqcSTK: number;
    readySTK: string;
  
  
    constructor(
      itemid: string,
      itemname: string,
      itemcode:string,
      strength1: string,
      itemtypename: number,
      unitcount:number,
      uqcSTK: number,
      readySTK: string
    ) {
      this.itemid = itemid;
      this.itemname = itemname;
      this.itemcode=itemcode;
      this.strength1 = strength1;
      this.itemtypename = itemtypename;
      this.unitcount=unitcount;
      this.uqcSTK = uqcSTK;
      this.readySTK = readySTK;
    }

}