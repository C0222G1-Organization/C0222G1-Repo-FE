import {ProductCategory} from './ProductCategory';

// Các thuộc tính phải giống tên trong câu Query nếu có đặt as cho các bảng

// Nếu không đặt tên lại cho các trường của bảng thì phải giống tên của model bên web service

export interface Product {
  id: number;
  code: string;
  nameProduct: string;
  quantity: number;
  unit: string;
  prices: number;
  image: string;
  deleteStatus: number;
  idProductCategory: ProductCategory;
}
