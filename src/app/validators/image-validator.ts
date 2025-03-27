import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const imageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
   const imageFile = control.get('image')
   const imageUrl = control.get('imageUrl')

   

   if(!imageFile.value && !imageUrl.value) 
      return { empty_image: true }
   else 
      return null
}