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
    selectedQuantity: number = 1;
    selectedSizes: string[] = [];
    cartItems: any[] = [];
    
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
    // un messaggio da dare all'utente per la gestione dei prodotti che non esistono
    invalidProduct() {
        this.errorMessage = 'Il prodotto cercato non esite'
    }

    // creiamo un metodo per l'interazione dell'utente con il checkbox delle sizes così da salvare le taglie selezionate in un array
    getSelectedSizes(size: any, event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        if(isChecked) {
            this.selectedSizes.push(size)
        } else {
            this.selectedSizes = this.selectedSizes.filter((s) => s !== size)
        }
        console.log(this.selectedSizes);
    }

    addToCart() {
        if (!this.product) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if(this.product.category === 'Clothes') {
            this.selectedSizes.forEach((size) => {
                
                const quantityAvailable = this.product.sizes[size]

                if(quantityAvailable >= this.selectedQuantity) {
                    const cartItem = {
                        id: this.product.id,
                        name: this.product.name,
                        category: this.product.category,
                        price: this.product.price,
                        image: this.product.image,
                        size: size,
                        quantity: this.selectedQuantity,
                    }

                    const existingItemIndex = cart.findIndex((item: any) => {
                        item.id === this.product.id && item.size === size
                    });
    
                    if (existingItemIndex > -1) {
                        cart[existingItemIndex].quantity += this.selectedQuantity
                    } else {
                        cart.push(cartItem)
                    }
                    this.product.sizes[size] -= this.selectedQuantity;
                } else {
                    console.error(`Taglia ${size} non disponibile in quantità sufficiente.`);
                }
            })

        } else {
            // Gestione per General
            const cartItem = {
                id: this.product.id,
                name: this.product.name,
                category: this.product.category,
                price: this.product.price,
                image: this.product.image,
                quantity: this.selectedQuantity,
            };
    
            const existingItemIndex = cart.findIndex((item: any) => item.id === this.product.id);
    
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += this.selectedQuantity;
            } else {
                cart.push(cartItem);
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        this.updateCartView()
    }

    isSizeAvailable(size: any): boolean {
        return this.product.sizes[size] > 0;  
    }

    updateCartView() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.cartItems = cart;
    }

}

