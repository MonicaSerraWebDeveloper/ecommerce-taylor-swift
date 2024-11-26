import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';
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

    getAllProducts(): Observable<(ClothingProduct | GeneralProducts)[]> {
        return forkJoin([this.getClothing(), this.getGeneralProducts()]).pipe(
            map(([clothing, general]) => [...clothing, ...general] )
        )
    }

    productExist(id: number): Observable<boolean> {
        return this.getAllProducts().pipe(
            map(products => products.some(product => Number(product.id) === id))
        )
    }

    getProductById(id: number): Observable<(ClothingProduct | GeneralProducts | undefined)> {
        return this.getAllProducts().pipe(
            map(products => products.find(product => Number(product.id) === id))
        )
    }

    getProductLocalStorageById(productId: number): any {
        const products = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log(products);
        
        return products.find((product: { id: any; }) => product.id === productId);
    }

}


