import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    items: any[] = [];

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
        routerLink: '/cart'
      },
      {
        label: 'Admin',
        icon: 'pi pi-user',
        routerLink: '/admin'
      }
    ]
  }
}
