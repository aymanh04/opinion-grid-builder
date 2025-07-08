
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, BarChart3, Eye, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SurveyAnalytics = ({ survey, onBack }) => {
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    // Generate mock response data
    const mockResponses = Array.from({ length: survey.responses || 50 }, (_, i) => ({
      id: i + 1,
      submittedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      ipHash: `hash_${Math.random().toString(36).substr(2, 9)}`,
      answers: survey.questions?.map((question, qIndex) => {
        if (question.type === 'text') {
          const textAnswers = [
            'Great service, very satisfied',
            'Could be improved',
            'Excellent experience overall',
            'Average, nothing special',
            'Outstanding quality'
          ];
          return {
            questionId: question.id,
            answer: textAnswers[Math.floor(Math.random() * textAnswers.length)]
          };
        } else {
          const randomOption = question.options?.[Math.floor(Math.random() * question.options.length)];
          return {
            questionId: question.id,
            answer: question.type === 'multiple' 
              ? question.options?.slice(0, Math.floor(Math.random() * question.options.length) + 1)
              : randomOption
          };
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

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
            <p className="text-gray-600">{survey.description}</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Responses</p>
                  <p className="text-3xl font-bold">{responses.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Questions</p>
                  <p className="text-3xl font-bold">{survey.questions?.length || 0}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold">94%</p>
                </div>
                <Eye className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Question Analytics</h2>
            
            {survey.questions?.map((question, index) => {
              const analytics = getQuestionAnalytics(question);
              
              return (
                <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Q{index + 1}: {question.question}
                    </CardTitle>
                    <Badge variant="outline">
                      {question.type === 'text' ? 'Text Response' : question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    {analytics.type === 'text' ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{analytics.responses.length} text responses</p>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {analytics.responses.slice(0, 5).map((response, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                              "{response}"
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={analytics.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="option" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {analytics.data.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span>{item.option}</span>
                              <span className="font-medium">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Individual Responses */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Individual Responses</h2>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {responses.slice(0, 10).map((response) => (
                    <div 
                      key={response.id}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Response #{response.id}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        IP: {response.ipHash.substr(0, 12)}...
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Export Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Response Detail Modal */}
        {selectedResponse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Response #{selectedResponse.id} Details</CardTitle>
                <p className="text-sm text-gray-600">
                  Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedResponse.answers.map((answer, index) => {
                  const question = survey.questions?.find(q => q.id === answer.questionId);
                  return (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <p className="font-medium text-gray-900 mb-2">{question?.question}</p>
                      <p className="text-gray-700">
                        {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                      </p>
                    </div>
                  );
                })}
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setSelectedResponse(null)}>Close</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyAnalytics;
