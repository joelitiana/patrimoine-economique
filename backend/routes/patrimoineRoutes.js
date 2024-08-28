const express = require("express");
const {
  getValeurPatrimoine,
  getValeurPatrimoineRange,
} = require("../controllers/patrimoineController");

const router = express.Router();

router.get("/:date", function(req, res) {
  getValeurPatrimoine(req, res);
});

router.post("/range", function(req, res) {
  getValeurPatrimoineRange(req, res);
});

module.exports = router;
