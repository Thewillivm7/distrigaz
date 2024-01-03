const express = require("express");
const router = express.Router();
const utils = require("../utils/utilitaires");

router.post("/listeTable", async (req, res) => {
	let table = req.body.table;
	let reqSQL = `SELECT * FROM ${table}`;
	let tabData = await utils.SQLExec(reqSQL);
	res.send(tabData);
});

router.post("/listeSelect", async (req, res) => {
	let param = req.body.param;
	let table = param.table;
	let champCle = param.champcle;
	let listeChamp = param.listeChamp;
	let tabChamp = listeChamp.split(",");
	let champSQL = `CONCAT(${tabChamp.join(",'',")})`;
	let reqSQL = `SELECT ${champCle}, ${champSQL} AS lib FROM vue_${table}`;
	let tabData = await utils.SQLExec(reqSQL);
	res.send(tabData);
});

module.exports = router;
