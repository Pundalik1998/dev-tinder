const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
         
    },
    lastname: {
        type: String
    }
    ,
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email :" + value);
            }
        }
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Not a valid gender")
            }
        }
    }
},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);