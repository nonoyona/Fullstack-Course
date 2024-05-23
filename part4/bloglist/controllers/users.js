const router = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

router.post('/', async (request, response) => {
    try{
        const body = request.body;
        if(body.password.length < 3){
            return response.status(400).json({ error: 'password must be at least 3 characters long' });
        }
        if(body.username.length < 3){
            return response.status(400).json({ error: 'username must be at least 3 characters long' });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(body.password, saltRounds);
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        });
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch(error){
        if(error.code === 11000){
            return response.status(409).json({ error: 'username already exists' });
        }
        response.status(400).json({ error: error.message });
    }
})

router.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs');
    response.json(users);
})

module.exports = router;