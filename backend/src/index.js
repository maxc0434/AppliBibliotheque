import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js"

// Création de l'instance de l'application Express
const app = express();
const PORT = process.env.PORT || 3000 // condition de connexion sur le port defini dans le .env || ou solution de repli 

//Définition du middleware pour parser les requetes HTTP en JSON
app.use(express.json());


//Definition des routes
app.use("/api/auth", authRoutes)


//Definition du port d'écoute du serveur
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
   });

   