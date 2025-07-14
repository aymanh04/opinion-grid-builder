import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { FileText, Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsSectionProps {
    survey: any;
    responses: any[];
    getResponseFrequency: () => any[];
    generateReport: () => void;
}

const ReportsSection = ({
    survey,
    responses,
    getResponseFrequency,
    generateReport
}: ReportsSectionProps) => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <FileText style={{ width: 20, height: 20 }} />
                            Survey Summary
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ bgcolor: '#EBF5FF', p: 2, borderRadius: 1 }}>
                                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                                            Total Questions
                                        </Typography>
                                        <Typography variant="h5" color="primary.dark" sx={{ fontWeight: 'bold' }}>
                                            {survey.questions?.length || 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ bgcolor: '#F3E8FF', p: 2, borderRadius: 1 }}>
                                        <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 500 }}>
                                            Total Responses
                                        </Typography>
                                        <Typography variant="h5" color="secondary.dark" sx={{ fontWeight: 'bold' }}>
                                            {responses.length}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ bgcolor: '#DCFCE7', p: 2, borderRadius: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
                                            Avg. Daily Responses
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#047857' }}>
                                            {Math.round(responses.length / Math.max(1, getResponseFrequency().length))}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ bgcolor: '#FFF7ED', p: 2, borderRadius: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#EA580C' }}>
                                            Response Rate
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C2410C' }}>
                                            94%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Button
                            onClick={generateReport}
                            variant="contained"
                            fullWidth
                            startIcon={<Download />}
                        >
                            Download Full Report
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <Calendar style={{ width: 20, height: 20 }} />
                            Response Timeline
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={getResponseFrequency()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="responses" stroke="#3B82F6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ReportsSection;