import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

    personId!: number;
    product: any;
    errorMessage: string | undefined;
    
    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
    ) {}
    
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id')

        if(id !== null && !isNaN(Number(id))) {
            this.personId = Number(id);
            
            this.productService.productExist(this.personId).subscribe((exist) => {
                if(exist) {
                    console.log('ID valid:', exist);
                    this.product = this.productService.getProductById(this.personId).subscribe(
                        (product) => {
                            this.product = product
                        });
                } else {
                    this.invalidProduct()
                }
            })
        } else {
            this.invalidProduct()
        } 
    }

    invalidProduct() {
        this.errorMessage = 'Il prodotto cercato non esite'
    }
}

