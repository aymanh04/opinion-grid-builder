import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { TrendingUp, Download, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Survey } from '@/types/types';

interface OverviewSectionProps {
  survey: Survey;
  responses: any[];
  getQuestionAnalytics: (question: any) => any;
  getResponseFrequency: () => any[];
  generateReport: () => void;
  setViewMode: (mode: string) => void;
}

const OverviewSection = ({ 
  survey, 
  responses, 
  getQuestionAnalytics, 
  getResponseFrequency, 
  generateReport, 
  setViewMode 
}: OverviewSectionProps) => {
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Response Frequency Chart */}
        <Grid size={{ xs: 12, md:8}}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp style={{ width: 20, height: 20 }} />
                Response Frequency Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={getResponseFrequency()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="responses" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid  size={{ xs: 12, md:6}}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  onClick={generateReport}
                  variant="contained"
                  sx={{ 
                    background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #2563EB, #7C3AED)'
                    }
                  }}
                  startIcon={<Download />}
                >
                  Generate Full Report
                </Button>
                <Button 
                  onClick={() => setViewMode('responses')}
                  variant="outlined"
                  startIcon={<Eye />}
                >
                  View All Responses
                </Button>
                <Button 
                  onClick={() => {
                    const csvContent = [
                      ['Response ID', 'Submitted At', 'IP Hash', ...survey.questions?.map(q => q.question) || []],
                      ...responses.map(r => [
                        r.id,
                        new Date(r.submittedAt).toLocaleString(),
                        r.ipHash,
                        ...r.answers.map(a => Array.isArray(a.answer) ? a.answer.join('; ') : a.answer)
                      ])
                    ].map(row => row.join(',')).join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${survey.title}_responses.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  variant="outlined"
                  startIcon={<Download />}
                >
                  Export CSV
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Question Analytics */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Question Analytics</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {survey.questions?.map((question, index) => {
            const analytics = getQuestionAnalytics(question);
            
            return (
              <Card key={question.id} sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Q{index + 1}: {question.question}
                    </Typography>
                    <Chip 
                      label={question.type === 'text' ? 'Text Response' : question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {analytics.type === 'text' ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {analytics.responses.length} text responses
                      </Typography>
                      <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
                        {analytics.responses.map((response, i) => (
                          <Paper key={i} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2">Response #{i + 1}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {response.length} characters
                              </Typography>
                            </Box>
                            <Typography variant="body2">"{response}"</Typography>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md:6}}>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={analytics.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="option" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Grid>
                      <Grid size={{ xs: 12, md:6}}>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={analytics.data}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              label={({ option, percentage }) => `${option}: ${percentage}%`}
                            >
                              {analytics.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default OverviewSection;