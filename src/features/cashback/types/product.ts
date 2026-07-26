'use client';

export interface Product {
  id: string;
  name: string;
  shop: string;
  price: number;
  sales?: number | null;
  image: string;
  rating?: number | null;
  commission: number;
  lastUpdate: string;
}
