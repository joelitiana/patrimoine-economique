import Possession from "../../models/possessions/Possession.js";

export const getPossessions = (req, res) => {
  try {
    const possessions = Possession.getAll();
    res.status(200).json(possessions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des possessions" });
  }
};

export const createPossession = (req, res) => {
  try {
    const { libelle, valeur, dateDebut, taux } = req.body;
    const nouvellePossession = new Possession(libelle, valeur, dateDebut, taux);
    nouvellePossession.save();
    res.status(201).json(nouvellePossession);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la possession" });
  }
};

export const updatePossession = (req, res) => {
  try {
    const { libelle } = req.params;
    const { dateFin } = req.body;
    const possession = Possession.findByLibelle(libelle);
    if (!possession) {
      return res.status(404).json({ message: "Possession non trouvée" });
    }
    possession.dateFin = dateFin;
    possession.save();
    res.status(200).json(possession);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la possession" });
  }
};

export const closePossession = (req, res) => {
  try {
    const { libelle } = req.params;
    const possession = Possession.findByLibelle(libelle);
    if (!possession) {
      return res.status(404).json({ message: "Possession non trouvée" });
    }
    possession.dateFin = new Date();
    possession.save();
    res.status(200).json(possession);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la clôture de la possession" });
  }
};
