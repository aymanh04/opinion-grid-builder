
import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import { ArrowLeft, Link, Copy, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Survey, DateRange, GeneratedLink, SurveyStatus } from '@/types/types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

interface SurveyLinkGeneratorProps {
  surveys: Survey[];
  onBack: () => void;
}

const SurveyLinkGenerator = ({ surveys, onBack }: SurveyLinkGeneratorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);

  const generateLink = () => {
    if (!selectedSurvey || !dateRange.startDate || !dateRange.endDate) {
      toast({
        title: "Missing Information",
        description: "Please select a survey and provide date range.",
        variant: "destructive"
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmGenerate = () => {
    const survey = surveys.find(s => s.id === selectedSurvey);
    const linkId = Math.random().toString(36).substr(2, 9);
    const baseUrl = window.location.origin;
    const surveyLink = `${baseUrl}/survey/${selectedSurvey}?session=${linkId}`;
    
    const newLink = {
      id: linkId,
      surveyId: selectedSurvey,
      surveyTitle: survey.title,
      link: surveyLink,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      createdAt: new Date().toISOString(),
      responses: 0,
      status: SurveyStatus.Active
    };

    setGeneratedLinks([newLink]);
    
    // Save to localStorage
    localStorage.setItem('survey_links', JSON.stringify([newLink]));

    setIsModalOpen(false);
    toast({
      title: "Link Generated",
      description: "Survey link has been created successfully.",
    });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Survey link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="text" 
            onClick={onBack} 
            startIcon={<ArrowLeft className="w-4 h-4" />}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Link className="w-5 h-5" />
                Create Survey Link
              </Typography>
              
              <div className="space-y-6">
                <FormControl fullWidth>
                  <InputLabel>Select Survey Template</InputLabel>
                  <Select
                    value={selectedSurvey}
                    onChange={(e) => setSelectedSurvey(e.target.value)}
                    label="Select Survey Template"
                  >
                    {surveys.map((survey) => (
                      <MenuItem key={survey.id} value={survey.id}>
                        {survey.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    type="date"
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <Button 
                  onClick={generateLink}
                  fullWidth
                  variant="contained"
                  startIcon={<Link className="w-4 h-4" />}
                >
                  Generate Survey Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Links Card */}
          <Card sx={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: 0, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Calendar className="w-5 h-5" />
                Generated Links
              </Typography>

              {generatedLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Link className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <Typography variant="body1">No survey links generated yet.</Typography>
                  <Typography variant="body2" color="text.secondary">Create your survey link.</Typography>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedLinks.map((linkData) => (
                    <div key={linkData.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Typography variant="subtitle1">{linkData.surveyTitle}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active: {linkData.startDate} to {linkData.endDate}
                          </Typography>
                        </div>
                        <Chip 
                          label={linkData.status}
                          color={linkData.status === 'active' ? 'primary' : 'default'}
                          size="small"
                        />
                      </div>
                      
                      <div className="bg-gray-50 rounded p-2 mb-3">
                        <p className="text-xs text-gray-600 mb-1">Survey Link:</p>
                        <p className="text-sm font-mono break-all">{linkData.link}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created {new Date(linkData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => copyLink(linkData.link)}
                          variant="outlined" 
                          size="small"
                          className="flex-1"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card sx={{ mt: 4, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: 0, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>How to Use Survey Links</Typography>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Generate Link</h4>
                <p className="text-sm text-gray-600">Select a survey template and set an active date range for responses.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Share Link</h4>
                <p className="text-sm text-gray-600">Copy and share the generated link with your target audience.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Collect Responses</h4>
                <p className="text-sm text-gray-600">Monitor responses and view analytics on the main dashboard.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Survey Link Generation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm the following survey link details:
          </DialogContentText>
          
          {selectedSurvey && (
            <div style={{ marginTop: '16px' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Selected Survey:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {surveys.find(s => s.id === selectedSurvey)?.title}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Active Period:
              </Typography>
              <Typography variant="body1" gutterBottom>
                From {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
              </Typography>
            </div>
          )}
          
          {generatedLinks.length > 0 && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              A survey link already exists. Generating a new link will replace the existing one.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmGenerate}
            variant="contained"
            color="primary"
          >
            Generate Link
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SurveyLinkGenerator;
