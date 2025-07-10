
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PublicSurvey = () => {
  const { surveyId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAlreadyResponded, setHasAlreadyResponded] = useState(false);

  useEffect(() => {
    // Load survey data
    const savedSurveys = JSON.parse(localStorage.getItem('survey_templates') || '[]');
    const foundSurvey = savedSurveys.find((s: { id: string; }) => s.id === surveyId);
    
    if (foundSurvey) {
      setSurvey(foundSurvey);
    }

    // Check if IP has already responded
    const ipHash = generateIPHash();
    const existingResponses = JSON.parse(localStorage.getItem(`survey_responses_${surveyId}`) || '[]');
    const hasResponded = existingResponses.some(r => r.ipHash === ipHash);
    
    if (hasResponded) {
      setHasAlreadyResponded(true);
    }

    setIsLoading(false);
  }, [surveyId]);

  const generateIPHash = () => {
    // In a real app, this would be generated server-side
    const userAgent = navigator.userAgent;
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily hash
    return btoa(`${userAgent}_${timestamp}`).slice(0, 12);
  };

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoice = (questionId, option, checked) => {
    setResponses(prev => {
      const current = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...current, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: current.filter(item => item !== option)
        };
      }
    });
  };

  const handleSubmit = () => {
    // Validate responses
    const unansweredQuestions = survey.questions.filter(q => !responses[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete Survey",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Save response
    const ipHash = generateIPHash();
    const response = {
      id: Date.now().toString(),
      surveyId,
      sessionId,
      ipHash,
      submittedAt: new Date().toISOString(),
      answers: survey.questions.map(q => ({
        questionId: q.id,
        answer: responses[q.id]
      }))
    };

    // Save to localStorage
    const existingResponses = JSON.parse(localStorage.getItem(`survey_responses_${surveyId}`) || '[]');
    existingResponses.push(response);
    localStorage.setItem(`survey_responses_${surveyId}`, JSON.stringify(existingResponses));

    // Update survey response count
    const savedSurveys = JSON.parse(localStorage.getItem('survey_templates') || '[]');
    const updatedSurveys = savedSurveys.map(s => 
      s.id === surveyId ? { ...s, responses: s.responses + 1 } : s
    );
    localStorage.setItem('survey_templates', JSON.stringify(updatedSurveys));

    setIsSubmitted(true);
    toast({
      title: "Survey Submitted",
      description: "Thank you for your response!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey Not Found</h2>
            <p className="text-gray-600">The survey you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasAlreadyResponded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Already Responded</h2>
            <p className="text-gray-600">You have already submitted a response to this survey. Only one response per person is allowed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your response has been submitted successfully. We appreciate your participation.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Survey Header */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {survey.title}
              </CardTitle>
              <p className="text-gray-600 text-lg">{survey.description}</p>
              <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-500">
                <span>{survey.questions.length} questions</span>
                <span>•</span>
                <span>Estimated time: {Math.ceil(survey.questions.length * 1.5)} minutes</span>
              </div>
            </CardHeader>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {survey.questions.map((question, index) => (
              <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <span className="text-blue-600 mr-2">{index + 1}.</span>
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.type === 'text' && (
                    <Textarea
                      value={responses[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder="Enter your response..."
                      className="min-h-[100px]"
                    />
                  )}

                  {question.type === 'single' && (
                    <RadioGroup
                      value={responses[question.id] || ''}
                      onValueChange={(value) => handleInputChange(question.id, value)}
                    >
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}_${optIndex}`} />
                          <Label htmlFor={`${question.id}_${optIndex}`} className="text-gray-700">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === 'multiple' && (
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${question.id}_${optIndex}`}
                            checked={(responses[question.id] || []).includes(option)}
                            onCheckedChange={(checked) => handleMultipleChoice(question.id, option, checked)}
                          />
                          <Label htmlFor={`${question.id}_${optIndex}`} className="text-gray-700">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 text-lg"
            >
              Submit Survey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSurvey;
