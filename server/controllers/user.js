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

    const {password, ...rest} = user._doc

    await user.save();

    return res.status(201).json({status: true, user})
    }catch(err){
        return res.status(500).json({msg:'Internal server error'})
    }
}