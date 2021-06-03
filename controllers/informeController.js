const factory = require("../controllers/CRUDfactory");
const Informe = require("../models/informeModel");
const Producto = require("../models/productosModel");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/error");

exports.crearInforme = catchAsync(async (req,res,next) => {
    const producto = await Producto.findById(req.body.producto)
    const informe = await Informe.create(req.body);
    await Informe.findByIdAndUpdate(informe.id, {
        local: req.user.id
    });
    if(req.body.operacion === "Compra"){
        await Producto.findByIdAndUpdate(req.body.producto, {
            KGcomprados: producto.KGcomprados + req.body.KG,
            dineroUtilizado: producto.dineroUtilizado + req.body.precio
        })
    } else if(req.body.operacion === "Venta"){
        await Producto.findByIdAndUpdate(req.body.producto, {
            KGvendidos: producto.KGvendidos + req.body.KG,
            dineroObtenido: producto.dineroObtenido + req.body.precio
        })
    }
    res.status(201).json({
        status: "correcto",
        data: {
            noticia: informe
        }
    });
})

exports.deleteInforme = catchAsync(async (req,res,next) => {
    const doc = await Informe.findById(req.params.id);
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    const producto = await Producto.findById(doc.producto);
    if(doc.operacion === "Compra"){
        await Producto.findByIdAndUpdate(doc.producto, {
            KGcomprados: producto.KGcomprados - doc.KG,
            dineroUtilizado: producto.dineroUtilizado - doc.precio
        })
    } else if(doc.operacion === "Venta"){
        await Producto.findByIdAndUpdate(doc.producto, {
            KGvendidos: producto.KGvendidos - doc.KG,
            dineroObtenido: producto.dineroObtenido - doc.precio
        })
    }
    await Informe.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "correcto"
    })
});

exports.getInforme = factory.getOne(Informe);
exports.getInformes = catchAsync(async(req,res,next) => {
    const doc = await Informe.find(req.query).populate({path: "producto"});
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    }
    res.status(200).json({
        status: "correcto",
        resultados: doc.length,
        data: {
            doc
        }
    })
});
exports.updateInforme = catchAsync(async(req,res,next) => {
    const doc = await Informe.findByIdAndUpdate(req.params.id);
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    const producto = await Producto.findById(doc.producto);
    if(doc.operacion === "Compra"){
        await Producto.findByIdAndUpdate(doc.producto, {
            KGcomprados: (producto.KGcomprados - doc.KG) + req.body.KG,
            dineroUtilizado: (producto.dineroUtilizado - doc.precio) + req.body.precio
        })
    } else if(doc.operacion === "Venta"){
        await Producto.findByIdAndUpdate(doc.producto, {
            KGvendidos: (producto.KGvendidos - doc.KG) + req.body.KG,
            dineroObtenido: (producto.dineroObtenido - doc.precio) + req.body.precio
        })
    }
    await Informe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "correcto",
        data: {
            doc
        }
    })
});