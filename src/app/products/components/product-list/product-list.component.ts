import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ClothingProduct } from '../../models/clothing-products.model';
import { GeneralProducts } from '../../models/general-products.model';
import { forkJoin } from 'rxjs';
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
            clothing: this.productService.getClothing(),
            general: this.productService.getGeneralProducts()
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
            },
            (error) => {
                console.log(error);
            }
        )

    }

}
