import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  Logout as LogoutIcon,
  ContentCopy as CopyIcon,
  DateRange as CalendarIcon,
  Delete as DeleteIcon,
  RemoveRedEye as EyeIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import SurveyCreator from './SurveyCreator';
import SurveyAnalytics from './SurveyAnalytics';
import SurveyLinkGenerator from './SurveyLinkGenerator';
import { User, Survey } from '@/types/types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type ViewType = 'dashboard' | 'create' | 'analytics' | 'generate';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const savedSurveys = localStorage.getItem('survey_templates');
    if (savedSurveys) {
      setSurveys(JSON.parse(savedSurveys));
    } else {
      const demoSurveys: Survey[] = [
        {
          id: '1',
          title: 'Customer Satisfaction Survey',
          description: 'Measure customer satisfaction with our services',
          questions: [],
          responses: 124,
          status: 'active',
          createdAt: '2024-01-15',
          lastModified: '2024-01-20'
        },
        {
          id: '2',
          title: 'Employee Feedback Form',
          description: 'Annual employee feedback and engagement survey',
          questions: [],
          responses: 67,
          status: 'draft',
          createdAt: '2024-01-10',
          lastModified: '2024-01-18'
        }
      ];
      setSurveys(demoSurveys);
      localStorage.setItem('survey_templates', JSON.stringify(demoSurveys));
    }
  }, []);

  const handleSurveyCreated = (newSurvey: Omit<Survey, 'id'>): void => {
    const surveyWithId: Survey = { ...newSurvey, id: Date.now().toString() };
    const updatedSurveys = [...surveys, surveyWithId];
    setSurveys(updatedSurveys);
    localStorage.setItem('survey_templates', JSON.stringify(updatedSurveys));
    setCurrentView('dashboard');
    toast.success('Survey created successfully!');
  };

  const handleViewSurvey = (survey: Survey): void => {
    setSelectedSurvey(survey);
    setCurrentView('analytics');
  };

  const generateSurveyLink = (surveyId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/survey/${surveyId}`;
  };

  const copyLink = (surveyId: string): void => {
    const link = generateSurveyLink(surveyId);
    navigator.clipboard.writeText(link);
    toast.success('Survey link copied to clipboard!');
  };

  const handleDeleteClick = (survey: Survey): void => {
    setSurveyToDelete(survey);
    setDeleteDialogOpen(true);
  };

  const deleteSurvey = (): void => {
    if (!surveyToDelete) return;
    
    const updatedSurveys = surveys.filter(survey => survey.id !== surveyToDelete.id);
    setSurveys(updatedSurveys);
    localStorage.setItem('survey_templates', JSON.stringify(updatedSurveys));
    localStorage.removeItem(`survey_responses_${surveyToDelete.id}`);
    
    setDeleteDialogOpen(false);
    setSurveyToDelete(null);
    toast.success('Survey deleted successfully!');
  };

  if (currentView === 'create') {
    return <SurveyCreator onSurveyCreated={handleSurveyCreated} onCancel={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'analytics' && selectedSurvey) {
    return <SurveyAnalytics survey={selectedSurvey} onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'generate') {
    return <SurveyLinkGenerator surveys={surveys} onBack={() => setCurrentView('dashboard')} />;
  }

  const totalResponses = surveys.reduce((acc, s) => acc + s.responses, 0);
  const activeSurveys = surveys.filter(s => s.status === 'active').length;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            LHP Survey Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={user.picture} sx={{ width: 32, height: 32 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="body2">{user.name}</Typography>
            <IconButton color="inherit" onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Card sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Surveys
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {surveys.length}
                    </Typography>
                  </Box>
                  <BarChartIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Card sx={{ backgroundColor: theme.palette.secondary.main, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Responses
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {totalResponses}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Card sx={{ backgroundColor: '#059669', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Surveys
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {activeSurveys}
                    </Typography>
                  </Box>
                  <EyeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCurrentView('create')}
            size="large"
          >
            Create New Survey
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => setCurrentView('generate')}
            size="large"
          >
            Generate Survey Link
          </Button>
        </Box>

        {/* Surveys List */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Your Surveys
          </Typography>

          {surveys.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BarChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No surveys yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first survey to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCurrentView('create')}
              >
                Create Survey
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {surveys.map((survey) => (
                <Paper key={survey.id} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {survey.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {survey.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={survey.status}
                      color={survey.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        {survey.questions?.length || 0} questions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {survey.responses} responses
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created {survey.createdAt}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewSurvey(survey)}
                    >
                      View Analytics
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CopyIcon />}
                      onClick={() => copyLink(survey.id)}
                    >
                      Copy Link
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(survey)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Survey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{surveyToDelete?.title}"? This action cannot be undone and will permanently delete all survey data including responses and analytics.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteSurvey} color="error" variant="contained">
            Delete Survey
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;