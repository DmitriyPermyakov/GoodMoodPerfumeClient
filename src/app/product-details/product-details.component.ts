import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/app-interfaces';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  public product: Product | null
  private productSubscription: Subscription
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id")
    console.log("id", id)
    this.productSubscription = this.productService.getProductById( parseInt(id))
      .subscribe(p => this.product = p ?? null)
  }

  ngOnDestroy(): void {
    if(this.productSubscription)
      this.productSubscription.unsubscribe()
  }
}
