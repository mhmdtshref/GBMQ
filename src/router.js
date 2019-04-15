const express = require('express');
const path = require('path');
const AuthController = require('./controllers/Auth.controller');
const AdminController = require('./controllers/Admin.controller.js');
const StudentController = require('./controllers/Student.controller');
const QuestionController = require('./controllers/Question.controller');
const QuizController = require('./controllers/Quiz.controller');
const StudentAuthMiddleware = require('./middlewares/checkStudentAuth.middleware');
const ResultController = require('./controllers/Result.controller');
const ActivityController = require('./controllers/Activity.controller');
const ComparisonController = require('./controllers/Comparison.controller');
// const validations = require('./validations');

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/postQuestion', AdminController.postQuestion);

router.get('/checkState', StudentController.checkState);
router.get('/getQuestion/:questionId', QuestionController.getQuestionById);

router.get('/quizQuestionsIds/:quizId', QuizController.getQuizQuestionsIds);
router.post('/postQuiz', [StudentAuthMiddleware.checkStudentAuth], QuizController.postQuiz);

router.get('/getResult', [StudentAuthMiddleware.checkStudentAuth], ResultController);
router.get('/getActivities', [StudentAuthMiddleware.checkStudentAuth], ActivityController.getActivities);
router.get('/getComparison', [StudentAuthMiddleware.checkStudentAuth], ComparisonController);


module.exports = router;
