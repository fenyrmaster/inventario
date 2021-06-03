const factory = require("../controllers/CRUDfactory");
const Local = require("../models/localesModel");
const catchAsync = require("../utils/catchAsync");
const Producto = require("../models/productosModel");
const Informe = require("../models/informeModel");
const CustomError = require("../utils/error");
const JWT = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");

const signToken = id => {
    return JWT.sign({ id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const points = {
    points: 5,
    duration: 15*60*1000,
    blockDuration: 15*60*1000
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")){
        cb(null, true)
    } else {
        cb(new CustomError("El archivo subido no es una imagen, por favor use una imagen", 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.subirFoto = upload.single("foto");

exports.registrarFoto = catchAsync(async (req,res,next) => {
    if(!req.file) return next();
    const imagen = `local-${req.params.id}-${Date.now()}`;
    await sharp(req.file.buffer).resize(2000,1333).toFormat("jpeg").jpeg({quality: 90}).toFile(`public/img/local/${imagen}`);
    cloudinary.uploader.upload(`public/img/local/${imagen}`,{
        resource_type: "image",
        public_id: imagen
    });
    let url = cloudinary.image(imagen);
    await Local.findByIdAndUpdate(req.params.id, {
        foto: url.split(" ")[1].split("=")[1].split("'")[1]
    });
    next();
})

exports.crearLocal = catchAsync(async (req,res,next) => {
    const local = await Local.create(req.body);
    if(req.file){
        const noticia = `local-${local.id}-${Date.now()}`;
        await sharp(req.file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({quality: 90}).toFile(`public/img/local/${noticia}`);
        cloudinary.uploader.upload(`public/img/local/${noticia}`,{
            resource_type: "image",
            public_id: noticia
        });
        let url = cloudinary.image(noticia);
        await Local.findByIdAndUpdate(local.id, {
            foto: url.split(" ")[1].split("=")[1].split("'")[1]
        })
    };
    res.status(201).json({
        status: "correcto",
        data: {
            noticia: local
        }
    });
})

exports.deleteLocal = catchAsync(async (req,res,next) => {
    const doc = await Local.findById(req.params.id);
    const producto = await Producto.find({local: doc._id});
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    if(doc.foto){
        const photo = doc.foto.split("/");
        cloudinary.uploader.destroy(photo[photo.length - 1]);
    }
    producto.forEach(async el => {
        await Informe.deleteMany({ producto: el.id });
    })
    await Local.findByIdAndDelete(req.params.id);
    await Producto.deleteMany({ local: doc._id });
    res.status(204).json({
        status: "correcto"
    })
});

exports.acceder = catchAsync(async (req,res,next) => {
    if(req.headers.cookie){
        if(req.headers.cookie.includes("LotOfTries=")){
        return next(new CustomError("Espera 10 minutos para tu proximo intento", 403));
        }
    }
    const {nombre, contraseña} = req.body;
    const user = await Local.findOne({nombre: nombre}).select("+contraseña");

    if(!nombre || !contraseña){
        return next(new CustomError("Tienes que poner tu contraseña y correo electronico", 400));
    }

    if(!user || !(await user.correctPass(contraseña,user.contraseña))) {
        points.points = points.points - 1;

        if(points.points === 0){
            points.points = 5;
            res.cookie("LotOfTries", "error", {
                maxAge: 600000,
                secure: req.secure || req.headers["x-fowarded-proto"] === "https"
            });
            return next(new CustomError("Demasiados fallos, intentalo de nuevo en 10 minutos", 400));
        }
        return next(new CustomError("Los datos no son correctos", 400));
    }
    points.points = 5;
    const token = signToken(user._id);
    res.cookie("jwt", token, {
        maxAge: process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000,
        httpOnly: true,
        secure: req.secure || req.headers["x-fowarded-proto"] === "https"
    });
    user.contraseña = undefined;

    res.status(201).json({
        status: "correcto",
        token: token,
        data: {
            user
        }
    })
});

exports.logout = (req,res) => {
    res.clearCookie("jwt");
    res.status(200).json({status: "correcto"});
}


exports.getLocal = factory.getOne(Local);
exports.getLocales = factory.getAll(Local);
exports.updateLocal = factory.update(Local);

