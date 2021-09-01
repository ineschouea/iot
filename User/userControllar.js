var express =require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var User = require('./user');

//=>localhost:3000/users/user
router.use('/user', (req, res) => {
  res.send("Welcome to User Interface")
});

//=>localhost:3000/users/admin
router.use('/admin', (req, res) => {
  res.send("Welcome to Admin Interface")
});

//=>localhost:3000/users/register
router.post('/register',(req,res,next) => {
    var user = new User();
       user.fullName = req.body.fullName;
       user.email = req.body.email;
       user.password = req.body.password;
    
    user.save((err, docs) =>{
      if(!err){
          res.send(docs);
      }else{
          if(err.code == 11000)
             res.status(422).send(['Duplicate email adress found'])
          else
              if(err.name == 'ValidationError'){
                  var valErrors = [];
                  Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
                  res.status(422).send(valErrors);
              }
           }
    });
});

//=>localhost:3000/users/authenticate/email/password
router.post('/authenticate/:email/:password',(req,res,next) => {
  User.find({"email": req.params.email}, (err, docs)=> {
    if (err){
      console.log(err)
    }else{
        if(docs[0] == undefined)
        res.redirect(307, "/users/register");
        else
        //res.send("Hello "+docs[0].fullName);
        //res.redirect(307, "/users/user");
       res.redirect(307, "/users/admin");

    }
  });
});

// => localhost:3000/users/usersList
router.get('/usersList', (req, res) => {
    User.find((err, docs) =>{
        if(!err){
            res.send(docs);
        }else{
            console.log('Error in retriving Users: '+JSON.stringify(err, undefined, 2))
        }
    });
});


// => localhost:3000/users/displayUser/id
router.get('/displayUser/:id', (req, res) => {
  if(!ObjectId.isValid(req.params.id))
      return res.status(400).send('No record with given id:'+ req.params.id)
  User.findById(req.params.id, (err, docs) =>{
      if(!err){
          res.send(docs);
      }else{
          console.log('Error in retriving User: '+JSON.stringify(err, undefined, 2))
      }
  });

});


// => localhost:3000/users/updateUser/id
router.put('/updateUser/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id);
      
    var user = {
        fullName: req.body.fullName,
        email:  req.body.email,
        password:  req.body.password,
    };

    User.findByIdAndUpdate(req.params.id,{ $set: user }, { new: true },(err, docs) => {//new: true--> update showed
        if(!err){
            res.send(docs);
        }else{
            console.log('Error in updating User: '+JSON.stringify(err, undefined, 2))
        }
    });  

});

// => localhost:3000/users/DeleteUser/id
router.delete('/DeleteUser/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record with given id:'+ req.params.id);

    User.findByIdAndRemove(req.params.id, (err, docs) =>{
      if(!err){
         res.send(docs);
      }else{
         console.log('Error in deleting User: '+JSON.stringify(err, undefined, 2))
      }
    });  
});
//Authenticate
/*router.post('/authenticate',(req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user) {
        return res.json({success: false, msg: 'User not found'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          })
        } else {
          return res.json({success: false, msg: 'Wrong password'});
        }
      });
    });
})*/

//Profile
/*router.get('/profile', passport.authenticate('jwt', {session:false}), (req,res,next) => {
    res.json({user: req.user});
})*/

//Get Chats
/*router.get('/chat', (req,res,next) => {
  Chat.getChats((err, chats) => {
      if(err) res.json({errmsg : err})
      res.json(chats);
  })
})*/

/*router.delete('/chat', (req,res,next) => {
  Chat.deleteChats((err, chats) => {
    if(err) res.json({errmsg : err})
    res.json(chats);
  })
})*/

//Get Video Streaming
/*router.get('/video', (req,res,next) => {
  var read = fs.createReadStream(__dirname + '/hh.txt')
  var write = fs.createWriteStream('new.mp4');
  console.log(read)
  read.pipe(write)
})*/

module.exports = router