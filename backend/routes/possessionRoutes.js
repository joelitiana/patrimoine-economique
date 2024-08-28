const express = require("express");
const {
  getPossessions,
  createPossession,
  updatePossession,
  closePossession,
} = require("../controllers/possessionController");

const router = express.Router();

router.get("/", function(req, res) {
  getPossessions(req, res);
});

router.post("/", function(req, res) {
  createPossession(req, res);
});

router.put("/:libelle", function(req, res) {
  updatePossession(req, res);
});

router.put("/:libelle/close", function(req, res) {
  closePossession(req, res);
});

module.exports = router;
