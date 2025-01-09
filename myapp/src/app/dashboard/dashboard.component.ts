import {ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule  } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import  * as jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-dashboard',
  imports: [HttpClientModule,NgChartsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userid!:string
  monthlyExpenditures: number[] = [];
  chartData: ChartData<'line'> = {
    labels: [], // months of the year
    datasets: [
      {
        label: 'Monthly Expenditure',
        data: this.monthlyExpenditures,
        fill: false,
        backgroundColor: '#92a7fd', 
        tension: 0.1,  
        hoverBackgroundColor:"#92a7fd"
        // hoverBackgroundColor: '#4f71fa', 
       
      }
    ]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Expenditure (in INR)'
        },
        beginAtZero: true
      }
    }
  };
  constructor(private http: HttpClient, private router: Router,private cdr: ChangeDetectorRef){}


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

    this.fetchMonthlyExpenditure();
  }
  fetchMonthlyExpenditure() {
    this.http.get<any>(`http://localhost:3001/api/v1/expenses/monthly/${this.userid}`).subscribe(
      response => {
        console.log(response.monthlyExpenditures)
        this.monthlyExpenditures = response.monthlyExpenditures;
        this.chartData.datasets[0].data = this.monthlyExpenditures;  // Update the chart data
        this.chartData.labels = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
  
        // Manually trigger change detection to update the chart
        this.cdr.detectChanges();
        
      },
      error => {
        console.error('Error fetching monthly expenditure data', error);
      }
    );
  }
  navigateToexpense() {
    this.router.navigate(['/expense']);
  }

}
