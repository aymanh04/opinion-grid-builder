import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';

interface ResponseModalProps {
  selectedResponse: any;
  survey: any;
  onClose: () => void;
}

const ResponseModal = ({ selectedResponse, survey, onClose }: ResponseModalProps) => {
  if (!selectedResponse) return null;

  return (
    <Modal
      open={!!selectedResponse}
      onClose={onClose}
      aria-labelledby="response-details-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card sx={{ 
        width: '100%', 
        maxWidth: 600, 
        maxHeight: '80vh', 
        overflow: 'auto',
        outline: 'none'
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Response #{selectedResponse.id} Details
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            IP Hash: {selectedResponse.ipHash}
          </Typography>
          
          {selectedResponse.answers.map((answer, index) => {
            const question = survey.questions?.find(q => q.id === answer.questionId);
            return (
              <Box key={index} sx={{ 
                border: 1, 
                borderColor: 'grey.200', 
                borderRadius: 1, 
                p: 2, 
                mb: 2 
              }}>
                <Typography variant="subtitle1" gutterBottom>
                  {question?.question}
                </Typography>
                <Chip 
                  label={question?.type === 'text' ? 'Text Response' : question?.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography>
                    {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ResponseModal;