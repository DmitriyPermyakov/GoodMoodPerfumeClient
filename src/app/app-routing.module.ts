import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CartComponent } from './cart/cart.component';
import { EnterContactsComponent } from './enter-contacts/enter-contacts.component';
import { CreateProductComponent } from './create-product/create-product.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'contacts', component: EnterContactsComponent },
  { path: 'product/create', component: CreateProductComponent },
  { path: 'product/:id/edit', component: EditProductComponent },
  { path: 'product/:id', component: ProductDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
