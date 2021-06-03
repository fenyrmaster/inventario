const express = require("express");

const informeController = require("../controllers/informeController");
const authController = require("../controllers/authController");

const informeRouter = express.Router();

informeRouter.use(authController.protect);

informeRouter
    .route("/")
    .get(informeController.getInformes)
    .post(informeController.crearInforme)
informeRouter
    .route("/:id")
    .get(informeController.getInforme)
    .patch(informeController.updateInforme)
    .delete(informeController.deleteInforme)

module.exports = informeRouter;