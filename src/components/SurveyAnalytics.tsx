
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ArrowLeft, Users, BarChart3, Eye, FileText } from 'lucide-react';

// Import our new components
import OverviewSection from './analytics/OverviewSection';
import ResponsesSection from './analytics/ResponsesSection';
import ReportsSection from './analytics/ReportsSection';
import ResponseModal from './analytics/ResponseModal';
import { Survey } from '@/types/types';

interface SurveyAnalyticsProps {
  survey: Survey;
  onBack: () => void;
}

const SurveyAnalytics = ({ survey, onBack }: SurveyAnalyticsProps) => {
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'responses', 'reports'

  useEffect(() => {
    // Generate more realistic mock response data with proper frequency distribution
    const mockResponses = Array.from({ length: survey.responses || 50 }, (_, i) => ({
      id: i + 1,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipHash: `hash_${Math.random().toString(36).substr(2, 9)}`,
      answers: survey.questions?.map((question) => {
        if (question.type === 'text') {
          const textAnswers = [
            'Great service, very satisfied with the quality and attention to detail',
            'Could be improved, especially in terms of response time',
            'Excellent experience overall, would definitely recommend',
            'Average experience, nothing special but meets expectations',
            'Outstanding quality and customer service exceeded my expectations',
            'Poor experience, needs significant improvement',
            'Good value for money, satisfied with the service provided',
            'Not satisfied, did not meet my expectations at all'
          ];
          return {
            questionId: question.id,
            answer: textAnswers[Math.floor(Math.random() * textAnswers.length)]
          };
        } else {
          // Create more realistic distribution for choice questions
          const weights = question.options?.map(() => Math.random() + 0.1) || [];
          const totalWeight = weights.reduce((sum, w) => sum + w, 0);
          const normalizedWeights = weights.map(w => w / totalWeight);
          
          const random = Math.random();
          let selectedIndex = 0;
          let cumulative = 0;
          
          for (let i = 0; i < normalizedWeights.length; i++) {
            cumulative += normalizedWeights[i];
            if (random <= cumulative) {
              selectedIndex = i;
              break;
            }
          }
          
          if (question.type === 'multiple') {
            // For multiple choice, sometimes select additional options
            const selectedOptions = [question.options[selectedIndex]];
            question.options?.forEach((option, index) => {
              if (index !== selectedIndex && Math.random() < 0.3) {
                selectedOptions.push(option);
              }
            });
            return {
              questionId: question.id,
              answer: selectedOptions
            };
          } else {
            return {
              questionId: question.id,
              answer: question.options?.[selectedIndex]
            };
          }
        }
      }) || []
    }));
    setResponses(mockResponses);
  }, [survey]);

  const getQuestionAnalytics = (question) => {
    const questionResponses = responses.map(r => 
      r.answers.find(a => a.questionId === question.id)?.answer
    ).filter(Boolean);

    if (question.type === 'text') {
      return { type: 'text', responses: questionResponses };
    }

    // For choice questions, count occurrences
    const counts = {};
    questionResponses.forEach(response => {
      if (Array.isArray(response)) {
        response.forEach(option => {
          counts[option] = (counts[option] || 0) + 1;
        });
      } else {
        counts[response] = (counts[response] || 0) + 1;
      }
    });

    return {
      type: 'chart',
      data: Object.entries(counts).map(([option, count]) => ({
        option,
        count: Number(count),
        percentage: ((Number(count) / questionResponses.length) * 100).toFixed(1)
      }))
    };
  };

  // Generate response frequency over time
  const getResponseFrequency = () => {
    const frequencyData = {};
    responses.forEach(response => {
      const date = new Date(response.submittedAt).toLocaleDateString();
      frequencyData[date] = (frequencyData[date] || 0) + 1;
    });
    
    return Object.entries(frequencyData)
      .map(([date, count]) => ({ date, responses: Number(count) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const generateReport = () => {
    const reportData = {
      survey: survey.title,
      totalResponses: responses.length,
      dateRange: {
        start: responses.length > 0 ? new Date(Math.min(...responses.map(r => new Date(r.submittedAt).getTime()))).toLocaleDateString() : 'N/A',
        end: responses.length > 0 ? new Date(Math.max(...responses.map(r => new Date(r.submittedAt).getTime()))).toLocaleDateString() : 'N/A'
      },
      questions: survey.questions?.map(question => ({
        question: question.question,
        type: question.type,
        analytics: getQuestionAnalytics(question)
      })) || []
    };
    
    const reportContent = `Survey Report: ${reportData.survey}\n\nTotal Responses: ${reportData.totalResponses}\nDate Range: ${reportData.dateRange.start} - ${reportData.dateRange.end}\n\n${reportData.questions.map((q, i) => `Question ${i + 1}: ${q.question}\nType: ${q.type}\n${q.analytics.type === 'text' ? `Text responses: ${q.analytics.responses.length}` : q.analytics.data.map(d => `${d.option}: ${d.count} (${d.percentage}%)`).join('\n')}\n`).join('\n')}`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title}_report.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #EEF2FF, #E0E7FF, #F5F3FF)',
      py: 4,
      px: 3
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="text" 
              onClick={onBack} 
              startIcon={<ArrowLeft />}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{survey.title}</Typography>
              <Typography variant="body1" color="text.secondary">{survey.description}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'overview' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('overview')}
              startIcon={<BarChart3 />}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'responses' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('responses')}
              startIcon={<Eye />}
            >
              Responses
            </Button>
            <Button
              variant={viewMode === 'reports' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('reports')}
              startIcon={<FileText />}
            >
              Reports
            </Button>
          </Box>
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md:4}}>
            <Card sx={{ 
              background: 'linear-gradient(to bottom right, #3B82F6, #2563EB)',
              color: 'white',
              boxShadow: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} variant="body2">
                      Total Responses
                    </Typography>
                    <Typography variant="h4">{responses.length}</Typography>
                  </Box>
                  <Users />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md:4}}>
            <Card sx={{ 
              background: 'linear-gradient(to bottom right, #8B5CF6, #7C3AED)',
              color: 'white',
              boxShadow: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} variant="body2">
                      Questions
                    </Typography>
                    <Typography variant="h4">{survey.questions?.length || 0}</Typography>
                  </Box>
                  <BarChart3 />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md:4}}>
            <Card sx={{ 
              background: 'linear-gradient(to bottom right, #10B981, #059669)',
              color: 'white',
              boxShadow: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} variant="body2">
                      Completion Rate
                    </Typography>
                    <Typography variant="h4">94%</Typography>
                  </Box>
                  <Eye />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Sections */}
        {viewMode === 'overview' && (
          <OverviewSection 
            survey={survey}
            responses={responses}
            getQuestionAnalytics={getQuestionAnalytics}
            getResponseFrequency={getResponseFrequency}
            generateReport={generateReport}
            setViewMode={setViewMode}
          />
        )}

        {viewMode === 'responses' && (
          <ResponsesSection 
            responses={responses}
            setSelectedResponse={setSelectedResponse}
          />
        )}

        {viewMode === 'reports' && (
          <ReportsSection 
            survey={survey}
            responses={responses}
            getResponseFrequency={getResponseFrequency}
            generateReport={generateReport}
          />
        )}

        {/* Response Detail Modal */}
        <ResponseModal 
          selectedResponse={selectedResponse}
          survey={survey}
          onClose={() => setSelectedResponse(null)}
        />
      </Box>
    </Box>
  );
};

export default SurveyAnalytics;
