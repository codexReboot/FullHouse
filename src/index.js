import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const app = express();

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

const PORT = process.env.PORT || 3000;

// Root page
app.get("/", (req, res) => {
	const projectName = "FullHouse Project";

	res.render("index", { project: projectName });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
