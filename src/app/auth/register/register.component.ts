import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

    email = '';
    password = '';

    constructor(
        private authService: AuthService, 
        private router: Router
    ) {}

    onRegister() {
      const userId = `user-${Date.now()}`;
      this.authService.setUserId(userId);

      const body = { userId, email: this.email, password: this.password, role: 'user' };
      this.authService.register(body).subscribe(
        (response) => {
          if(response) {
            this.router.navigate(['/checkout']); 
          } else {
            alert('Registration failed')
          }
        },
        error => {
          console.error('Errore durante la registrazione:', error);
        }
      )
    }
}
