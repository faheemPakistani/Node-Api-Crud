const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User")


//add new post
router.post('/',async (req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
    res.status(200).json(savedPost)
    } catch (error) {
    res.status(500).json(error)
        
    }
})

//update post

router.put('/:id',async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("updated")
    }else{
        res.status(403).json("You can update only your posts")
    } 
    }
    catch(error){
        console.log(error);
    }
})

//delete post
router.delete('/:id',async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("deleted")
    }else{
        res.status(403).json("You can delete only your posts")
    } 
    }
    catch(error){
        console.log(error);
    }
})



//like post


router.put('/:id/like',async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!(post.likes.includes(req.body.userId))){
            await post.updateOne({$push: {likes:req.body.userId}})
            res.status(200).json("liked")
        }else{
            await post.updateOne({$pull: {likes:req.body.userId}})
            res.status(200).json("disliked")

        }
    }
    catch(error){
        console.log(error);
    }
})

//get timeline posts
router.get("/timeline/:userId", async (req,res)=>{
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.json("error")
    }
})

//get post
router.get("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(403).json("Post not found")
    }
})


module.exports = router;
