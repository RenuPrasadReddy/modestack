const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {User} = require('../models/usermodel');

router.post('/register', async(req, res)=> {
    console.log('in signup...');
    try{
        const existingUserOrNot = await User.findOne({email: req.body.email});
        if(!existingUserOrNot){
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                username: req.body.username.trim(),
                password: hashedPassword.trim(),
                email: req.body.email.trim(),
                address: req.body.address.trim()
            }
            await User.create(user);
            res.status(201).json({statusCode: '201', body:{message: "new user created"}});

        }else{
            res.status(200).json('this email is already registered, please try other email or login')
        }
        
    }catch(e){
        res.status(500).json('could not signup now, please try after some time')
    }
    
});

router.post('/login', async (req, res) => {
    console.log('in login...');
    try{
        const user = await User.findOne({username: req.body.username.trim()});
        console.log('user=', user);

        if(!user){
            return res.status(200).send("username is not registered")
        }else{
            if(await bcrypt.compare(req.body.password, user.password)){
                const access_token = jwt.sign({userID: user._id}, process.env.SECRET_KEY, {expiresIn: "30m"});
                res.json({statusCode: "200",body:{message: "Success", accessToken: access_token}});
            }else{
                res.status(200).send('incorrect password, please try again');
            }
        }
    }catch(e){
        console.log(e);
        res.status(500).json('could not login now, please try after some time')
    }
});


module.exports = router;