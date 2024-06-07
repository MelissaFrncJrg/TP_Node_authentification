import dotenv from "dotenv";
import express from "express";
import flash from "connect-flash";
import mongoose from "mongoose";
import path from "path";
import route from "./routes/routes.js";
import session from "express-session";
import { fileURLToPath } from "url";

// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV, HASH_SECRET } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("view engine", "pug");
app.locals.pretty = NODE_ENV !== "production"; // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: "simple",
    secret: "simple",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.errors = req.flash("errors");
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.urlencoded({ extended: true }));

// ==========
// App routers
// ==========

app.use("/", route);

// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log(
      `Successfully connected to database: ${mongoose.connection.db.databaseName}`
    );
  })
  .catch((err) => console.log(err));
