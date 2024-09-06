import { Router } from "express";
import { endOfMonth, isSameMonth, addMonths, parseISO } from "date-fns";

import { dataPath } from "./possession.js";
import { readFile, writeFile } from "../../data/index.js";
import { formatDate, formatNumber } from "../format/format.js";
import Flux from "../../models/possessions/Flux.js";
import Personne from "../../models/Personne.js";
import Patrimoine from "../../models/Patrimoine.js";
import Possession from "../../models/possessions/Possession.js";

export const routerPatrimoine = Router();

routerPatrimoine.get("/range", async (req, res) => {
  const { type, dateDebut, dateFin, jour } = req.query;
  const allData = await readFile(dataPath).then((res) => res.data);
  const result = allData.map((item) => {
    const { model, data } = item;
    if (model == "Personne") {
      return new Personne(data.nom);
    } else {
      const { possesseurs, possessions } = data;
      return possessions.map((p) => {
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
      });
    }
  });

  const [possesseur, possessions] = result;

  let currentDate = parseISO(dateDebut);
  const finalDate = parseISO(dateFin);
  const value = [];
  while (currentDate <= finalDate) {
    const endOfCurrentMonth = endOfMonth(currentDate);
    const dayToSet = Math.min(jour, endOfCurrentMonth.getDate());

    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayToSet
    );

    value.push({
      date: formatDate(currentDate),
      value: new Patrimoine(possesseur, possessions).getValeur(currentDate),
    });

    currentDate = addMonths(currentDate, 1);
  }

  res.json(value);
});

routerPatrimoine.get("/:date", async (req, res) => {
  const { date } = req.params;

  const allData = await readFile(dataPath).then((res) => res.data);
  const result = allData.map((item) => {
    const { model, data } = item;
    if (model == "Personne") {
      return new Personne(data.nom);
    } else {
      const { possesseurs, possessions } = data;
      return possessions.map((p) => {
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
      });
    }
  });

  const [possesseur, possessions] = result;

  res.json({
    value: new Patrimoine(possesseur, possessions).getValeur(new Date(date)),
  });
});