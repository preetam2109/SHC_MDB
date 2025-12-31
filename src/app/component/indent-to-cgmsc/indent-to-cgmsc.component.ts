import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface ItemData {
  itemName: string;
  code: string;
  strength: string;
  whStock: number;
  shcStock: number;
  indentQty: number;
}
@Component({
  selector: 'app-indent-to-cgmsc',
  templateUrl: './indent-to-cgmsc.component.html',
  styleUrls: ['./indent-to-cgmsc.component.css']
})
export class IndentToCgmscComponent {
  form: FormGroup;
  items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  displayedColumns: string[] = ['itemName', 'code', 'strength', 'whStock', 'shcStock', 'indentQty'];
  dataSource = new MatTableDataSource<ItemData>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      itemType: [''],
      selectItem: [''],
      itemName: [''],
      code: [''],
      strength: [''],
      whStock: [''],
      shcStock: [''],
      indentQty: ['']
    });
  }

  onSubmit() {
    const formData: ItemData = this.form.value;
    this.dataSource.data = [...this.dataSource.data, formData];
    this.form.reset();
  }
}