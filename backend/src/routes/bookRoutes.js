import express from "express";

const router = express.Router();
//#region un livre

router.post("/", protectRoute, async (req,res) => {
    try {
        //Récupération des données de la requete
        const { title, caption, rating, image} = req.body;
        // Vérification du remplissage des champs
        if(!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "Veuillez fournir tous les champs"});
        }
        //Charge les images du cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url 

        const newBook = ({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id,
        });
        //Enregistrement du livre en BDD
        await newBook.save()
        // Retour du livre créé avec un code 201
        res.status(201).json(newBook)
    
    } catch (error) {
        console.log("Erreur de création du livre", error);
        res.status(500).json({ message: error.message});
    }
});

//#endregion







//#region tous les livres

export default router;
