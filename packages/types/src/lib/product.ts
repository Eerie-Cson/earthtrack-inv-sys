import { Node } from './node';
export type Product = Node & {
  name: string;
  description?: string;
  price: number;
  category: Category;
};

export enum Category {
  ToolBox = 'ToolBox',
  Beverages = 'Beverages',
  Accessories = 'Accessories',
}
