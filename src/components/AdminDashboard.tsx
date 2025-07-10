
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, BarChart3, Users, Eye, LogOut, Copy, Calendar, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import SurveyCreator from './SurveyCreator';
import SurveyAnalytics from './SurveyAnalytics';
import SurveyLinkGenerator from './SurveyLinkGenerator';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  useEffect(() => {
    // Load surveys from localStorage
    const savedSurveys = localStorage.getItem('survey_templates');
    if (savedSurveys) {
      setSurveys(JSON.parse(savedSurveys));
    } else {
      // Demo data
      const demoSurveys = [
        {
          id: '1',
          title: 'Customer Satisfaction Survey',
          description: 'Measure customer satisfaction with our services',
          questions: 5,
          responses: 124,
          status: 'active',
          createdAt: '2024-01-15',
          lastModified: '2024-01-20'
        },
        {
          id: '2',
          title: 'Employee Feedback Form',
          description: 'Annual employee feedback and engagement survey',
          questions: 8,
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

  const handleSurveyCreated = (newSurvey) => {
    const updatedSurveys = [...surveys, { ...newSurvey, id: Date.now().toString() }];
    setSurveys(updatedSurveys);
    localStorage.setItem('survey_templates', JSON.stringify(updatedSurveys));
    setCurrentView('dashboard');
    toast({
      title: "Survey Created",
      description: "Your survey template has been created successfully.",
    });
  };

  const handleViewSurvey = (survey) => {
    setSelectedSurvey(survey);
    setCurrentView('analytics');
  };

  const generateSurveyLink = (surveyId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/survey/${surveyId}`;
  };

  const copyLink = (surveyId) => {
    const link = generateSurveyLink(surveyId);
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Survey link has been copied to clipboard.",
    });
  };

  const deleteSurvey = (surveyId) => {
    const updatedSurveys = surveys.filter(survey => survey.id !== surveyId);
    setSurveys(updatedSurveys);
    localStorage.setItem('survey_templates', JSON.stringify(updatedSurveys));
    
    // Also remove any responses for this survey
    localStorage.removeItem(`survey_responses_${surveyId}`);
    
    toast({
      title: "Survey Deleted",
      description: "Survey and all associated data have been permanently deleted.",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LHP Survey Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.picture} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">{user.name}</span>
              </div>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Surveys</p>
                  <p className="text-3xl font-bold">{surveys.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Responses</p>
                  <p className="text-3xl font-bold">{surveys.reduce((acc, s) => acc + s.responses, 0)}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Active Surveys</p>
                  <p className="text-3xl font-bold">{surveys.filter(s => s.status === 'active').length}</p>
                </div>
                <Eye className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            onClick={() => setCurrentView('create')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Survey
          </Button>
          <Button 
            onClick={() => setCurrentView('generate')}
            variant="outline"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Generate Survey Link
          </Button>
        </div>

        {/* Surveys List */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Your Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            {surveys.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
                <p className="text-gray-600 mb-4">Create your first survey to get started</p>
                <Button onClick={() => setCurrentView('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Survey
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {surveys.map((survey) => (
                  <div key={survey.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                        <p className="text-gray-600">{survey.description}</p>
                      </div>
                      <Badge variant={survey.status === 'active' ? 'default' : 'secondary'}>
                        {survey.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{survey.questions} questions</span>
                      <span>{survey.responses} responses</span>
                      <span>Created {survey.createdAt}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleViewSurvey(survey)}
                        variant="outline" 
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button 
                        onClick={() => copyLink(survey.id)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{survey.title}"? This action cannot be undone and will permanently delete all survey data including responses and analytics.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteSurvey(survey.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Survey
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
