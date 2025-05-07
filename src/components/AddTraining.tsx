// src/components/AddTraining.tsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { addTraining } from '../services/trainingService';

interface AddTrainingProps {
  customer: string; // customer URL
  refreshTrainings: () => void;
}

const AddTraining: React.FC<AddTrainingProps> = ({ customer, refreshTrainings }) => {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customer: customer
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTraining({ ...training, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await addTraining(training);
      refreshTrainings();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add training:', error);
    }
  };

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>Add Training</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Training</DialogTitle>
        <DialogContent>
          <TextField name="date" label="Date" type="datetime-local" fullWidth margin="dense" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField name="duration" label="Duration (min)" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="activity" label="Activity" fullWidth margin="dense" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTraining;
