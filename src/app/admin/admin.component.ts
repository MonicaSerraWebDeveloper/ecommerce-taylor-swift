import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

    loadUsers(): void {
      const dbUrl = 'https://ecommerce-taylor-swift-default-rtdb.europe-west1.firebasedatabase.app/users.json';
      this.http.get<{ [key: string]: any }>(dbUrl).subscribe((usersData) => {
        this.users = Object.values(usersData); 
      });
    }

    deleteUser(userId: string): void {
      console.log(`Trying to delete user with ID: ${userId}`);
      const dbUrl = `https://ecommerce-taylor-swift-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`;
      this.http.delete(dbUrl).subscribe({
        next: () => {
          console.log(`User ${userId} deleted successfully`); 
          this.loadUsers(); 
        },
        error: (err) => {
          console.error('Error deleting user:', err);  
        }
      });
    }
}
