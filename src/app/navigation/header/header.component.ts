import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    items: any[] = [];
    sidebarVisible2: boolean = false;
    cartItem: any[] = [];

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
    console.log(this.cartItem);
    
    this.loadCart()

  }

  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    this.cartItem =  storedCart ? JSON.parse(storedCart) : [];
  }

  toggleSidebar(): void {
    this.sidebarVisible2 = !this.sidebarVisible2;
  }

  removeItem(id: any, size?: string) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    const indexItem = cart.findIndex(
      (item: any) => item.id === id && (!size || item.size === size )
    )

    if(indexItem > -1) {
      cart.splice(indexItem, 1)
      localStorage.setItem('cart', JSON.stringify(cart))
    }

    this.cartItem = cart
  }
}
