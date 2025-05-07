import axios from 'axios';
import { Customer } from '../types';

const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

export const getCustomers = () => axios.get<{ _embedded: { customers: Customer[] } }>(`${API_URL}/customers`);

export const addCustomer = (customerData: Omit<Customer, "_links">) => axios.post(`${API_URL}/customers`, customerData);

export const updateCustomer = (id: number, customerData: Omit<Customer, "_links">) => axios.put(`${API_URL}/customers/${id}`, customerData);

export const deleteCustomer = (link: string) => axios.delete(link);
