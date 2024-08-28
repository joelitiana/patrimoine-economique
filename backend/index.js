import express from "express";
import possessionRoutes from "./routes/possessionRoutes.js";
import patrimoineRoutes from "./routes/patrimoineRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/api/possessions", possessionRoutes);
app.use("/api/patrimoine", patrimoineRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
