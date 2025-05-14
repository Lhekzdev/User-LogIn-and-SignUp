
const mongoose = require("mongoose")

const authSchema = new mongoose.Schema(
    {
        email: { type: String, required:true},
        firstName: { type: String, default:"" },
        passWord: { type: String, required:true ,select:false},
        lastName: { type: String , default:""},
        state:{type:String, default:""},
        verified:{type:Boolean, default:false}
    }, {timestamp:true}

    
)

const Auth = new mongoose.model("Auth", authSchema)

module.exports = Auth