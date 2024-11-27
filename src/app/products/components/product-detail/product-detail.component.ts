import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/cart.service';

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
    selectedSizes: string = '';
    cartItems: any[] = [];
        
    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService
    ) {}
    
    ngOnInit(): void {
        // passiamo il parametro 'id' del prodotto alla rotta della pagina dettaglio dei prodotti
        const id = this.route.snapshot.paramMap.get('id')

        if(id !== null && !isNaN(Number(id))) {
            this.personId = Number(id);

            this.cartService.cart$.subscribe((cart) => {
                this.cartItems = cart;
            });
            
            // verifichiamo che l'id scritto nell'URL esista, gestiamo in caso il prodotto id non esista di restituire all'utente un avviso che il prodotto non è stato trovato
            this.productService.productExist(this.personId).subscribe((exist) => {
                if(exist) {
                    this.product = this.productService.getProductById(this.personId).subscribe(
                        (product) => {
                            this.product = product
                        });
                } else {
                    this.invalidProduct()
                };
            });
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
            this.selectedSizes = size           
        }
    };

    addToCart() {
        if (!this.product) return;

        if(this.product.category === 'Clothes') {
           
                
            const quantityAvailable = this.product.sizes[this.selectedSizes]
            
            // prepariamo l'oggetto da aggiungere all'array del carrello
            if(quantityAvailable >= this.selectedQuantity) {
                const cartItem = {
                    id: this.product.id,
                    name: this.product.name,
                    category: this.product.category,
                    price: this.product.price,
                    image: this.product.image,
                    size: this.selectedSizes,
                    quantity: this.selectedQuantity,
                }

                this.product.sizes[this.selectedSizes] -= this.selectedQuantity;

                this.cartService.addToCart(cartItem)
                this.selectedSizes = ''

            } else {
                console.error(`Taglia ${this.selectedSizes} non disponibile in quantità sufficiente.`);
            }


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

            this.cartService.addToCart(cartItem)
        }
    };

    isSizeAvailable(size: any): boolean {
        return this.product.sizes[size] > 0;  
    };

    isSizeChecked(): boolean {
        if(this.product?.category === 'Clothes') {
            return !this.selectedSizes;
        } else {
            return false
        }
    }
}

