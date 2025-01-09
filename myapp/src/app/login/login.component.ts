import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient,HttpClientModule } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as jwt from 'jsonwebtoken'; 

@Component({
  selector: 'app-login',
  imports: [FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Handle form submission
  onSubmit() {
    const loginPayload = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.http.post<any>('http://localhost:3002/api/v1/auth/login', loginPayload)
      .subscribe({
        next: (response) => {
          // Assuming the response contains the JWT token
          const responseToken = response.token;

          // // Store token in session storage
          sessionStorage.setItem('authToken', responseToken);
          this.router.navigate(['/dashboard']);
          // const decodedToken =  jwt_decode(responseToken);

          // // Now, decode the token and compare it with the session token
          // const storedToken = sessionStorage.getItem('authToken');
          // if (storedToken) {
          //   const decodedToken:any = jwt.decode(storedToken);
          //   console.log('Decoded token:', decodedToken);

          //   // For demonstration purposes, let's check if the user ID is the same
          //   // You can check for other fields as per your use case
          //   if (decodedToken && decodedToken.id) {
          //     // If the decoded token matches the response, redirect to another page
          //     this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          //     this.router.navigate(['/dashboard']); // Redirect to dashboard or home
          //   } else {
          //     this.snackBar.open('Token mismatch! Please try again.', 'Close', { duration: 3000 });
          //   }
          // }
        },
        error: (err) => {
          this.snackBar.open('Login failed! Please check your credentials.', 'Close', { duration: 3000 });
          console.error('Login error:', err);
        }
      });
  }
}
