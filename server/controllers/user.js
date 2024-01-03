import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try{
        const { username, email } = req.body;

    const usernameCheck = await User.findOne({ username });
    if(usernameCheck){
        return res.staus(404).json({msg:'Username already used', status: false})
    }

    const emailCheck = await User.findOne({email})
    if(emailCheck){
        return res.status(404).json({msg:'Email alred used', status: false})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username,
        email,
        password: hashedPassword
    });
    
    await user.save();

    const {password, ...rest} = user.toObject();

    return res.status(201).json({status: true, user: rest})
    }catch(err){
        return res.status(500).json({msg:'Internal server error'})
    }
}

export const login = async (req, res) => {
    try{
        const { identifier } = req.body;

        const user = await User.findOne({ 
            $or: [{ username: identifier}, {email: identifier }]
        });

        if(!user){
            return res.status(404).json({msg:'Username or password is incorrect', status: false})
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)

        if(!isPasswordCorrect){
            return res.status(404).json({msg:'Username or Email and Password is incorrect'})
        }
        const {password, ...rest} = user.toObject();

        return res.status(200).json({status: true, user: rest})
    }catch(err){
        console.log(err)
    }
}

export const setAvatar = async(req, res) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet: true,
            avatarImage,
        },{new:true})

        return res.status(200).json({isSet:userData.isAvatarImageSet, image:userData.avatarImage})
    }catch(err){
        console.log(err);
    }
}

export const allUsers = async (req, res) => {
    try{
        const users = await User.find({_id: { $ne: req.params.id }}).select([
            'email',
            'username',
            'avatarImage',
            '_id'
        ])
        return res.status(200).json(users)
    }catch(err){
        console.log(err)
    }
}















