import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DayModalComponent } from '../day-modal/day-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import  * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calendar',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysInMonth: number[] = [];
  selectedMonth: number = this.currentMonth;
  selectedYear: number = this.currentYear;
  transactions: { date: string, amount: number }[] = [];  // Store transactions here
  transactionsForDay: { [key: number]: number } = {};  // Mapping of day to transaction amounts
  userid!:string
  constructor(private cdr: ChangeDetectorRef, private http: HttpClient,
    private dialog: MatDialog,private router: Router
  ) {}

  ngOnInit(): void {
    const storedToken = sessionStorage.getItem('authToken');
    if(!storedToken){
      this.router.navigate(['/login']); 
    }
    else{

      const decodedToken =  jwt_decode.jwtDecode<any>(storedToken);
   
      this.userid=decodedToken.id
      console.log(this.userid)
      
    }


    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.fetchTransactions();  // Fetch transactions when component initializes
    console.log(this.daysInMonth);
    
  }

  // Fetch transactions data from the API
  fetchTransactions(): void {
    
    this.http.get<{ date: string, amount: number }[]>(`http://localhost:3001/api/v1/transcation/user/${this.userid}`)
      .subscribe(data => {
        this.transactions = data;
        this.updateTransactionsForMonth();
      });
  }

  // Update transactions for the current month
  updateTransactionsForMonth(): void {
    this.transactionsForDay = {};  // Reset the transactions for the days

    // Loop through the transactions and map them to the correct day
    this.transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === this.selectedYear && transactionDate.getMonth() === this.selectedMonth) {
        this.transactionsForDay[transactionDate.getDate()] = transaction.amount;
      }
    });

    this.cdr.detectChanges();  // Trigger change detection
  }

  generateCalendar(month: number, year: number): void {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const daysArray = new Array(firstDayOfWeek).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.daysInMonth = daysArray;
    console.log(this.transactionsForDay)
  }

  // Handle month selection change
  onMonthChange(month: number): void {
    this.selectedMonth = month;
    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.updateTransactionsForMonth();  // Update transactions for the new month
  }

  // Handle year selection change
  onYearChange(year: number): void {
    this.selectedYear = year;
    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.updateTransactionsForMonth();  // Update transactions for the new year
  }

  // Navigate to the previous month
  prevMonth(): void {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.updateTransactionsForMonth();
  }

  // Navigate to the next month
  nextMonth(): void {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.updateTransactionsForMonth();
  }

  openDayModal(day: number,month:number,year:number): void {
    
    const amount=this.transactionsForDay[day] || 0; 
    const dialogRef = this.dialog.open(DayModalComponent, {
      data: { day: day,month:month,year:year,val:amount,userid:this.userid },  // Pass the day to the modal component
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchTransactions(); 
      if (result !== undefined) {
        // Handle the value returned from the modal (amount added/subtracted)
        console.log('Updated value:', result);
        this.fetchTransactions(); 
        if (result !== null) {
          this.transactionsForDay[day] = result;  // Assuming `result` is the updated amount
        }
  
        // Trigger change detection to update the view
        this.cdr.detectChanges();
        // You can do something with the result, like updating the transactions
      }
    });
  }
  navigateTodashboard() {
    this.router.navigate(['/dashboard']);
  }
}