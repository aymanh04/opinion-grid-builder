import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Eye } from 'lucide-react';

interface ResponsesSectionProps {
  responses: any[];
  setSelectedResponse: (response: any) => void;
}

const ResponsesSection = ({ responses, setSelectedResponse }: ResponsesSectionProps) => {
  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Eye style={{ width: 20, height: 20 }} />
          Individual Responses ({responses.length})
        </Typography>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Response ID</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>IP Hash</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell sx={{ fontWeight: 500 }}>#{response.id}</TableCell>
                  <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{response.ipHash.substr(0, 12)}...</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedResponse(response)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ResponsesSection;