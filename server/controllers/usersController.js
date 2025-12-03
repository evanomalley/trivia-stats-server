const User = require('../models/Users');
const Question = require('../models/QuestionModel');
const asyncHandler = require('express-async-handler');
const bcrpyt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access private
const getAllUsers = asyncHandler (async (req, res) => {
    const users = await User.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).json({message: 'No users, idk'});
    }
    res.json(users);
});

// @desc create new user
// @route POST /users
// @access private
const createNewUser = asyncHandler (async (req, res) => {
    const {username, password, roles} = req.body;

    // Check data
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: "All fields required"});
    }

    // Duplication check
    const duplicate = await User.findOne({username}).lean().exec();

    if(duplicate){
        return res.status(409).json({message: "Duplicate username"});
    }

    // Hash pwd
    const hPwd = await bcrpyt.hash(password, 10);

    const newUser = {username, password: hPwd, roles};

    // Create and store user to the db
    const user = await User.create(newUser);

    if(user){
        res.status(201).json({message: `New user ${username} created`});
    } else {
        res.status(400).json({message: 'Invalid data received, please try again'});
    }
});


// @desc Update a  user
// @route PATCH /users
// @access private
const updateUser = asyncHandler (async (req, res) => {
    const {id, username, password, roles, active} = req.body;

    // Check data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message: "All fields required, password optional"});
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    // Duplication check
    const duplicate = await User.findOne({username}).lean().exec();

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: "Duplicate username"});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password){
        user.password = await bcrpyt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({message: `${updatedUser.username} updated`});
});

// @desc Delete a  user
// @route Delete /users
// @access private
const deleteUser = asyncHandler (async (req, res) => {
    const {id} = req.body;

    if(!id){
        return res.status(400).json({message: 'User ID required'});
    }

    const question = await Question.findOne({user: id}).lean().exec();
    if(question) {
        return res.status(400).json({message: 'User has assigned notes'});
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({message: 'User not found'});
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllUsers, createNewUser, updateUser, deleteUser
}