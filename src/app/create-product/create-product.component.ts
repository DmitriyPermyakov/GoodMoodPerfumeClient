import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { TelegramService } from '../services/telegram.service';
import { catchError, map, Subject, Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { Product } from '../interfaces/app-interfaces';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, OnDestroy {

  private createProductSub: Subscription
  private formStatusSub: Subscription
  private formValidSub: Subscription
  private formValidSubject: Subject<boolean> = new Subject()
  private productImage: File | null

  productForm: FormGroup = new FormGroup({
    image: new FormControl(null , Validators.required),
    name: new FormControl('', [Validators.required, Validators.maxLength(64)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(2048)]),
    category: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100000)])
  })

  constructor(private productService: ProductService,
    private tgService: TelegramService,
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {

    this.formStatusSub = this.productForm.statusChanges.subscribe(s => {
      this.formValidSubject.next(this.productForm.valid)
    })

    this.tgService.disableMainButton() 
    this.tgService.mainButton.onClick(this.submitCallback)

    this.formValidSub = this.formValidSubject.subscribe(valid => {
      if(valid)
        this.tgService.enableMainButton()
      else
        this.tgService.disableMainButton()
    })
  }

  ngOnDestroy(): void {
    if(this.formStatusSub)
      this.formStatusSub.unsubscribe()

    if(this.formValidSub)
      this.formValidSub.unsubscribe()

    if(this.createProductSub)
      this.createProductSub.unsubscribe()

    this.tgService.mainButton.offClick(this.submitCallback)
  }

  imageSelected(event): void {
    let imageFile = event.target.files[0];
    if(imageFile) {
      this.productImage = imageFile
      this.productForm.patchValue({ image: imageFile})
    }
  }

  submitCallback = () => this.submit()

  submit(): void {
    let formData = new FormData()

    formData.append('image', this.productImage, this.productImage.name)
    formData.append('name', this.productForm.controls['name'].value)
    formData.append('description', this.productForm.controls['description'].value)
    formData.append('category', this.productForm.controls['category'].value)
    formData.append('price', this.productForm.controls['price'].value)


    this.createProductSub = this.productService.createProduct(formData)
      .pipe(        
        catchError(e => {
          this.messageService.showMessage(false, "Не удалось создать продукт")
          return throwError(() => e)
        })
      )
      .subscribe(p => {        
        this.messageService.showMessage(true,"Продукт успешно создан")
        this.router.navigate(['product', (p.result as Product).id])
      })
  }
}
