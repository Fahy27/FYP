import React, { useEffect, useReducer } from 'react';
import useStyles from './styles';
import { Radio, RadioGroup, FormControlLabel, FormControl, TextField, FormLabel, Button } from '@material-ui/core'
import { api } from '../../api/index'

const SET_QUESTION = 'SET_QUESTION'
const SET_CORRECT_ANSWER = 'SET_CORRECT_ANSWER'
const UPDATE_ANSWER = 'UPDATE_ANSWER'
const ADD_ANSWER = 'ADD_ANSWER'


function questionReducer(state, action) {
    switch(action.type) {
        case SET_QUESTION: {
            return {
                ...state,
                question: action.question
            }
        }
        case SET_CORRECT_ANSWER: {
            return {
                ...state,
                correctAnswer: action.correctAnswer
            }
        }
        case UPDATE_ANSWER: {
            let oldState = {...state}
            oldState.answers[action.idx] = action.newValue
            return oldState
        }
        case ADD_ANSWER: {
            let oldState = {...state}
            oldState.answers.push("")
            return oldState
        }
    }
}

let submitted = false

export default function CreateQuestion() {
    const classes = useStyles();
    const [question, dispatchQuestion] = useReducer(questionReducer, {question: "", answers: ["", ""], correctAnswer: 0})

    function handleQuestionChange(event) {
        dispatchQuestion({type: SET_QUESTION, question: event.target.value})
    }
    function handleAnswerChange(event, idx) {
        dispatchQuestion({type: UPDATE_ANSWER, idx, newValue: event.target.value})
    }
    function handleRadioChange(event) {
        dispatchQuestion({type: SET_CORRECT_ANSWER, correctAnswer: parseInt(event.target.value)})
    }
    function addAnswer() {
        dispatchQuestion({type: ADD_ANSWER})
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if(!submitted) {
            try {
                submitted = true
                await api.post("/questions/add", question)
                alert("Question added successfully")
            } catch(err) {
                alert(err)
                submitted = false
            }
        }     
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className={classes.questionInput}>
                <TextField id="outlined-basic" label="Question" variant="outlined" value={question.question} onChange={handleQuestionChange}/>
            </div>

            <FormControl sx={{ m: 3 }} variant="standard" >
                <RadioGroup
                    aria-labelledby="demo-error-radios"
                    value={question.correctAnswer}
                    onChange={(e) => {handleRadioChange(e)}}
                >
                    {question.answers.map((answer, idx) => 
                        (
                            <div>
                                <FormControlLabel key={idx} value={idx} control={<Radio />} label={
                                    <TextField id="outlined-basic" label={`Answer ${idx+1}`} variant="outlined" value={answer} onChange={(e) => handleAnswerChange(e, idx)} />
                                } />
                            </div>
                        )
                    )}
                </RadioGroup>
            </FormControl>
            <Button variant="contained" className={classes.blockBtn} onClick={addAnswer}>Add Answer</Button>
            <Button variant="contained" type="submit" className={classes.blockBtn}>Submit</Button>
            
        </form>
    );
}