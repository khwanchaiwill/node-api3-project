const express = require('express');

const router = express.Router();

const Users = require("./userDb");
const Posts = require("../posts/postDb")



router.post('/', validateUser, ( req, res) => {
  // do your magic!
  const body = req.body;
  Users.insert(body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: "Error while you are in process can not save data"})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  
  const id = req.params.id; 
    console.log(req.params.id)
    const posts = req.body;
    posts.user_id = Number(id);
  Posts.insert(posts)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: "Error while you are in process can not save data"})
    })
   
});

router.get('/', (req, res) => {
  // do your magic!
  const query = req.query;
  Users.get(query)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      .json({
        message: "Error while you are in process can not get data"
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.user.id)
    .then(userId => {
      res.status(200).json(userId)
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      .json({
        message: "Error while you are in process can not get data"
      })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!

  Users.getUserPosts(req.user.id)
    .then(postData => {
      res.status(200).json(postData)
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      .json({
        message: "Error while you are in process can not get user's post"
      })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then(move => {
      if(move > 0){
        res.status(200).json({
          message: "user successful deleted"
        })
      }else{
        res.status(404)
        .json({
          message: "Can not found user"
        })
      }
     
    })
    .catch(err =>{
       res.status(500)
       .json({
      message: " Error while processing to remove the user"
    })
    })
   

});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const newUpdate = req.body;
  Users.update(req.user.id, newUpdate)
      .then(user => {
          res.status(200).json(user)
      })
      .catch(err => {
          res.status(500).json({ error: "The post information could not be modified." }, err)
      })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
    .then(user => {
      if(user){
        req.user = user;
        next();
      }else if (!user){
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Err while get Id"
      })
    })
}

function validateUser (req, res, next) {
  // do your magic!
  const query = req.query;
  if (query) {
    next();
  } else if (!query.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    res.status(400).json({ message: "missing user data" });
  }
 
}

function validatePost (req, res, next) {
  // do your magic!
const posts = req.body;
    if(posts){
        next();
      }
    else if(!posts.text) {
      res
        .status(400)
        .json({ message: "missing required text field" });
    }
      else if(!posts){
        res.status(400).json({ message: "missing post data" })
      }

}

module.exports = router;
