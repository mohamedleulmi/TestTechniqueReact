import type { Product } from "./Product";

export default class ProductService {
  private static API_URL_PRODUCTS = "http://localhost:5000/api/products";

  // Récupère les produits depuis le backend
  static async fetchProducts(): Promise<Product[]> {
    const res = await fetch(this.API_URL_PRODUCTS);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return (await res.json()) as Product[];
  }

  // Ajoute un nouveau produit sur le backend
  static async addProduct(product: Product): Promise<Product> {
    const res = await fetch(this.API_URL_PRODUCTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Add product failed: ${res.status}`);
    return (await res.json()) as Product;
  }

  // Met à jour un produit (tu peux faire PUT si tu modifies ton backend)
  static async updateProduct(product: Product): Promise<Product> {
    const res = await fetch(`${this.API_URL_PRODUCTS}/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Update product failed: ${res.status}`);
    return (await res.json()) as Product;
  }
}
