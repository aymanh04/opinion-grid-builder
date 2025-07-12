import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardHeader,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  TextFields as TextFieldsIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import { Survey, SurveyQuestion } from '@/types';

interface SurveyCreatorProps {
  onSurveyCreated: (survey: Omit<Survey, 'id'>) => void;
  onCancel: () => void;
}

interface CurrentQuestion {
  type: 'text' | 'single' | 'multiple';
  question: string;
  options: string[];
}

const SurveyCreator: React.FC<SurveyCreatorProps> = ({ onSurveyCreated, onCancel }) => {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    questions: [] as SurveyQuestion[],
  });

  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>({
    type: 'text',
    question: '',
    options: [''],
  });

  const theme = useTheme();

  const addQuestion = (): void => {
    if (!currentQuestion.question.trim()) return;

    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type: currentQuestion.type,
      question: currentQuestion.question,
      options: currentQuestion.type === 'text' ? [] : currentQuestion.options.filter(opt => opt.trim()),
    };

    setSurveyData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setCurrentQuestion({
      type: 'text',
      question: '',
      options: [''],
    });
  };

  const removeQuestion = (questionId: string): void => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }));
  };

  const updateOption = (index: number, value: string): void => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  const addOption = (): void => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const removeOption = (index: number): void => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (): void => {
    if (!surveyData.title.trim() || surveyData.questions.length === 0) {
      alert('Please provide a title and at least one question');
      return;
    }

    const newSurvey: Omit<Survey, 'id'> = {
      ...surveyData,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };

    onSurveyCreated(newSurvey);
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'text': return <TextFieldsIcon />;
      case 'multiple': return <CheckBoxIcon />;
      case 'single': return <RadioIcon />;
      default: return <TextFieldsIcon />;
    }
  };

  const getQuestionTypeLabel = (type: string): string => {
    switch (type) {
      case 'text': return 'Text Field';
      case 'multiple': return 'Multiple Choice';
      case 'single': return 'Single Choice';
      default: return 'Text Field';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onCancel}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Create New Survey
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Survey Details */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ mb: 4 }}>
              <CardHeader title="Survey Details" />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Survey Title"
                  value={surveyData.title}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter survey title"
                  fullWidth
                  required
                />

                <TextField
                  label="Description"
                  value={surveyData.description}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your survey"
                  fullWidth
                  multiline
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Add Question */}
            <Card>
              <CardHeader title="Add Question" />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={currentQuestion.type}
                    label="Question Type"
                    onChange={(e) => setCurrentQuestion(prev => ({ 
                      ...prev, 
                      type: e.target.value as 'text' | 'single' | 'multiple',
                      options: e.target.value === 'text' ? [] : [''] 
                    }))}
                  >
                    <MenuItem value="text">Text Field</MenuItem>
                    <MenuItem value="single">Single Choice</MenuItem>
                    <MenuItem value="multiple">Multiple Choice</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Question"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question"
                  fullWidth
                  required
                />

                {currentQuestion.type !== 'text' && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Options
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {currentQuestion.options.map((option, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            fullWidth
                            size="small"
                          />
                          {currentQuestion.options.length > 1 && (
                            <IconButton 
                              onClick={() => removeOption(index)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={addOption}
                        startIcon={<AddIcon />}
                        size="small"
                      >
                        Add Option
                      </Button>
                    </Box>
                  </Box>
                )}

                <Button
                  variant="contained"
                  onClick={addQuestion}
                  startIcon={<AddIcon />}
                  fullWidth
                  size="large"
                >
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Questions List */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader title={`Questions (${surveyData.questions.length})`} />
              <CardContent>
                {surveyData.questions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No questions added yet. Start by adding your first question.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {surveyData.questions.map((question, index) => (
                      <Paper key={question.id} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip
                                icon={getQuestionIcon(question.type)}
                                label={getQuestionTypeLabel(question.type)}
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                Question {index + 1}
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                              {question.question}
                            </Typography>
                            {question.options.length > 0 && (
                              <Box sx={{ ml: 2 }}>
                                {question.options.map((option, optIndex) => (
                                  <Typography key={optIndex} variant="body2" color="text.secondary">
                                    • {option}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                          </Box>
                          <IconButton
                            onClick={() => removeQuestion(question.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                size="large"
                sx={{ px: 4 }}
              >
                Create Survey
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SurveyCreator;