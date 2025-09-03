import { Router } from "express";
import type { Product } from "../models/Products";
import fs from "fs";
import path from "path";

const router = Router();

const productsFile = path.join(__dirname, "..", "..", "resources", "products.json");

let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));

router.get("/", (_req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const newProduct = req.body as Product;

  // Générer un ID unique
  const maxId = products.length ? Math.max(...products.map((p:Product) => p.id)) : 0;
  newProduct.id = maxId + 1;
  
  products.push(newProduct);
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  const index = products.findIndex((p:Product) => p.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products[index] = { ...products[index], ...updatedProduct };
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.json(products[index]);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  products = products.filter((p: Product) => p.id !== parseInt(id));

  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.status(204).send();
});

export default router;
