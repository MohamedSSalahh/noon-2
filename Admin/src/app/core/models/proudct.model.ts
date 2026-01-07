



export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  category?: { _id: string; name: string; slug: string };
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
  quantity: number; // Inventory count
  images?: string[];
}

