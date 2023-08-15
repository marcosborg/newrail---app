import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'products/:category_id',
    loadComponent: () => import('./products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.page').then( m => m.CheckoutPage)
  },
];
