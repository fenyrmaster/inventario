const path = require("path");
const express = require('express');
const rateLimit = require("express-rate-limit");
const errorHandler = require("./controllers/errorController");
const helmet = require("helmet");
const CustomError = require("./utils/error");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const localRouter = require("./routes/localRoutes");
const productoRouter = require("./routes/productosRoutes");
const viewRouter = require("./routes/viewRoutes");
const informeRouter = require("./routes/informeRoutes");

app.set("view engine", "pug");
app.set("views",path.join(__dirname, "views"));
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 250,
  windowMs: 60*60*1000,
  message: "Too many request from this IP, Please try again in an hour" 
});
app.use("/api",limiter);

app.enable("trust proxy");

app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitizer());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/locales", localRouter);
app.use("/api/productos", productoRouter);
app.use("/api/informes", informeRouter);
app.use("/", viewRouter);

// app.options("/api/v1/tours/:id", cors());

app.all("*", (req,res,next) => {
  const err = new CustomError(`the given URL (${req.originalUrl}) is not valid`, 404);
  next(err);
});

app.use(errorHandler);

module.exports = app;
