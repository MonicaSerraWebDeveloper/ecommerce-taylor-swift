import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ClothingProduct } from '../../models/clothing-products.model';
import { GeneralProducts } from '../../models/general-products.model';
import { catchError, EMPTY, forkJoin, of } from 'rxjs';
import { CartService } from '../../../cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
    
    allProducts: any[] = [];

    clothingProducts: ClothingProduct[] = [];
    generalProducts: GeneralProducts[] = [];

    constructor(
        private productService: ProductService,
        private cartService: CartService
    ) {}
    
    ngOnInit(): void {
        
        forkJoin({
            clothing: this.productService.getClothing().pipe(catchError(() => 
                of([])
            )),
            general: this.productService.getGeneralProducts().pipe(catchError(error => {
                console.error(error)
                return of([])
            })),
        }).subscribe(
            ({ clothing, general }) => {
                this.clothingProducts = clothing;
                this.generalProducts = general;

                this.allProducts = [
                    ...this.clothingProducts.map(product => ({
                        ...product,
                        category: 'Clothing',
                        sizes: product.sizes, 
                        stock: undefined      
                    })),
                    ...this.generalProducts.map(product => ({
                        ...product,
                        category: 'General',
                        sizes: undefined,
                        stock: product.stock
                    }))
                ];                  
            }
        )

    }

}