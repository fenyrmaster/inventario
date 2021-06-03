const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/error");

exports.getAll = (Model) => catchAsync(async (req,res,next) => {
    const doc = await Model.find(req.query);
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
exports.getOne = (Model) => catchAsync(async (req,res,next) => {
    const doc = await Model.findById(req.params.id);
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    res.status(200).json({
        status: "correcto",
        data: {
            doc
        }
    })
})
exports.update = (Model) => catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    res.status(200).json({
        status: "correcto",
        data: {
            doc
        }
    })
})
exports.delete = (Model) => catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new CustomError("No se encontro ningun documento", 403));
    };
    res.status(204).json({
        status: "correcto"
    })
})