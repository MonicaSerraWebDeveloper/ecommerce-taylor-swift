import { Injectable } from '@angular/core';
import { BehaviorSubject, findIndex } from 'rxjs';
import { ProductService } from '../products/services/product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private cartSubject = new BehaviorSubject<any[]>(this.loadCart());
    cart$ = this.cartSubject.asObservable();
    
    constructor(
        private productService: ProductService
    ) { }

    loadCart(): any[] {
        return JSON.parse(localStorage.getItem('cart') || '[]')
    }

    clearCart() {
        this.cartSubject.next([])
        localStorage.setItem('cart', JSON.stringify([]))
    }

    addToCart(product: any) {
        const cart = this.loadCart()
        
        if(product.category === 'Clothes') {
            const existingItemIndex = cart.findIndex(
                (item: any) => item.id === product.id && item.size === product.size                
            );

            if(existingItemIndex > -1) {
                cart[existingItemIndex].quantity += product.quantity                 
            } else {
                cart.push(product)
            }

        } else {
            const existingItemIndex = cart.findIndex((item: any) => 
                item.id === product.id
            )

            if(existingItemIndex > -1) {
                cart[existingItemIndex].quantity += product.quantity 
            } else {
                cart.push(product)
            }
        }

        this.updateCart(cart)
    }

    removeToCart(productId: any, productSize: any) {
        let cart = this.loadCart();        
        cart = cart.filter(item => !(item.id === productId && item.size === productSize))
        this.updateCart(cart)
    }

    private updateCart(cart: any[]) {
        localStorage.setItem('cart', JSON.stringify(cart))
        this.cartSubject.next(cart)
    }
}
