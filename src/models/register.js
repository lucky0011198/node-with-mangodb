const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dataschema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3
    },
    email: {
        type: String,
        require: true,
        unique: [true, "Email id in alrady taken"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid Email")
            }
        }
    },
    phone: {
        type: Number,
        require: true
    },
    roll: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    confirmpassword: {
        type: String,
        require: true
    },
    tokens:[{
        token:{
            type: String,
            require: true
        }
    }]
})
//generatin token befor register .....
dataschema.methods.generatetoken = async function (next) {
    try {
        //console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SCRET_KEY)
        this.tokens =this.tokens.concat({token:token})

        await this.save();
        //console.log(token);
        return token;
    } catch (error) {
        res.status(401).send(error);
    }

}
//hashing before register

dataschema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password);
    }
    next();
})
//creating  model now
const Data = new mongoose.model('Login', dataschema)
module.exports = Data;