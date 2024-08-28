import Patrimoine from "../../models/Patrimoine.js"; 

export const getValeurPatrimoine = (req, res) => {
  try {
    const { date } = req.params;
    const valeur = Patrimoine.calculateValeur(new Date(date));
    res.status(200).json({ date, valeur });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul du patrimoine" });
  }
};

export const getValeurPatrimoineRange = (req, res) => {
  try {
    const { dateDebut, dateFin, jour, type } = req.body;
    const valeurs = Patrimoine.calculateValeurRange(new Date(dateDebut), new Date(dateFin), jour, type);
    res.status(200).json(valeurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul de la plage du patrimoine" });
  }
};
