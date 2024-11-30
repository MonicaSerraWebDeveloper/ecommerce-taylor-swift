import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
    items: any[] = [];
    sidebarVisible2: boolean = false;
    cartItems: any[] = [];
    cartSubscription!: Subscription;
    totalPrice: number = 0;
    totalQuantity: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
      // Osserva il carrello e calcola il totale
      this.cartService.cart$.subscribe((cart) => {
        this.cartItems = cart;
        this.calculateTotals();
      });

      this.items = [        
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Products',
        icon: 'pi pi-shopping-cart',
        routerLink: '/products'
      },
      {
        label: 'Cart',
        icon: 'pi pi-cart-arrow-down',
        command: () => this.toggleSidebar()
      },
      {
        label: 'Admin',
        icon: 'pi pi-user',
        routerLink: '/admin'
      }
    ]
  }

  ngOnDestroy() {
    // Pulire la sottoscrizione quando il componente viene distrutto
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  toggleSidebar(): void {
    this.sidebarVisible2 = !this.sidebarVisible2;
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  calculateTotals(): void {
    this.totalPrice = this.getTotalPrice();
    this.totalQuantity = this.getTotalQuantity();
  }

  removeItem(id: number, size?: any): void {
    this.cartService.removeToCart(id, size);
  }

  goToCart() {
      this.sidebarVisible2 = false
      this.router.navigate(['/cart'])
  }

  clearCart() {
    this.cartService.clearCart()
  }
}
