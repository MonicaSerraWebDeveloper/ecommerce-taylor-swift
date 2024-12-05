import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 

  const userId = authService.getUserId();  
  if (userId) {
    return authService.getUserRole(userId).pipe(
      map(role => {
        if (role === 'superadmin') {
          return true;  
        } else {
          router.navigate(['/']);  
          return false;  
        }
      }),
      catchError((err) => {
        console.error('Error fetching user role:', err);
        router.navigate(['/']);  
        return of(false);  
      })
    );
  }

  router.navigate(['/']);
  return false;  
};
