const express = require("express");
const router = express.Router();
const utils = require("../utils/utilitaires");

router.post("/recTypeClient", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_typeclient (libtypeclient) VALUES ('${dataRec.libTypeClient}')`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_typeclient SET libtypeclient = '${dataRec.libTypeClient}' WHERE codetypeclient = ${dataRec.codeTypeClient}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_typeclient SET supp='O' WHERE codetypeclient = ${dataRec.codeTypeClient}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});
router.post("/recDepot", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_depot (libdepot,codeville,depotlie) VALUES ('${dataRec.libDep}',${dataRec.codeVille},${dataRec.listedepot})`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_depot SET libdepot = '${dataRec.libDep}', codeville = '${dataRec.codeVille}',depotlie = '${dataRec.listedepot}' WHERE codedepot = ${dataRec.codeDep}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_typeclient SET supp='O' WHERE codetypeclient = ${dataRec.codeDep}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.get("/getArticles", async (req, res) => {
	try {
		const reqSQL = "SELECT * FROM table_article where codetypeart = 1"; // Adapter la requête selon vos besoins
		const result = await utils.SQLExec(reqSQL, utils.dbAppli);

		// Si la requête est réussie, renvoyer les données au client
		res.send({ data: result });
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des données de la table_article :",
			error,
		);
		res.status(500).send({
			error: "Erreur lors de la récupération des données de la table_article",
		});
	}
});

router.post("/recVille", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_ville (libville) VALUES ('${dataRec.libVille}')`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_ville SET libville = '${dataRec.libVille}' WHERE codeville = ${dataRec.codeVille}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_ville SET supp='O' WHERE codeville = ${dataRec.codeVille}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/recProfil", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_profil (libprofil, listemenu) VALUES ('${dataRec.libProfil}','${dataRec.listeMenu}')`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_profil SET libprofil = '${dataRec.libProfil}', listemenu='${dataRec.listeMenu}' WHERE codeprofil = ${dataRec.codeProfil}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_profil SET supp='O' WHERE codeprofil = ${dataRec.codeProfil}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});
router.post("/recAgent", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	dataRec.dateEmb = dataRec.dateEmb == "" ? null : `'${dataRec.dateEmb}'`;
	dataRec.dateNais = dataRec.dateNais == "" ? null : `'${dataRec.dateNais}'`;
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_agent (matragent, civiliteagent, nomagent, prenomagent, codedepot, telagent, emailagent, datenais, dateemb,fonctionagent, codeprofil, datecre, datemodif) VALUES ('${dataRec.matrAgent}', ${dataRec.civiliteAgent},  '${dataRec.nomAgent}', '${dataRec.prenomAgent}', ${dataRec.depotAgent}, '${dataRec.telAgent}', '${dataRec.emailAgent}',DATE_FORMAT(${dataRec.dateNais},'%Y-%m-%d'),DATE_FORMAT(${dataRec.dateEmb},'%Y-%m-%d'), '${dataRec.fonctionAgent}', ${dataRec.profilAgent}, UTC_TIMESTAMP(),  UTC_TIMESTAMP())`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_agent SET matragent = '${dataRec.matrAgent}',civiliteagent = ${dataRec.civiliteAgent}, nomagent= '${dataRec.nomAgent}', prenomagent='${dataRec.prenomAgent}', codedepot= ${dataRec.depotAgent}, telagent= '${dataRec.telAgent}', emailagent='${dataRec.emailAgent}',datenais = DATE_FORMAT(${dataRec.dateNais},'%Y-%m-%d'),dateemb = DATE_FORMAT(${dataRec.dateEmb},'%Y-%m-%d'), fonctionagent='${dataRec.fonctionAgent}', datemodif = UTC_TIMESTAMP() WHERE loginagent = ${dataRec.loginAgent}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_agent SET supp='O' WHERE loginagent = ${dataRec.loginAgent}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/recClient", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_commercial (codecivilite, nomcom, prenomcom, telcom, emailcom, typecom) VALUES (${dataRec.codeCivilite}, '${dataRec.nomCom}','${dataRec.prenomCom}', '${dataRec.telCom}', '${dataRec.emailCom}', ${dataRec.typeCom})`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_commercial SET codecivilite = ${dataRec.codeCivilite}, nomcom= '${dataRec.nomCom}', prenomcom'${dataRec.prenomCom}', telcom='${dataRec.telCom}', emailcom='${dataRec.emailCom}', typecom= ${dataRec.typeCom} WHERE codecom = ${dataRec.codeCom}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_commercial SET supp='O' WHERE codecom = ${dataRec.codeCom}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/recArticle", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	console.log(dataRec);
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_article (libart, puart) VALUES ('${dataRec.libArt}',${dataRec.puArt})`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE table_article SET libart = '${dataRec.libArt}',puart=${dataRec.puArt} WHERE codeart= ${dataRec.codeArt}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_article SET supp='O' WHERE codeart= ${dataRec.codeArt}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

module.exports = router;
