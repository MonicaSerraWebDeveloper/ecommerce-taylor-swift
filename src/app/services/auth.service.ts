import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    dbUrl: string = 'https://ecommerce-taylor-swift-default-rtdb.europe-west1.firebasedatabase.app/users.json';
    private isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(
      private http: HttpClient,
      private router: Router
    ) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.isAuthenticated.next(true);  // Se esiste un userId, l'utente è autenticato
      }
    }

    // Metodo per salvare un userId nel localStorage
    setUserId(userId: string) {
      localStorage.setItem('userId', userId);
    }

    // Metodo per recuperare l'userId
    getUserId(): string | null {
      return localStorage.getItem('userId');
    }

    getUserRole(userId: string): Observable<string> {
      return this.http.get<{ [key: string]: { email: string; password: string; userId: string; role: string } }>(this.dbUrl).pipe(
        map(users => {
          const user = Object.values(users).find(u => u.userId === userId);
          return user ? user.role : 'user'; 
        }),
        catchError((err) => {
          console.error('Error fetching user role:', err);
          return of('user'); 
        })
      );
    }

    register(body: {userId: string, email: string; password: string, role: string }): Observable<any>{
      body.role = 'user';
      return this.http.post(this.dbUrl, body).pipe(
        map((response) => {
          if (response) {
            localStorage.setItem('userId', body.userId);  
            this.isAuthenticated.next(true);  
            return true;  
          } else {
            return false;  
          }
        })
      )
    }

    login(email: string, password: string): Observable<string | null> {
      return this.http.get<{ [key: string]: { email: string; password: string; userId: string; role: string } }>(this.dbUrl).pipe(
        map(users => {
          const userList = Object.values(users);
          const user = userList.find(u => u.email === email && u.password === password);
          if (user) {
            localStorage.setItem('userId', user.userId);
            localStorage.setItem('role', user.role);  
            this.isAuthenticated.next(true);
            if (user.role === 'superadmin') {
              return 'superadmin';  
            } else {
              return 'user';  
            }
          }
          return null;  
        })
      );
    }

    logout(): void {
      localStorage.removeItem('userId');
      this.isAuthenticated.next(false); 
    }
  
    isLoggedIn(): Observable<boolean> {
      return this.isAuthenticated.asObservable();
    }
}
