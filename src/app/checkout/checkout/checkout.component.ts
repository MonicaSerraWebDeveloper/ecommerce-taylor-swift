import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../cart/cart.service';
import { OrdersService } from '../../orders/orders.service';
import { ProductService } from '../../products/services/product.service';
import { catchError, EMPTY, take } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    this.loadCart();

    // Reactive Form
    this.checkoutForm = this.fb.group({
      shippingDetails: this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      }),
      paymentDetails: this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
        expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],
        cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      }),
    });

    this.checkoutForm.get("fullName")?.valueChanges.subscribe(nextValue=>{
      console.log(nextValue)
    }

    )
  }

    loadCart() {
      this.cartItems = this.cartService.loadCart(); // Metodo da implementare nel CartService
      this.calculateTotals();
    }

    calculateTotals() {
      const totalQuantity  = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      const  totalPrice = this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
      this.totalPrice = totalPrice
      this.totalQuantity = totalQuantity
    }

    onSubmit() {
      if (this.checkoutForm.invalid) {
        return;
      }
    
      const orderData = {
        userId: localStorage.getItem('userId'),
        items: this.cartItems,
        totalPrice: this.totalPrice,
        shippingDetails: this.checkoutForm.value.shippingDetails,
        paymentDetails: this.checkoutForm.value.paymentDetails,
      };
    
      this.orderService.createOrder(orderData).pipe(
        take(1),
        catchError(error => {
        console.error('Error placing order:', error);
        alert('There was an issue placing your order.');
        return EMPTY
      }
      )).subscribe(() =>{
          // Aggiorna i prodotti nel magazzino
          this.cartItems.forEach(item => {
            this.productService.getProductLocalStorageById(item.id).subscribe(product => {
              if (product) {
                if (item.category === 'Clothes') {
                  // Gestione per Clothes
                  const sizeKey = item.size; // Es. 'M', 'L'
                  if (product.sizes[sizeKey] >= item.quantity) {
                    product.sizes[sizeKey] -= item.quantity;
                  } else {
                    console.warn(`Quantità non sufficiente per ${item.name} (${sizeKey}).`);
                  }
                } else if (item.category === 'General') {
                  // Gestione per General
                  if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                  } else {
                    console.warn(`Quantità non sufficiente per ${item.name}.`);
                  }
                }
                // Aggiorna il prodotto in localStorage
                this.productService.updateProductInLocalStorage(product);
              }
            });
          });
    
          // Svuota il carrello
          this.cartService.clearCart();
          this.router.navigate(['/thankyou']);
      });
    }
}
