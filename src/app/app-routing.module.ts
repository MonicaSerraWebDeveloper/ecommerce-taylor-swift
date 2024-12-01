import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart/cart.component';
import { CheckoutComponent } from './checkout/checkout/checkout.component';

const routes: Routes = [
  { path:'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'cart', component: CartComponent },
  { path:'checkout', component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
