const factory = require("../controllers/CRUDfactory");
const Producto = require("../models/productosModel");
const Informe = require("../models/informeModel");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/error");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");

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

exports.registrarFotoProducto = catchAsync(async (req,res,next) => {
    if(!req.file) return next();
    const imagen = `producto-${req.params.id}-${Date.now()}`;
    await sharp(req.file.buffer).resize(500,500).toFormat("jpeg").jpeg({quality: 90}).toFile(`public/img/productos/${imagen}`);
    cloudinary.uploader.upload(`public/img/productos/${imagen}`,{
        resource_type: "image",
        public_id: imagen
    });
    let url = cloudinary.image(imagen);
    await Producto.findByIdAndUpdate(req.params.id, {
        foto: url.split(" ")[1].split("=")[1].split("'")[1]
    });
    next();
})

exports.crearProducto = catchAsync(async (req,res,next) => {
    const producto = await Producto.create(req.body);
    await Producto.findByIdAndUpdate(producto.id, {
        local: req.user.id
    })
    if(req.file){
        const noticia = `producto-${producto.id}-${Date.now()}`;
        await sharp(req.file.buffer).resize(500,500).toFormat("jpeg").jpeg({quality: 90}).toFile(`public/img/productos/${noticia}`);
        cloudinary.uploader.upload(`public/img/productos/${noticia}`,{
            resource_type: "image",
            public_id: noticia
        });
        let url = cloudinary.image(noticia);
        await Producto.findByIdAndUpdate(producto.id, {
            foto: url.split(" ")[1].split("=")[1].split("'")[1]
        })
    };
    res.status(201).json({
        status: "correcto",
        data: {
            noticia: producto
        }
    });
})

exports.deleteProducto = catchAsync(async (req,res,next) => {
    const doc = await Producto.findById(req.params.id);
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    if(doc.foto){
        const photo = doc.foto.split("/");
        cloudinary.uploader.destroy(photo[photo.length - 1]);
    }
    await Producto.findByIdAndDelete(req.params.id);
    await Informe.deleteMany({ producto: req.params.id });
    res.status(204).json({
        status: "correcto"
    })
});

exports.getProducto = factory.getOne(Producto);
exports.getProductos = factory.getAll(Producto);
exports.updateProducto = factory.update(Producto);