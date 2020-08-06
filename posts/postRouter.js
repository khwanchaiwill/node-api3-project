const express = require('express');

const router = express.Router();

const Posts = require('./postDb');


router.get('/', (req, res) => {
  // do your magic!
  const query = req.query;
  Posts.get(query)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500)
      .json({
        message: "Error while you are in process can not get data"
      })
    })

});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.getById(req.post.id)
  .then(postId => {
    res.status(200).json(postId)
  })
  .catch(err => {
    console.log(err)
    res.status(500)
    .json({
      message: "Error while you are in process can not get data"
    })
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
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
  }, err)
  })
 

});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const newUpdate = req.body;
  Posts.update(req.post.id, newUpdate)
      .then(postUpdate => {
          res.status(200).json(postUpdate)
      })
      .catch(err => {
          res.status(500).json({ error: "The post information could not be modified." }, err)
      })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  Posts.getById(req.params.id)
  .then(post => {
    if(post){
      req.post = post;
      next();
    }else if (!post){
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

module.exports = router;
