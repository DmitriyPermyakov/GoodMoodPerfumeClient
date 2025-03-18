import { Component, Input } from '@angular/core';
import { Product } from '../interfaces/app-interfaces';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  
  @Input() public product: Product
}

