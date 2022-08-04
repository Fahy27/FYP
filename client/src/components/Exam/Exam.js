import React, { useEffect, useReducer } from 'react';
import useStyles from './styles';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@material-ui/core'
import { api } from '../../api/index'

const ADD_ENTRIES = 'ADD_ENTRIES'
const SET_SELECTED_ANSWER = 'SET_SELECTED_ANSWER'

let submitted = false

function selectedAnswersReducer(state, action) {
    switch(action.type) {
        case ADD_ENTRIES: {
            const newState = action.answers.map(answer => {
                answer.answer = null
                return answer
            })
            return newState
        }
        case SET_SELECTED_ANSWER: {
            let stateCopy = [...state]
            stateCopy[action.questionIdx].answer = action.newAnswer
            return stateCopy
        }
    }
}


export default function Exam() {
    const classes = useStyles();
    const [selectedAnswers, dispatchSelectedAnswers] = useReducer(selectedAnswersReducer, null)

    useEffect(() => {
        async function loadQuestions() {
            const fetchQuestions = await api.get("/questions/random")
            dispatchSelectedAnswers({type: ADD_ENTRIES, answers: fetchQuestions.data})
        }
        loadQuestions()
    }, [])

    function handleRadioChange(event, questionIdx) {
        dispatchSelectedAnswers({type: SET_SELECTED_ANSWER, questionIdx, newAnswer: parseInt(event.target.value)})
    }
    
    async function handleSubmit (event) {
        event.preventDefault();
        if(!submitted) {
            // only send _id and answer
            const answers = selectedAnswers.map(answer => {
                return {
                    _id: answer._id, 
                    answer: answer.answer
                }
            })

            try {
                submitted = true
                const fetchSubmit = await api.post("/questions/submitAnswers", { answers })
                alert(`You had ${fetchSubmit.data.correctAnswers} correct answers and have been awarded ${fetchSubmit.data.addedPoints} points`)
            } catch(err) {
                alert(err+", are you signed in?")
                submitted = false
            }       
        }
        return false
    }
    
    return (
        <form onSubmit={handleSubmit}>
            {selectedAnswers?.map((answer, questionIdx) => (
                <FormControl key={answer._id} sx={{ m: 3 }} variant="standard" className={`${classes.questionControl}`}>
                    <FormLabel id="demo-error-radios">{answer.question}</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-error-radios"
                        name="quiz"
                        value={answer.answer}
                        onChange={(e) => {handleRadioChange(e, questionIdx)}}
                    >
                        {answer.answers.map((option, idx) => 
                            (<FormControlLabel key={idx} value={idx} control={<Radio />} label={option} />)
                        )}
                    </RadioGroup>
                </FormControl>
            )) ?? "Loading..."}
            {selectedAnswers != null && 
                (<Button variant="contained" type="submit">Submit</Button>)}
            
            
        </form>
    );
}