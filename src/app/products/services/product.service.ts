import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map, BehaviorSubject } from 'rxjs';
import { ClothingProduct } from '../models/clothing-products.model';
import { GeneralProducts } from '../models/general-products.model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    private productsSubject = new BehaviorSubject<any[]>(this.loadProductsFromLocalStorage());
    products$ = this.productsSubject.asObservable();

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

    updateProductInLocalStorage(product: any): void {
        const products = this.loadProductsFromLocalStorage();

        const productIndex = products.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
            products[productIndex] = product;
        } else {
            products.push(product);
        }

        localStorage.setItem('products', JSON.stringify(products));
        this.productsSubject.next(products);  // Emit a new value to notify subscribers
    }

    loadProductsFromLocalStorage(): any[] {
        return JSON.parse(localStorage.getItem('products') || '[]');
    }

    // updateProductInLocalStorage(product: any): void {
    //     const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    //     // Cerca il prodotto da aggiornare
    //     const productIndex = products.findIndex((p: any) => p.id === product.id);
    
    //     if (productIndex > -1) {
    //         products[productIndex] = product; // Aggiorna il prodotto
    //     } else {
    //         products.push(product); // Se non esiste, aggiungilo
    //     }
    
    //     // Salva l'array aggiornato
    //     localStorage.setItem('products', JSON.stringify(products));
    // }

    getProductLocalStorageById(id: number): Observable<any> {
        return this.getAllProducts().pipe(
            map((products) => {
                // Cerca il prodotto nel localStorage
                const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
                const updatedProduct = localProducts.find((p: any) => p.id === id);
    
                // Se il prodotto esiste nel localStorage, restituiscilo; altrimenti, restituisci quello originale
                return updatedProduct || products.find((product) => product.id === id);
            })
        );
    }
    
}


