import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../interfaces/app-interfaces';
import { ProductService } from '../services/product.service';
import { BehaviorSubject, catchError, Subscription, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import { TelegramService } from '../services/telegram.service';
import { imageValidator } from '../validators/image-validator';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {
  private id: number
  private image: File | null
  private productSub: Subscription
  private updateProductSub: Subscription
  private formValidSub: Subscription
  private formStatusSub: Subscription
  private formValidSubject: BehaviorSubject<boolean> = new BehaviorSubject(true)
  
  public product: Product
  public productForm: FormGroup
  public imageUrl: string
  public emptyImage = '../assets/empty-image.png'
  public isVisible: boolean = true

  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private tgService: TelegramService
  ){}

  ngOnInit(): void {
    this.id = parseInt(this.activatedRoute.snapshot.params['id'])    

    this.productSub = this.productService.getProductById(this.id)
      .pipe(
        catchError(e => {
          this.messageService.showMessage(false, 'Ошибка загрузки')
          return throwError(() => e)
        })).subscribe(p => {
        this.product = p.result as Product
        if(this.product) {
          this.imageUrl = (p.result as Product).imageUrl
          this.productForm = new FormGroup({
            name: new FormControl(this.product.name, Validators.required),
            description: new FormControl(this.product.description),
            category: new FormControl(this.product.category),
            price: new FormControl(this.product.price),
            image: new FormControl(null),
            imageUrl: new FormControl(this.product.imageUrl)
          }, { validators: imageValidator})


          this.formStatusSub = this.productForm.statusChanges.subscribe(status => {
              this.formValidSubject.next(this.productForm.valid)
          })

          this.tgService.mainButton.onClick(this.submitCallback)

          this.formValidSub = this.formValidSubject.subscribe(valid => {
            console.log('form valid', valid)
            if(valid)
              this.tgService.enableMainButton()
            else
              this.tgService.disableMainButton()
          })

          this.tgService.mainButton.setParams({
            text: 'Обновить'
          })

        }
      })    


  }

  removeImage(): void {
    this.imageUrl = this.emptyImage
    this.productForm.patchValue({imageUrl: '' })
    this.isVisible = false
  }

  ngOnDestroy(): void {
    if(this.productSub)
      this.productSub.unsubscribe()
    if(this.updateProductSub)
      this.updateProductSub.unsubscribe()
    if(this.formStatusSub)
      this.formStatusSub.unsubscribe()
    if(this.formValidSub)
      this.formStatusSub.unsubscribe()
    this.tgService.mainButton.offClick(this.submitCallback)

  }

  imageSelected(event): void {
    let imageFile = event.target.files[0]
    if(imageFile) {
      this.image = imageFile
      this.productForm.patchValue({ image: imageFile})
    }
  }

  private submitCallback = () => this.submit()

  submit(): void {
    let formData = new FormData()

    formData.append('id', this.product.id.toString())
    formData.append('name', this.productForm.controls['name'].value)
    formData.append('description', this.productForm.controls['description'].value)
    formData.append('category', this.productForm.controls['category'].value)
    formData.append('price', this.productForm.controls['price'].value)
    formData.append('imageUrl', this.productForm.controls['imageUrl'].value)
    if(this.image)
      formData.append('image', this.image, this.image.name)
    else 
      formData.append('image', null)

    this.updateProductSub = this.productService.updateProduct(formData)
      .pipe(
        catchError(e => {
          this.messageService.showMessage(false, "Ошибка обновления")
          return throwError(() => e)
        })
      ).subscribe(response => {
        this.messageService.showMessage(true, "Продукт обновлен")
        this.router.navigate(['product', (response.result as Product).id])
      })
  }
}
