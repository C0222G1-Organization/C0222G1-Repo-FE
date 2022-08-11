import {ProductCategory} from './ProductCategory';
export interface Product {
  id: number;
  code: string;
  name: string;
  quantity: number;
  unit: string;
  prices: number;
  imageUrl: string;
  deleteStatus: number;
  productCategory: ProductCategory;
}
