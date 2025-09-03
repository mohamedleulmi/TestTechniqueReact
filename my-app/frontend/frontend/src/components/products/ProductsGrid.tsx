import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { Star, StarBorder } from "@mui/icons-material";
import type { Product } from "./Product";
import ProductService from "./ProductService";
import Box from "@mui/material/Box";

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("Fetching products...");
        const data = await ProductService.fetchProducts();
        console.log("Products loaded:", data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) ProductService.updateProduct(products[0]);
  }, [products]);

  const handleRowUpdate = (newRow: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === newRow.id ? newRow : p)));
    ProductService.updateProduct(newRow);
    return newRow;
  };

  const columns: GridColDef<Product>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "reference", headerName: "Reference", width: 150, editable: true },
    { field: "price", headerName: "Price (€)", width: 120, editable: true, type: "number" },
    {
      field: "rating",
      headerName: "Rating",
      width: 150,
      editable: true,
      renderCell: (params: GridRenderCellParams<number, Product>) => {
        const value = typeof params.value === "number" ? params.value : 0;
        return (
          <div>
            {[...Array(5)].map((_, i) => (i < value ? <Star key={i} /> : <StarBorder key={i} />))}
          </div>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={handleRowUpdate}
      />
    </Box>
  );
};

export default ProductsGrid;
