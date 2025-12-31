export class GetReceiptItems {
    itemid: number;
    name: string;

    constructor(itemid: number,
        name: string) {
        this.itemid = itemid;
        this.name = name;

    }
}