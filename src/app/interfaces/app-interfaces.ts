
export interface Product {
   id: number,
   name: string,
   description: string,
   price: number,
   category: string,
   imageUrl: string
 }

 export interface OrderItem {
  productId: number,
  quantity: number
 }