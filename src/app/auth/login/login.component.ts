import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

    email = '';
    password = '';

    constructor(
        private authService: AuthService, 
        private router: Router)  {}

    onLogin() {
        this.authService.login(this.email, this.password).subscribe({
        next: () => {
            alert('Login successful');
            this.router.navigate(['/checkout']);
        },
        error: (err) => {
            console.error(err);
            alert('Login failed. Please try again.');
        },
        });
    }
}
