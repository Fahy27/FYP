import QuestionModel from "../models/question.js";
import UserModel from "../models/user.js";

export async function drawRandomQuestions(req, res) {
    try {
        const questions = await QuestionModel.aggregate([
            { $sample: { size: 15 } }, 
            { $project: { question: 1, answers: 1} }
        ])
        res.status(200).json(questions)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function addQuestion(req, res) {
    try {
        await QuestionModel.create({
            question: req.body.question,
            answers: req.body.answers,
            correctAnswer: req.body.correctAnswer, 
        })
        res.sendStatus(201)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function submitAnswers(req, res) {
    if(!req.userId) {
        res.status(401).json({error: "Unauthenticated"})
        return
    }
    let correctAnswers = 0
    for(let answer of req?.body?.answers) {
        // this could likely be made more efficient with findMany()
        // however, this is a simpler solution
        const questionRecord = await QuestionModel.findById(answer._id)
        
        if(questionRecord.correctAnswer === answer.answer) {
            correctAnswers ++
        }
    }

    
    if(correctAnswers === 15) {
        var addedPoints = 20
    } else if(correctAnswers > 7 && correctAnswers < 15) {
        var addedPoints = 15
    } else {
        var addedPoints = 5
    }
    try {
        await UserModel.updateOne({_id: req.userId}, { $inc: {points: addedPoints, currency: addedPoints} }) 
        res.status(200).json({correctAnswers, addedPoints})
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}