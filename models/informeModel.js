const mongoose = require("mongoose");

const informeModel = new mongoose.Schema({
    operacion: {
        type: String,
        enum: {
            values:["Compra","Venta"],
            message: "Especifica si fue una venta o compra"
        },
    },
    KG: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    local: {
        type: mongoose.Schema.ObjectId,
        ref: "Local"
    },
    producto: {
        type: mongoose.Schema.ObjectId,
        ref: "Producto"
    }
});

const Informe = mongoose.model("Informe", informeModel);
module.exports = Informe;