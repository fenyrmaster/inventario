const express = require("express");

const productosController = require("../controllers/productosController");
const authController = require("../controllers/authController");

const productosRouter = express.Router();

productosRouter.use(authController.protect);

productosRouter
    .route("/")
    .get(productosController.getProductos)
    .post(productosController.subirFoto, productosController.crearProducto)
productosRouter
    .route("/:id")
    .get(productosController.getProducto)
    .patch(productosController.subirFoto, productosController.registrarFotoProducto ,productosController.updateProducto)
    .delete(productosController.deleteProducto)

module.exports = productosRouter;