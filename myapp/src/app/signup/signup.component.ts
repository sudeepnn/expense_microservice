import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  imports: [FormsModule,HttpClientModule,MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar,private router: Router ) {}

  // Handle form submission
  onSubmit() {
    // Validate password match
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000 });
      return;
    }
  
    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.signupData.email)) {
      this.snackBar.open('Invalid email format. Please enter a valid email address.', 'Close', { duration: 3000 });
      return;
    }
  
    // Validate password strength
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (!passwordPattern.test(this.signupData.password)) {
      this.snackBar.open('Password must be at least 8 characters long and contain both letters and numbers.', 'Close', { duration: 3000 });
      return;
    }
  
    // Check if terms are agreed
    if (!this.signupData.agreeTerms) {
      this.snackBar.open('You must agree to the terms and conditions!', 'Close', { duration: 3000 });
      return;
    }
  
    // Send data to backend (localhost:3002)
    const signupPayload = {
      username: this.signupData.username,
      email: this.signupData.email,
      password: this.signupData.password
    };
  
    this.http.post<any>('https://users-xts0.onrender.com/api/v1/auth/signup', signupPayload)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Signup successful!', 'Close', { duration: 3000 });
          console.log('Signup successful', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMessage = err.error ? err.error : 'Signup failed! Please try again.';
          console.log(errorMessage);
        this.snackBar.open(errorMessage.error, 'Close', { duration: 3000 });
        console.error('Signup error', err);
        }
      });
  }
  
}
