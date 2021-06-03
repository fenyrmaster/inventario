const express = require("express");

const localController = require("../controllers/localController");
const authController = require("../controllers/authController");


const localRouter = express.Router();

localRouter.post("/acceder", localController.acceder);

localRouter.use(authController.protect);
localRouter.patch("/cambiar/:id", authController.updateContraseña);
localRouter.get("/salir", localController.logout);

localRouter
    .route("/")
    .get(localController.getLocales)
    .post(localController.subirFoto, localController.crearLocal)
localRouter
    .route("/:id")
    .get(localController.getLocal)
    .patch(localController.subirFoto, localController.registrarFoto ,localController.updateLocal)
    .delete(localController.deleteLocal)

module.exports = localRouter;