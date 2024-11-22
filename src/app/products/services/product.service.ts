import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClothingProduct } from '../models/clothing-products.model';
import { GeneralProducts } from '../models/general-products.model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private clothingURL = 'assets/data/clothing-products.json'
  private generalProducts = 'assets/data/general-products.json'

  constructor(private http: HttpClient) { }

  getClothing(): Observable<ClothingProduct[]> {
    return this.http.get<ClothingProduct[]>(this.clothingURL).pipe(shareReplay(1));
  }

  getGeneralProducts(): Observable<GeneralProducts[]> {
    return this.http.get<GeneralProducts[]>(this.generalProducts).pipe(shareReplay(1));
  }

}


