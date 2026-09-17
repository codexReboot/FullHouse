import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import pool from "./config/database.js";
import session from "express-session";
import flash from "connect-flash";

const app = express();

// Test database
try {
	const [rows] = await pool.query("SELECT DATABASE() AS database_name");

	console.log(`Connected to database: ${rows[0].database_name}`);
} catch (error) {
	console.error("Database connection failed:", error);
}

// Resolve project paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set absolute paths
const viewsPath = path.join(__dirname, "../views");
const publicPath = path.join(__dirname, "../public");

// Configure Express
app.set("views", viewsPath); // where to find views
app.set("view engine", "ejs"); // tells node that "index" is index.ejs

// Serve static files
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

// Session config
app.use(
	session({
		secret: "boogiewoogiesecret", // required – used to sign the cookie
		resave: false, // don’t force save if unmodified
		saveUninitialized: true, // create a session even if it’s never used
		cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 3, // cookie lives 3 hours
			maxAge: 1000 * 60 * 60 * 3,
		},
	}),
);
// connect flash
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	next();
});

const PORT = process.env.PORT || 3000;

// Root page
app.get("/", (req, res) => {
	const projectName = "FullHouse Project";
	res.render("index", { project: projectName });
});

// Login page
app.get("/login", (req, res) => {
	// res.send("Welcome to the Login Page");
	const pageName = "Login Page";
	res.render("login", { pageName });
});

app.post("/login", (req, res) => {
	console.log(req.body);
	req.flash("success", "Success! You have logged in.");
	res.redirect("/");
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
