const mongoose = require("mongoose");

const productoModel = new mongoose.Schema({
    KGvendidos: {
        type: Number,
        default: 0
    },
    KGcomprados: {
        type: Number,
        default: 0
    },
    dineroObtenido: {
        type: Number,
        default: 0
    },
    dineroUtilizado: {
        type: Number,
        default: 0
    },
    foto: {
        type: String,
        default: "/img/default.png"
    },
    nombre: {
        type: String,
        required: true
    },
    local: {
        type: mongoose.Schema.ObjectId,
        ref: "Local"
    }
});

const Producto = mongoose.model("Producto", productoModel);
module.exports = Producto;