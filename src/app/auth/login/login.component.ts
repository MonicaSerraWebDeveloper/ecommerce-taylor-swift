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
        private router: Router) {}
    
    onLogin() {
      this.authService.login(this.email, this.password).subscribe(
        (role) => {
          if (role) {
            // Se l'utente è un superadmin, lo indirizziamo alla pagina dell'admin
            if (role === 'superadmin') {
              this.router.navigate(['/admin']);
            } else {
              // Se l'utente è normale, lo indirizziamo alla pagina di checkout
              this.router.navigate(['/checkout']);
            }
          } else {
            alert('Login failed');
          }
        },
        (error) => {
          console.error('Error during login', error);
          alert('Login failed');
        }
      ); 
    }
}
