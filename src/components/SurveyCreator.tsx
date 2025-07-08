
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowLeft, Type, List, CheckSquare } from 'lucide-react';

const SurveyCreator = ({ onSurveyCreated, onCancel }) => {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'text',
    question: '',
    options: ['']
  });

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) return;
    
    const newQuestion = {
      id: Date.now().toString(),
      ...currentQuestion,
      options: currentQuestion.type === 'text' ? [] : currentQuestion.options.filter(opt => opt.trim())
    };
    
    setSurveyData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setCurrentQuestion({
      type: 'text',
      question: '',
      options: ['']
    });
  };

  const removeQuestion = (questionId) => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const updateOption = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!surveyData.title.trim() || surveyData.questions.length === 0) {
      alert('Please provide a title and at least one question');
      return;
    }
    
    const newSurvey = {
      ...surveyData,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    onSurveyCreated(newSurvey);
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'multiple': return <CheckSquare className="w-4 h-4" />;
      case 'single': return <List className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onCancel} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Survey
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Survey Details */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Survey Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
                <Input
                  value={surveyData.title}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter survey title"
                  className="border-gray-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  value={surveyData.description}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your survey"
                  className="border-gray-200"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Question */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                <Select value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value, options: value === 'text' ? [] : [''] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Field</SelectItem>
                    <SelectItem value="single">Single Choice</SelectItem>
                    <SelectItem value="multiple">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <Input
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question"
                  className="border-gray-200"
                />
              </div>
              
              {currentQuestion.type !== 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="border-gray-200"
                        />
                        {currentQuestion.options.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeOption(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addOption} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
              
              <Button onClick={addQuestion} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Questions ({surveyData.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {surveyData.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions added yet. Start by adding your first question above.
              </div>
            ) : (
              <div className="space-y-4">
                {surveyData.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getQuestionIcon(question.type)}
                            {question.type === 'text' ? 'Text Field' : question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                          </Badge>
                          <span className="text-sm text-gray-500">Question {index + 1}</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                        {question.options.length > 0 && (
                          <ul className="text-sm text-gray-600 ml-4 list-disc">
                            {question.options.map((option, optIndex) => (
                              <li key={optIndex}>{option}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8">
            Create Survey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCreator;
