import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateJwt, SECRET } from '../middleware';
import { User } from '../db';


const router = express.Router();

router.post('/signup', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, password});
    if(user) {
        res.status(402).json({'message' : 'User already exists'});
    } else {
        const newUser = new User({username, password});
        await newUser.save();
        const token = jwt.sign({id : newUser._id}, SECRET, {'expiresIn' : '1h'});
        res.status(200).json({'message' : 'User created successfully', token});
    }
});

router.post('/login', authenticateJwt,async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, password});
    if(user) {
        const token = jwt.sign({id : user._id}, SECRET, {'expiresIn' : '1h'});
        res.status(200).json({'message' : 'Successfully loggedin', token});
    } else {
        res.status(402).json({'message' : 'Invalid username or password'});
    }
});
export default router;

