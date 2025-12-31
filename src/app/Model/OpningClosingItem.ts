export class OpningClosingItem{
  sno!:number;
  opening!:number
  ReceivedQTY!:number;
  ConsuptionQTY!:number;
  closing!:number;
    dt: string;
  typE1: string;
  type: string;
  trandate: string;
  qty: number;
  trantype: string;
  place: string;
  tranno: string;
  receiptitemid: string;

  constructor(
    dt: string,
    typE1: string,
    type: string,
    trandate: string,
    qty: number,
    trantype: string,
    place: string,
    tranno: string,
    receiptitemid: string
  ) {
    this.dt = dt;
    this.typE1 = typE1;
    this.type = type;
    this.trandate = trandate;
    this.qty = qty;
    this.trantype = trantype;
    this.place = place;
    this.tranno = tranno;
    this.receiptitemid = receiptitemid;
  }
}