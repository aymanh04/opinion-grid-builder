
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, BarChart3, Eye, Download, FileText, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const SurveyAnalytics = ({ survey, onBack }) => {
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

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
              <p className="text-gray-600">{survey.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              onClick={() => setViewMode('overview')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={viewMode === 'responses' ? 'default' : 'outline'}
              onClick={() => setViewMode('responses')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Responses
            </Button>
            <Button
              variant={viewMode === 'reports' ? 'default' : 'outline'}
              onClick={() => setViewMode('reports')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
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

        {viewMode === 'overview' && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Response Frequency Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Response Frequency Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
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

              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={generateReport}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Full Report
                  </Button>
                  <Button 
                    onClick={() => setViewMode('responses')}
                    variant="outline" 
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
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
                    variant="outline" 
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Question Analytics */}
            <div className="space-y-6">
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
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">{analytics.responses.length} text responses</p>
                          <div className="max-h-60 overflow-y-auto space-y-3">
                            {analytics.responses.map((response, i) => (
                              <div key={i} className="p-3 bg-gray-50 rounded-lg border text-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium text-gray-700">Response #{i + 1}</span>
                                  <span className="text-xs text-gray-500">{response.length} characters</span>
                                </div>
                                <p className="text-gray-800">"{response}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="grid lg:grid-cols-2 gap-6">
                          <div>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={analytics.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="option" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3B82F6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div>
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
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {viewMode === 'responses' && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Individual Responses ({responses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Response ID</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>IP Hash</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">#{response.id}</TableCell>
                      <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-sm">{response.ipHash.substr(0, 12)}...</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedResponse(response)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {viewMode === 'reports' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Survey Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Questions</p>
                    <p className="text-2xl font-bold text-blue-800">{survey.questions?.length || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Total Responses</p>
                    <p className="text-2xl font-bold text-purple-800">{responses.length}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-emerald-600 font-medium">Avg. Daily Responses</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {Math.round(responses.length / Math.max(1, getResponseFrequency().length))}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Response Rate</p>
                    <p className="text-2xl font-bold text-orange-800">94%</p>
                  </div>
                </div>
                <Button onClick={generateReport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Response Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
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
          </div>
        )}

        {/* Response Detail Modal */}
        {selectedResponse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Response #{selectedResponse.id} Details</CardTitle>
                <p className="text-sm text-gray-600">
                  Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  IP Hash: {selectedResponse.ipHash}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedResponse.answers.map((answer, index) => {
                  const question = survey.questions?.find(q => q.id === answer.questionId);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">{question?.question}</p>
                      <Badge variant="outline" className="mb-2">
                        {question?.type === 'text' ? 'Text Response' : question?.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                      </Badge>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">
                          {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                        </p>
                      </div>
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
