import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  dbUrl: string = 'https://ecommerce-taylor-swift-default-rtdb.europe-west1.firebasedatabase.app/orders.json';

  constructor(
    private http: HttpClient
  ) { }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.dbUrl, orderData)
  }

}
