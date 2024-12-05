import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

    cartItems: any[] = [];
    totalPrice: number = 0;
    totalQuantity: number = 0;

    constructor(
        private cartService: CartService,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.cartService.cart$.subscribe((cart) => {
            console.log(cart);
            this.cartItems = cart
            this.calculateTotals();
        })
    }

    goToAllProduct() {
        this.router.navigate(['/products']);
    }
    goToCheckout() {
        this.router.navigate(['/checkout']);
    }

    calculateTotals() {
        const totalQuantity  = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        const  totalPrice = this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
        this.totalPrice = totalPrice
        this.totalQuantity = totalQuantity
    }

    removeFromCart(id: number, size?: any) {
        this.cartService.removeToCart(id, size);
    }
    

    // Metodo per eliminare prodotti dal carrello
    // Pulsante per continuare a fare acquisti e tornare a tutti i prodotti
    // Pulsante per andare al checkout
}
