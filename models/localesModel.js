const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const localModel = new mongoose.Schema({
    domicilio: {
        type: String,
        unique: true,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
    foto: {
        type: String,
    },
    permiso: {
        type: Boolean,
        default: false
    },
    inborrable: {
        type: Boolean,
        default: false
    }
});

localModel.pre("save", async function(next) {
    if(!this.isModified("contraseña")) return next();
    this.contraseña = await bcrypt.hash(this.contraseña, 12);
    next();
});

localModel.methods.correctPass = async function(canPass, userPass) {
    return await bcrypt.compare(canPass, userPass);
}

const Local = mongoose.model("Local", localModel);
module.exports = Local;