const Question = require('../models/Question');
const Sequelize = require('sequelize');

exports.getQuestion = async (req, res) => {
    console.log(req.body)
    try{
        const randomQuestions = await Question.findAll({
            order: Sequelize.literal('RAND()'),
            limit: 5, 
          });
          
          if (randomQuestions.length==0) {
            res.status(404).json({ error: 'No questions found' });
            return;
          }
          res.json({randomQuestions:randomQuestions});
    } catch(err){
        console.log('error here')
        res.status(500).json({error: err})
    }
}
