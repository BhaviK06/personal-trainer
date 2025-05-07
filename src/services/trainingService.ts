import axios from 'axios';
import { Training } from '../types';

const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

export const getTrainings = () => axios.get(`${API_URL}/trainings`);

export const addTraining = (trainingData: Training) => axios.post(`${API_URL}/trainings`, trainingData);

export const deleteTraining = (id: number) => axios.delete(`${API_URL}/trainings/${id}`);
