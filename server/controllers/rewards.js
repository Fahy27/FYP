import RewardModel from "../models/reward.js";
import UserModel from "../models/user.js";


export async function createReward(req, res) {
    if(!req.userId) {
        res.sendStatus(401)
        return
    }
    try {
        await RewardModel.create({
            name: req.body.name,
            text: req.body.text,
            cost: req.body.cost       
        })
        res.sendStatus(201)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function buyReward(req, res) {
    if(!req.userId) {
        res.sendStatus(401)
        return
    }
    try {
        const userCurrency = (await UserModel.findById(req.userId))?.currency
        const reward = await RewardModel.findById(req.body._id)
        const rewardCost = reward?.cost

        if(rewardCost > userCurrency) {
            res.status(200).json({error: "Not enough currency"})
            return
        }

        await UserModel.updateOne({_id: req.userId}, {$inc: {currency: -rewardCost}})
        res.status(200).json({"text": reward?.text})
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function listRewards(req, res) {
    try {
        const rewards = await RewardModel.find().select({name: 1, cost: 1})
        res.status(200).json(rewards)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}