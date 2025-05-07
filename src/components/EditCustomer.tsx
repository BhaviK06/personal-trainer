import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type Customer = {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  links: { rel: string; href: string }[];
};

type Props = {
  customer: Customer;
  fetchCustomers: () => void;
};

const EditCustomer: React.FC<Props> = ({ customer, fetchCustomers }) => {
  const [open, setOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState({ ...customer });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCustomer({ ...editedCustomer, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const url = customer.links.find(link => link.rel === 'self')?.href;
    if (!url) return;

    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedCustomer),
    })
      .then(() => {
        fetchCustomers();
        setOpen(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} aria-label="edit">
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField label="First Name" name="firstname" value={editedCustomer.firstname} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Last Name" name="lastname" value={editedCustomer.lastname} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Street Address" name="streetaddress" value={editedCustomer.streetaddress} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Postcode" name="postcode" value={editedCustomer.postcode} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="City" name="city" value={editedCustomer.city} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Email" name="email" value={editedCustomer.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Phone" name="phone" value={editedCustomer.phone} onChange={handleChange} fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditCustomer;
