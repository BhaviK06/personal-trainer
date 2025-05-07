import React, { useState } from 'react';
import { addCustomer } from '../services/customerService';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';


const CustomerForm: React.FC<{ refreshCustomers: () => void }> = ({ refreshCustomers }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);
      refreshCustomers();
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Customer
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField 
            label="First Name" 
            name="firstname" 
            value={formData.firstname} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
            label="Last Name" 
            name="lastname" 
            value={formData.lastname} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
            label="Email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
            label="Phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField  
            label="Street Address" 
            name="streetaddress" 
            value={formData.streetaddress} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField 
            label="Postcode" 
            name="postcode" 
            value={formData.postcode} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField 
            label="City" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Customer
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerForm;