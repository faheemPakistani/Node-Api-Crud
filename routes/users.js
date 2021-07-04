const User = require("../models/User")
const router = require("express").Router();
const bcrypt = require("bcrypt")
//update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)

            }catch(err){
                return res.status(500).json(err)
            }
        }

    
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        })
        res.status(200).json("Account has been updated")
    } catch (error) {
        return res.status(500).json(error)
    }
    }
    else{
        return res.status(403).json("You can update only your account")
    }
})
//delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Account has been deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
    }
    else{
        return res.status(403).json("You can delete only your account")
    }
})

//get a user
router.get('/:id', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;
        res.status(200).send(others)
    } catch (error) {
        return res.status(500).send(error)
    }
})

//follow a user

router.put('/:id/follow', async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.follower.includes(req.body.userId)){
                await user.updateOne({$push:{follower: req.body.userId}})
                await currentUser.updateOne({$push:{followings: req.params.id}})
                res.status(200).send("User has been followed")
            }
            else{
                return res.status(403).send("You allready follow this User")
            }
        } catch (error) {
            console.log(error);
        }
    }
    else{
        return res.status(403).send("You cant follow yourself")
    }
})

//unfollow the user
router.put('/:id/unfollow', async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.follower.includes(req.body.userId)){
                await user.updateOne({$pull:{follower: req.body.userId}})
                await currentUser.updateOne({$pull:{followings: req.params.id}})
                res.status(200).send("User has been unfollowed")
            }
            else{
                return res.status(403).send("You allready unfollow this User")
            }
        } catch (error) {
            console.log(error);
        }
    }
    else{
        return res.status(403).send("You cant unfollow yourself")
    }
})

module.exports = router;