const Local = require("../models/localesModel");
const Informe = require("../models/informeModel");
const Producto = require("../models/productosModel");
const catchAsync = require("../utils/catchAsync");

exports.getProductos = catchAsync(async (req,res) =>  {
    const productos = await Producto.find({ local: req.user.id });
    res.status(200).render("productos", {
        user: req.user,
        productos
    });
});

exports.administrarBienes = catchAsync(async (req,res) =>  {
    const productos = await Producto.find({ local: req.user.id });
    res.status(200).render("bienesGanancias", {
        user: req.user,
        productos
    });
});

exports.adInformes = catchAsync(async (req,res) =>  {
    const informes = await Informe.find({ local: req.user.id }).populate({path: "producto"});
    res.status(200).render("revisarInforme", {
        user: req.user,
        informes
    });
});


exports.createInforme = catchAsync(async (req,res) =>  {
    const productos = await Producto.find({ local: req.user.id });
    res.status(200).render("crearInforme", {
        user: req.user,
        productos
    });
});

exports.getInicio = catchAsync(async (req,res) =>  {
    const locales = await Local.find();
    res.status(200).render("locales", {
        user: req.user,
        locales
    });
});

exports.acceso = catchAsync(async (req,res) =>  {
    res.status(200).render("login");
});