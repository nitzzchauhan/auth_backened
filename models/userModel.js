import mongoose from "mongoose"


// Defining a Schema
const userSchema = new mongoose.Schema({
    name: {type : String, required: true, trim : true},
    email: {type : String, required: true, trim : true, unique:true},
    password: {type : String, required: true, trim : true},
    tc : {type:Boolean, required : true}
})

const userModel = mongoose.model("user", userSchema)

export default userModel
