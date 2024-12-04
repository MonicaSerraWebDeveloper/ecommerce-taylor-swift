import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth'
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private auth: Auth) { }

    // Registrazione nuovo utente
    register(email: string, password: string): Observable<User> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            map((userCredential: any) => userCredential.user)
        );
    }

    // Login Utente esistente
    login(email: string, password: string): Observable<User> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            map((userCredential: any) => userCredential.user)
        )
    }

    // Logout
    logout(): Observable<void> {
        return from(signOut(this.auth))
    }

    // Utente attualmente loggato
    getCurrentUser(): Observable<User | null> {
        return new Observable((subscriber) => {
            this.auth.onAuthStateChanged(subscriber)
        })
    }

}
