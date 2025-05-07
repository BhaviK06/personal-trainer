import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { getCustomers, deleteCustomer, updateCustomer } from '../services/customerService';
import { Customer } from '../types';
import AddTraining from './AddTraining';
import { Box, Paper, TextField, Stack, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CustomerForm from './CustomerForm';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      const data = response.data._embedded.customers.map((customer: any, index: number) => ({
        id: index,
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        streetaddress: customer.streetaddress,
        postcode: customer.postcode,
        city: customer.city,
        link: customer._links.customer.href,
      }));
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (link: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(link);
        fetchCustomers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
  };

  const processRowUpdate = async (newRow: any) => {
    try {
      const updatedCustomer = {
        firstname: newRow.firstname,
        lastname: newRow.lastname,
        email: newRow.email,
        phone: newRow.phone,
        streetaddress: newRow.streetaddress,
        postcode: newRow.postcode,
        city: newRow.city,
      };
      await updateCustomer(newRow.link, updatedCustomer);
      fetchCustomers();
      return newRow;
    } catch (error) {
      console.error(error);
      return newRow;
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = customers.filter((customer) =>
      Object.values(customer)
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
    setFilteredCustomers(filtered);
  };

  const exportToCSV = () => {
    const header = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Postcode', 'City'];
    const rows = filteredCustomers.map((c) => [
      c.firstname,
      c.lastname,
      c.email,
      c.phone,
      c.streetaddress,
      c.postcode,
      c.city,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(params.id)} />,
        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSaveClick(params.id)} showInMenu />,
        <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => handleCancelClick(params.id)} showInMenu />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.row.link)} color="error" />,
      ],
    },
    { field: 'firstname', headerName: 'First Name', width: 150, editable: true },
    { field: 'lastname', headerName: 'Last Name', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'phone', headerName: 'Phone', width: 150, editable: true },
    { field: 'streetaddress', headerName: 'Address', width: 200, editable: true },
    { field: 'postcode', headerName: 'Postcode', width: 120, editable: true },
    { field: 'city', headerName: 'City', width: 150, editable: true },
    {
      field: 'addTraining',
      headerName: 'Add Training',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <AddTraining customer={params.row.link} refreshTrainings={fetchCustomers} />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 0, m: 0, boxSizing: 'border-box' }}>
      <Paper sx={{ width: '100%', minHeight: '100vh', overflow: 'hidden', borderRadius: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <CustomerForm onCustomerAdded={fetchCustomers} />
            <Button variant="contained" onClick={exportToCSV}>Export to CSV</Button>
          </Stack>
          <TextField
            label="Search..."
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={handleSearch}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
            processRowUpdate={processRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            disableRowSelectionOnClick
            density="comfortable"
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerList;
