
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Link, Copy, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SurveyLinkGenerator = ({ surveys, onBack }) => {
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [generatedLinks, setGeneratedLinks] = useState([]);

  const generateLink = () => {
    if (!selectedSurvey || !dateRange.startDate || !dateRange.endDate) {
      toast({
        title: "Missing Information",
        description: "Please select a survey and provide date range.",
        variant: "destructive"
      });
      return;
    }

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
      status: 'active'
    };

    setGeneratedLinks([newLink, ...generatedLinks]);
    
    // Save to localStorage
    const savedLinks = JSON.parse(localStorage.getItem('survey_links') || '[]');
    savedLinks.push(newLink);
    localStorage.setItem('survey_links', JSON.stringify(savedLinks));

    toast({
      title: "Link Generated",
      description: "Survey link has been created successfully.",
    });
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Survey link has been copied to clipboard.",
    });
  };

  const toggleLinkStatus = (linkId) => {
    setGeneratedLinks(prev => 
      prev.map(link => 
        link.id === linkId 
          ? { ...link, status: link.status === 'active' ? 'inactive' : 'active' }
          : link
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generate Survey Link
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Link Generator */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Create Survey Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Survey Template</label>
                <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a survey template" />
                  </SelectTrigger>
                  <SelectContent>
                    {surveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.id}>
                        {survey.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="border-gray-200"
                  />
                </div>
              </div>

              <Button 
                onClick={generateLink}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Link className="w-4 h-4 mr-2" />
                Generate Survey Link
              </Button>

              {selectedSurvey && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Survey Preview</h4>
                  <div className="text-sm text-blue-700">
                    <p><strong>Title:</strong> {surveys.find(s => s.id === selectedSurvey)?.title}</p>
                    <p><strong>Questions:</strong> {surveys.find(s => s.id === selectedSurvey)?.questions} questions</p>
                    <p><strong>Type:</strong> External survey with IP tracking</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Links */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Generated Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Link className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No survey links generated yet.</p>
                  <p className="text-sm">Create your first survey link to get started.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedLinks.map((linkData) => (
                    <div key={linkData.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{linkData.surveyTitle}</h4>
                          <p className="text-sm text-gray-600">
                            Active: {linkData.startDate} to {linkData.endDate}
                          </p>
                        </div>
                        <Badge variant={linkData.status === 'active' ? 'default' : 'secondary'}>
                          {linkData.status}
                        </Badge>
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
                        <span>{linkData.responses} responses</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => copyLink(linkData.link)}
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Link
                        </Button>
                        <Button 
                          onClick={() => toggleLinkStatus(linkData.id)}
                          variant="outline" 
                          size="sm"
                        >
                          {linkData.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How to Use Survey Links</CardTitle>
          </CardHeader>
          <CardContent>
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
                <p className="text-sm text-gray-600">Monitor responses in real-time with IP-based duplicate prevention.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyLinkGenerator;
