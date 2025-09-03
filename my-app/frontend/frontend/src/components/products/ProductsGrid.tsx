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
import { Star, StarBorder, Edit as EditIcon, Save as SaveIcon, Close as CancelIcon } from "@mui/icons-material";
import type { Product } from "./Product";
import ProductService from "./ProductService";
import Box from "@mui/material/Box";
import { RatingEditInputCell } from "./RatingEditInputCell";
import Rating from "@mui/material/Rating";

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  const handleRowUpdate = async (newRow: Product) => {
  try {
    const updated = await ProductService.updateProduct(newRow);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  } catch (error) {
    console.error("Failed to update product:", error);
    return newRow;
  }
};

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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

        return [<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />];
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
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
      />
    </Box>
  );
};

export default ProductsGrid;
