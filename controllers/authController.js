const Local = require("../models/localesModel");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/error");
const JWT = require("jsonwebtoken");
const { promisify } = require("util");

exports.updateContraseña = catchAsync(async(req,res,next) => {
    const user = await Local.findById(req.params.id).select("+contraseña");
    if(!user || !await user.correctPass(req.body.contraseña, user.contraseña)){
        return next(new CustomError("La contraseña no es correcta", 401))
    }
    user.contraseña = req.body.newContraseña;
    await user.save();
    res.status(201).json({
        status: "correcto",
        message: "Contraseña cambiada",
        data: {
            user
        }
    })
})

exports.protect = catchAsync(async (req,res,next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        return next(new CustomError("Tienes que acceder para hacer esto", 401))
    }
    const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET);
    const freshUser = await Local.findById(decoded.id);
    if(!freshUser){
        return next(new CustomError("El usuario ya no existe", 401))
    }

    req.user = freshUser;
    next();
});

exports.verificarPermiso = catchAsync(async (req,res,next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET);
    const freshUser = await Local.findById(decoded.id);
    if(freshUser.permiso === false){
        return next(new CustomError("No tienes permiso para acceder", 401))
    }
    next();
});