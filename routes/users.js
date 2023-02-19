const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../helpers/jwt');



//To get the list of all users for managers and admin
router.get(`/`, auth.requireAdmin, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
});

//To get a single user for manager, admin and default for a Employee
router.get('/:id', auth.requireEmployee, async (req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({success: false, message:'Cannot find the user'});
    }

    res.send(user);
});

//To register or post a new user to the database by admin or manager
router.post('/', auth.requireManager, async (req, res)=>{
    let user = new User({
        username: req.user.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    });

    user = await user.save();

    if(!user){
        return res.status(404).send('The user could not be created!');
    }

    res.send(user);
});

//logging in the user
router.post('/login', async (req, res)=>{
    const user = await User.findOne({email: req.body.email});
    const secret_key = process.env.secret_key;
    if(!user){
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            { 
                userId: user.id,
                role: user.role
            },
            secret_key,
            {expiresIn: '1d'}
        )
            
        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('The password is incorrect');
    }
});

//to register a user using http post request
router.post('/register', auth.requireEmployee, async (req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        role: req.body.role
    });
    user = await user.save();

    if(!user)
    return res.status(400).send('The user cannot be created');

    res.send(user);
});

//To get the count of users
router.get(`/get/count`, auth.requireAdmin, async (req, res)=>{
    const userCount = await User.countDocuments();
  
    if(!userCount){
      res.status(500).json({success: false, message:'Unable to retrieve Users count'});
    }
  
    res.send({
        userCount: userCount
    });
  });

//To delete a particular user 
router.delete('/:id', auth.requireEmployee, (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user){
            return res.status(200).json({success: true, message: 'The user is deleted'})
        } else{
            return res.status(404).json({success: false, message: 'The user is not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});

module.exports = router;