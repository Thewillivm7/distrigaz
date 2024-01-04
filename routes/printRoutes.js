const express = require("express");
const router = express.Router();
const utils = require("../utils/utilitaires");

router.post("/printDevis", async (req, res) => {
	let fiche = "Modeles/" + req.body.fiche;
	let dataFiche = req.body;
	let tableLie = dataFiche.table;
	let champCle = dataFiche.champcle;
	let valRech = dataFiche.valeur;
	let infoFiche = [dataFiche];
	let reqSQL = `SELECT * FROM ${tableLie} WHERE ${champCle} = ${valRech}`;
	let resReq = await utils.SQLExec(reqSQL);
	if (resReq.length > 0) infoFiche = resReq;
	res.render(fiche, { infoFiche });
});
router.post("/printDevis", async (req, res) => {
	let fiche = "Modeles/" + req.body.fiche;
	let dataFiche = req.body;
	let tableLie = dataFiche.table;
	let champCle = dataFiche.champcle;
	let valRech = dataFiche.valeur;
	let infoFiche = [dataFiche];
	let reqSQL = `SELECT * FROM ${tableLie} WHERE ${champCle} = ${valRech}`;
	let resReq = await utils.SQLExec(reqSQL);
	if (resReq.length > 0) infoFiche = resReq;
	res.render(fiche, { infoFiche });
});
router.post("/printFac", async (req, res) => {
	console.log(req.body.fiche);
	let fiche = "Modeles/" + req.body.fiche;
	let dataFiche = req.body;
	let tableLie = dataFiche.table;
	let champCle = dataFiche.champcle;
	let valRech = dataFiche.valeur;
	let infoFiche = [dataFiche];
	let reqSQL = `SELECT * FROM ${tableLie} WHERE ${champCle} = ${valRech}`;
	let resReq = await utils.SQLExec(reqSQL);
	if (resReq.length > 0) infoFiche = resReq;
	console.log(infoFiche);
	res.render(fiche, { infoFiche });
});
module.exports = router;
