import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-day-modal',
  imports:[CommonModule,FormsModule,HttpClientModule],
  templateUrl: './day-modal.component.html',
  styleUrls: ['./day-modal.component.css']
})
export class DayModalComponent {
  items: { itemname: string, amount: number }[] = [];
  newitemname: string = '';
  newitemamount: number = 0;
  curval: number = 0;
  datestr!: Date;
  userid!: string;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<DayModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { day: number, val: number, month: number, year: number, userid: string }
  ) {
    this.datestr = new Date(data.year, data.month, data.day + 1);
    this.curval = data.val;
    this.userid = data.userid;
    // Fetch items for the selected day
    this.fetchItems();
  }

  fetchItems(): void {
    // Get the transaction for the day
    this.http.get<any>(`https://transcation-xa5b.onrender.com/api/v1/transaction/${this.userid}/${this.datestr.toISOString().split('T')[0]}`)
      .subscribe(data => {
        this.items = data.items || [];
        this.curval=data.amount
      });
  }

  onAddItem(): void {
    if (this.newitemname && this.newitemamount > 0) {
      const data = {
        date: this.datestr.toISOString().split('T')[0],
        itemname: this.newitemname,
        amount: this.newitemamount,
        userid: this.userid
      };
      this.newitemamount=0
      this.newitemname=''
      this.http.post('https://transcation-xa5b.onrender.com/api/v1/transcation', data)
        .subscribe(response => {
          this.fetchItems(); // Refresh the item list
        });
    }
  }

  onSubmit(): void {
    this.dialogRef.close();
  }

  onDeleteItem(itemname: string): void {
    const data = {
      date: this.datestr.toISOString().split('T')[0],
      itemname: itemname,
      userid: this.userid
    };
    this.http.delete(`https://transcation-xa5b.onrender.com/api/v1/transaction/delete-item/${this.userid}/${this.datestr.toISOString().split('T')[0]}/${itemname}`)
      .subscribe(response => {
        this.fetchItems(); // Refresh the item list
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
