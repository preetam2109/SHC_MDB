import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private receiptID: any;

  setReceiptID(id: any): void {
    this.receiptID = id;
  }

  getReceiptID(): any {
    return this.receiptID;
  }

  constructor() { }
}
