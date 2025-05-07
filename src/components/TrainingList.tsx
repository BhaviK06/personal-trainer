import { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Training {
  id: string;
  date: string;
  duration: number;
  activity: string;
  customerName: string;
  selfLink: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(
        'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings'
      );
      const data = await res.json();
      const embeddedTrainings = data._embedded?.trainings ?? [];

      const detailedTrainings = await Promise.all(
        embeddedTrainings.map(async (t: any) => {
          let customerName = '';
          try {
            const customerRes = await fetch(t._links.customer.href);
            if (customerRes.ok) {
              const customerData = await customerRes.json();
              customerName = `${customerData.firstname} ${customerData.lastname}`;
            }
          } catch (err) {
            console.warn('Failed to fetch customer', err);
          }

          return {
            id: t._links.self.href.split('/').pop(),
            date: t.date,
            duration: t.duration,
            activity: t.activity,
            selfLink: t._links.self.href,
            customerName: customerName || 'Unknown',
          };
        })
      );

      setTrainings(detailedTrainings);
    } catch (err) {
      console.error('Failed to load trainings:', err);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleDelete = async (selfLink: string) => {
    if (!window.confirm('Are you sure you want to delete this training?')) return;

    try {
      const res = await fetch(selfLink, { method: 'DELETE' });
      if (res.ok) {
        setTrainings(trainings.filter(t => t.selfLink !== selfLink));
      } else {
        alert('Failed to delete training');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Trainings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell>{t.duration}</TableCell>
                <TableCell>{t.activity}</TableCell>
                <TableCell>{t.customerName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(t.selfLink)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
