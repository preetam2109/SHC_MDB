export class NearExpStock{
    sno!:number
    itemcode: string;
  itemname: string;
  strengtH1: string | null;
  batchno: string;
  expdate: string;
  exptimeline: string;
  facstock: number;
  inwno: number;

  constructor(
    itemcode: string,
    itemname: string,
    strengtH1: string | null,
    batchno: string,
    expdate: string,
    exptimeline: string,
    facstock: number,
    inwno: number
  ) {
    this.itemcode = itemcode;
    this.itemname = itemname;
    this.strengtH1 = strengtH1;
    this.batchno = batchno;
    this.expdate = expdate;
    this.exptimeline = exptimeline;
    this.facstock = facstock;
    this.inwno = inwno;
  }

}