const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Question = sequelize.define('question' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qns_text: Sequelize.STRING,
    option1: Sequelize.STRING,
    option2: Sequelize.STRING,
    option3: Sequelize.STRING,
    option4: Sequelize.STRING,
    correct_option: Sequelize.STRING,
    
});

module.exports = Question;

Question.bulkCreate([
  {
    qns_text: 'What is the capital of France?',
    option1: 'Berlin',
    option2: 'Madrid',
    option3: 'Rome',
    option4: 'Paris',
    correct_option: 'Paris'
  },
  {
    qns_text: 'Which planet is known as the Red Planet?',
    option1: 'Earth',
    option2: 'Mars',
    option3: 'Jupiter',
    option4: 'Venus',
    correct_option: 'Mars'
  },
  {
    qns_text: 'Who wrote the play "Romeo and Juliet"?',
    option1: 'Charles Dickens',
    option2: 'William Shakespeare',
    option3: 'Jane Austen',
    option4: 'Mark Twain',
    correct_option: 'William Shakespeare'
  },
  {
    qns_text: 'Which gas do plants absorb from the atmosphere?',
    option1: 'Oxygen',
    option2: 'Carbon Dioxide',
    option3: 'Hydrogen',
    option4: 'Nitrogen',
    correct_option: 'Carbon Dioxide'
  },
  {
    qns_text: 'What is the largest mammal in the world?',
    option1: 'Elephant',
    option2: 'Giraffe',
    option3: 'Blue Whale',
    option4: 'Lion',
    correct_option: 'Blue Whale'
  },
  {
    qns_text: 'Which country is known as the Land of the Rising Sun?',
    option1: 'China',
    option2: 'India',
    option3: 'Japan',
    option4: 'South Korea',
    correct_option: 'Japan'
  },
  {
    qns_text: 'What is the chemical symbol for gold?',
    option1: 'Au',
    option2: 'Ag',
    option3: 'Fe',
    option4: 'Cu',
    correct_option: 'Au'
  },
  {
    qns_text: 'Who painted the Mona Lisa?',
    option1: 'Vincent van Gogh',
    option2: 'Pablo Picasso',
    option3: 'Leonardo da Vinci',
    option4: 'Michelangelo',
    correct_option: 'Leonardo da Vinci'
  },
  {
    qns_text: 'Which planet is known as the "Morning Star" or "Evening Star"?',
    option1: 'Mars',
    option2: 'Venus',
    option3: 'Saturn',
    option4: 'Neptune',
    correct_option: 'Venus'
  },
  {
    qns_text: 'Who is known as the "Father of Modern Physics"?',
    option1: 'Isaac Newton',
    option2: 'Albert Einstein',
    option3: 'Stephen Hawking',
    option4: 'Galileo Galilei',
    correct_option: 'Albert Einstein'
  }
]);
