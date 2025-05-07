import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface Props {
  customerLink: string; // /api/customers/{id}
  onTrainingAdded: () => void;
}

export default function TrainingForm({ customerLink, onTrainingAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customer: customerLink,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTraining({ ...training, [e.target.name]: e.target.value });
  };

  const saveTraining = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(training),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save training');
        return res.json();
      })
      .then(() => {
        onTrainingAdded();
        setOpen(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Training
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (min)"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={saveTraining}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
