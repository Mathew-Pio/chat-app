import Message from "../models/Message.js";

export const addMessage = async (req, res) => {
try{
    const {from, to, message} = req.body;
    const data = new Message({
        message: {text: message},
        users: [from, to],
        sender: from,
    });
    await data.save();
    if(data) return res.status(200).json({msg: 'Message added successfully', data});
    return res.json({msg: 'Message added fail'});
}catch(err){
    console.log(err);
}
}

export const getAllMessages = async (req, res) => {
    try{
        const {from, to} = req.body;
        const messages = await Message.find({
            users: {
                $all:[from, to]
            }
        }).sort({updatedAt:1});
        
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        res.json(projectedMessages);
    }catch(err){
        console.log(err)
    }
}