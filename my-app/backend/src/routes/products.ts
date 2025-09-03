import { Router } from "express";
import type { Product } from "../models/Products";

const router = Router();

let products: Product[] = [
  { id: 1, name: "Produit 1", reference: "REF001", price: 10.5, rating: 4 },
  { id: 2, name: "Produit 2", reference: "REF002", price: 15, rating: 3 },
  { id: 3, name: "Produit 3", reference: "REF003", price: 12.5, rating: 5 },
  { id: 4, name: "Produit 4", reference: "REF004", price: 8, rating: 2 },
  { id: 5, name: "Produit 5", reference: "REF005", price: 20, rating: 1 },
  { id: 6, name: "Produit 6", reference: "REF006", price: 9.5, rating: 4 },
  { id: 7, name: "Produit 7", reference: "REF007", price: 14, rating: 3 },
  { id: 8, name: "Produit 8", reference: "REF008", price: 11, rating: 5 },
  { id: 9, name: "Produit 9", reference: "REF009", price: 18, rating: 2 },
  { id: 10, name: "Produit 10", reference: "REF010", price: 7.5, rating: 0 },
];

router.get("/", (_req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const newProduct = req.body as Product;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

export default router;
