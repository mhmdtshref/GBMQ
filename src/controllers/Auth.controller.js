const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('env2')('config.env');

const { SECRET, ADMINSECRET } = process.env;
const StudentController = require('./Student.controller');
const AdminController = require('./Admin.controller');


const hashStudentPassword = student => new Promise((resolve, reject) => {
  if (student.password.length >= 6) {
    bcrypt.hash(student.password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        reject(hashError);
      } else {
        const newStudent = student;
        newStudent.password = hashedPassword;
        resolve(newStudent);
      }
    });
  } else {
    reject(new Error('Password must be at least 6 characters!'));
  }
});

const generateIdCookie = ({ id }) => new Promise((resolve, reject) => {
  jwt.sign({ id }, SECRET, (signErr, token) => {
    if (signErr || !token) {
      reject(signErr || new Error('No token has generated!'));
    } else {
      resolve(token);
    }
  });
});

const generateAdminIdCookie = ({ id }) => new Promise((resolve, reject) => {
  jwt.sign({ id }, ADMINSECRET, (signErr, token) => {
    if (signErr || !token) {
      reject(signErr || new Error('No token has generated!'));
    } else {
      resolve(token);
    }
  });
});

const matchPasswords = (user, password) => new Promise((resolve, reject) => {
  bcrypt.compare(password, user.password)
    .then((matchingState) => {
      if (!matchingState) {
        reject(new Error('Password is not correct!'));
      }
      resolve(user);
    })
    .catch((compareErr) => {
      reject(compareErr);
    });
});

const signup = (req, res) => {
  const student = req.body;
  hashStudentPassword(student)
    .then(StudentController.create)
    .then(generateIdCookie)
    .then((token) => {
      res.cookie('id', token, { maxAge: 360000000 });
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, error: err.message });
    });
};

const login = (req, res) => {
  const { username, password } = req.body;
  StudentController.findStudentByUsername(username)
    .then(student => matchPasswords(student, password))
    .then(generateIdCookie)
    .then(token => res.cookie('id', token, { maxAge: 360000000 }).json({ success: true }))
    .catch((err) => {
      res.json({ success: false, error: err.message });
    });
};

const adminLogin = (req, res) => {
  const { username, password } = req.body;
  AdminController.findAdmin(username)
    .then(admin => matchPasswords(admin, password))
    .then(generateAdminIdCookie)
    .then(token => { res.cookie('id', token, { maxAge: 360000000 }).json({ success: true })})
    .catch((err) => {
      res.json({ success: false, error: err.message });
    });
};

module.exports = {
  signup,
  login,
  adminLogin,
};
