export interface ClothingProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    hover: string;
    description: string;
    sizes: {
      S: number;
      M: number;
      L: number;
      XL: number;
    };
  }