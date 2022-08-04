import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { Card, CardContent, CardActions, Typography, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@material-ui/core'
import { api } from '../../api/index'



export default function Rewards() {
    const classes = useStyles();
    const [rewards, setRewards] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        async function loadRewards() {
            const fetchRewards = await api.get("http://localhost:5000/rewards/list")
            setRewards(fetchRewards.data)
        }
        loadRewards()
        
    }, [])

    async function buyReward(id) {
        try {
            const fetchReward = await api.post("/rewards/buy", {_id: id})
            const rewardText = fetchReward.data.text
            alert("Reward message: " + rewardText)
            window.location.reload()
            
        } catch (err) {
            alert("Not enough cash or not signed in")
        }
    }

    
    

    
    return (
       rewards?.map(reward => (
        <>
            <Box className={`${classes.rewardBox}`} key={reward._id}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                            {reward.name}
                        </Typography>
            
                        <Typography variant="body2">
                            Cost: {reward.cost}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => {buyReward(reward._id)}}>Buy</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
       )) ?? "Loading..."
    );
}