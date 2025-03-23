
export interface Product {
   id: number,
   name: string,
   description: string,
   price: number,
   category: string,
   imageUrl: string
 }

export interface OrderItem {
  product: Product,
  quantity: number
}

export interface OrderItemsRequest {
  productId: number,
  quantity: number
}

export interface OrderRequest {
  queryId: string,
  telegramUserId: number,
  orderItems: OrderItemsRequest[]
  address: string,
  name: string,
  phone: string,
  delivery: string
}

export interface Response {
  status: string,
  isSuccessfull: boolean,
  errors: string[],
  result: object
}

