import React, { useEffect, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowModesModel,
  GridRowModes,
  type GridRowId,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Edit as EditIcon, Save as SaveIcon, Close as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Product } from "./models/Product";
import ProductService from "./services/ProductService";
import Box from "@mui/material/Box";
import { RatingEditInputCell } from "./RatingEditInputCell";
import Rating from "@mui/material/Rating";
import { Alert, Button, Snackbar } from "@mui/material";
import type { Toast } from "./models/Toast";

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.fetchProducts();
        setProducts(data);
        setToast({ message: "Products loaded", severity: "info" });
      } catch (error) {
        console.error("Failed to load products:", error);
        setToast({ message: "Failed to load products", severity: "error" });
      }
    };
    loadProducts();
  }, []);

  const validateProduct = (newRow: Product): string | null => {
    if (newRow.price < 0) return "Price must be greater than or equal to 0";

    const duplicate = products.find(
      (p) => p.id !== newRow.id && p.reference === newRow.reference
    );
    if (duplicate) return "Reference must be unique";

    return null;
  };

  const handleRowUpdate = async (newRow: Product) => {
  const error = validateProduct(newRow);
  if (error) {
    throw new Error(error);
  }

  try {
    let updated: Product;
    if (newRow.id < 0) {
      updated = await ProductService.addProduct(newRow);
      setToast({ message: "Product added successfully", severity: "success" });
    } else {
      updated = await ProductService.updateProduct(newRow);
      setToast({ message: "Product updated successfully", severity: "success" });
    }

    // Mettre à jour la liste côté front
    setProducts((prev) =>
      prev.map((p) => (p.id === newRow.id ? updated : p))
    );
    return updated;
  } catch (err) {
    console.error(err);
    setToast({ message: "Failed to save product", severity: "error" });
    return newRow;
  }
};

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleAddClick = () => {

     const tempId = Math.min(0, ...products.map(p => p.id ?? 0)) - 1;

  const newProduct: Product = { id: tempId, name: "", reference: "", price: 0, rating: 0 };
  setProducts((prev) => [newProduct, ...prev]);

  setRowModesModel((prev) => ({
    ...prev,
    [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
  }));
  };

 const  handleDeleteClick = (id: GridRowId) => async () => {
    try {
      const numericId = Number(id);
      if (numericId < 0) {
        setProducts((prev) => prev.filter((p) => p.id !== numericId));
        return;
      }
      await ProductService.deleteProduct(numericId);
      setProducts((prev) => prev.filter((p) => p.id !== numericId));
      setToast({ message: "Product deleted successfully", severity: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Product deletion failed", severity: "error" });
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
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
      renderCell: (params: GridRenderCellParams<any, Product>) => (
        <Rating readOnly value={params.value ?? 0} />
      ),
      renderEditCell: (params: GridRenderCellParams<any, Product>) => (
        <RatingEditInputCell {...params} />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
            <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
          ];
        }

        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Button variant="contained" color="primary" onClick={handleAddClick} sx={{ mb: 2 }}>
        Add Product
      </Button>

      <DataGrid
        rows={products}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={handleRowUpdate}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => console.error(error)}
      />
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={toast?.duration || 3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast?.severity} onClose={() => setToast(null)} sx={{ mb: 2 }}>
          {toast?.message}
        </Alert>
        </Snackbar>
        
    </Box>
  );
};

export default ProductsGrid;
