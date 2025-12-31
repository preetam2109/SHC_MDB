export class FacilityIssueBatches{
    inwno: number;
    batchno: string;
    mfgdate: string;
    expdate: string;
    facissueqty: number;
  
    constructor(inwno: number, batchno: string, mfgdate: string, expdate: string, facissueqty: number) {
      this.inwno = inwno;
      this.batchno = batchno;
      this.mfgdate = mfgdate;
      this.expdate = expdate;
      this.facissueqty = facissueqty;
    }
}