import express from "express";
import cors from "cors";
import { routerPossession, routerPatrimoine } from "./routes/index.js";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Define a route for the root URL
app.get("/", (req, res) => {
    res.send("Welcome to the backend server!");
});

app.use("/possession", routerPossession);
app.use("/patrimoine", routerPatrimoine);

app.listen(port, () => console.log("server running on port " + port));
