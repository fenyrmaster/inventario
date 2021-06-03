const express = require("express");

const localController = require("../controllers/localController");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");

const viewRouter = express.Router();

viewRouter.get("/app/locales", authController.protect, authController.verificarPermiso, viewController.getInicio);
viewRouter.get("/app/productos", authController.protect, viewController.getProductos);
viewRouter.get("/acceso", viewController.acceso);
viewRouter.get("/app/crearInforme", authController.protect, viewController.createInforme);
viewRouter.get("/app/revisarInformes", authController.protect, viewController.adInformes);
viewRouter.get("/app/adminBienes", authController.protect, viewController.administrarBienes);

module.exports = viewRouter;