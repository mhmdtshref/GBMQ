const Sequelize = require('sequelize-views-support');
const sequelize = require('./sequelize');

const Quiz2Mark = sequelize.define('quiz2marks', {
  stdId: Sequelize.INTEGER,
  username: Sequelize.STRING,
  mark: Sequelize.INTEGER,
},
{
  treatAsView: false,
  viewDefinition: `
            CREATE VIEW "quiz2marks" AS (
            SELECT students.id as stdId, students.username, COUNT(questions.id) as mark, max("studentsChoices"."createdAt") as date
            FROM students
            INNER JOIN "studentsChoices" on students.id = "studentsChoices"."studentId"
            INNER JOIN choices on choices.id = "studentsChoices"."choiceId"
            INNER JOIN questions on questions.id = choices."questionId"
            WHERE choices."isRight" = true AND questions."quizNo" = 2
            GROUP BY students.id, students.username);
        `,
});

module.exports = Quiz2Mark;
