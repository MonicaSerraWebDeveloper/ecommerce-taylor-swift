import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
    items: any[] = [];
    sidebarVisible2: boolean = false;
    cartItem: any[] = [];
    cartSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {

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
    this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
      this.cartItem = cart;
    });
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
    return this.cartItem.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
      return this.cartItem.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  removeItem(id: any, size?: any) {
    this.cartService.removeToCart(id, size);
  }
}
