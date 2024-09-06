
import { readFile, writeFile } from "../../data/index.js";
import { Router } from "express";
import Patrimoine from "../../models/Patrimoine.js";
import Possession from "../../models/possessions/Possession.js";
import Personne from "../../models/Personne.js";
import Flux from "../../models/possessions/Flux.js";

export const dataPath = "../data/data.json";

export const routerPossession = Router();

routerPossession.get("/", async (req, res, next) => {
  try {
    let loadedData = await readFile(dataPath);

    if (loadedData.status === "OK") {
      loadedData = loadedData.data;

      const personne = loadedData.find((e) => e.model == "Personne");
      const patrimoine = loadedData.find((e) => e.model == "Patrimoine");

      const possessions = patrimoine.data.possessions;

      const result = loadedData.map((item) => {
        const { model, data } = item;
        if (model == "Personne") {
          return new Personne(data.nom);
        } else {
          const { possesseurs, possessions } = data;
          return possessions
            .map((p) => {
              if (p.jour) {
                return new Flux(
                  new Personne(p.possesseur.nom),
                  p.libelle,
                  p.valeurConstante,
                  new Date(p.dateDebut),
                  p.dateFin ? new Date(p.dateFin) : null,
                  p.tauxAmortissement,
                  p.jour
                );
              }
              return new Possession(
                p.possesseur,
                p.libelle,
                p.valeur,
                new Date(p.dateDebut),
                p.dateFin ? new Date(p.dateFin) : null,
                p.tauxAmortissement
              );
            })
            .map((e) => {
              return { ...e, valeurActuelle: e.getValeur(new Date()) };
            });
        }
      });
      res.json({ success: true, data: result[1] });
    } else {
      throw new Error("Impossible de charger les données");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Une erreur est survenue.",
    });
  }
});

// nouvelle posssesion
routerPossession.post("/", async (req, res, next) => {
  const { libelle, valeur, dateDebut, tauxAmortissement, jour } = req.body;
  let data = await readFile(dataPath);

  if (data.status === "OK") {
    data = data.data;

    const personne = data.find((e) => e.model == "Personne").data;
    const newPossession = jour
      ? {
          possesseur: personne,
          libelle: libelle,
          valeur: 0,
          dateDebut: dateDebut,
          dateFin: null,
          tauxAmortissement: tauxAmortissement ? tauxAmortissement : null,
          jour: jour,
          valeurConstante: parseFloat(valeur),
        }
      : {
          possesseur: personne,
          libelle: libelle,
          valeur: valeur,
          dateDebut: dateDebut,
          dateFin: null,
          tauxAmortissement: tauxAmortissement,
        };

    const possessionsList = data.find((e) => e.model == "Patrimoine").data
      .possessions;

    possessionsList.push(newPossession);

    for (const e of data) {
      if (e.model === "Patrimoine") {
        e.data.possessions = possessionsList;
      }
    }
    writeFile(dataPath, data)
      .then((status) => ({
        status: status.status,
      }))
      .then(({ status }) =>
        status == "OK"
          ? res.status(201).json({
              status: "ok",
              message: "La possession a été créé avec succès",
            })
          : res.json({
              status: "error",
              message:
                "Echec de l'ajout de la nouvelle possession. Veuillez réessayer.",
            })
      );
  } else {
    res.json({
      status: "error",
      message:
        "Echec de l'ajout de la nouvelle possession. Veuillez réessayer.",
    });
  }
});

// mettre à jour une possession par son libelle
routerPossession.put("/:libelle", async (req, res) => {
  let data = await readFile(dataPath);
  const { libelle } = req.params;
  const { newLibelle, dateFin } = req.body;
  if (data.status === "OK") {
    data = data.data;

    const possessionsList = data.find((e) => e.model == "Patrimoine").data
      .possessions;

    const newPossessionsList = possessionsList.map((e) =>
      e.libelle === libelle
        ? {
            ...e,
            libelle: newLibelle,
            dateFin: dateFin,
          }
        : e
    );

    for (const e of data) {
      if (e.model === "Patrimoine") {
        e.data.possessions = newPossessionsList;
      }
    }
    writeFile(dataPath, data);

    res.status(201).json({
      status: "OK",
      message: "La possession a été mis à jour avec succes",
    });
  } else {
    res.json({
      status: "Erreur",
      message: "Echec de la mise à jour de la possession. Veuillez réessayer",
    });
  }
});

// cloturer une possession
routerPossession.put("/:libelle/close", async (req, res) => {
  let data = await readFile(dataPath).then((res) => res);

  const { libelle } = req.params;
  if (data.status === "OK") {
    data = data.data;

    const possessionsList = data.find((e) => e.model == "Patrimoine").data
      .possessions;

    const newPossessionsList = possessionsList.map((e) =>
      e.libelle === libelle
        ? {
            ...e,
            dateFin: new Date().toISOString(),
          }
        : e
    );

    for (const e of data) {
      if (e.model === "Patrimoine") {
        e.data.possessions = newPossessionsList;
      }
    }
    writeFile(dataPath, data);

    res.json({ status: "OK" });
  } else {
    res.json({ status: "Erreur" });
  }
});