
export interface Product {
   id: number,
   name: string,
   description: string,
   price: number,
   category: string,
   imageUrl: string
 }

export interface CreateProductDto {
  name: string,
  description: string,
  price: number,
  category: string,
  image: File
}

export interface OrderItem {
  product: Product,
  quantity: number
}

export interface CreateOrderItemDTO {
  productId: number,
  quantity: number
}

export interface OrderRequest {
  queryId: string,
  telegramUserId: number,
  orderItems: CreateOrderItemDTO[]
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

export interface JwtPayload {
  "role": string,
  "nbf": number,
  "exp": number,
  "iat": number
}

export interface OrderContacts {
  address: string,
  name: string,
  phone: string,
  delivery: string
}
