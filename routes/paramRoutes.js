const express = require("express");
const router = express.Router();
const utils = require("../utils/utilitaires");
const fs = require("fs");

// Route pour la page "À propos"
router.post("/recModule", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			let req1 = "SELECT COUNT(*) FROM t_module";
			let resReq1 = await utils.SQLExec(req1, utils.dbAppli);
			let newOrder = resReq1.length + 1;
			reqSQL = `INSERT INTO t_module (libmodule, iconemodule, ordremodule) VALUES ('${dataRec.libModule}', '${dataRec.iconeModule}', ${newOrder})`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE t_module SET libmodule = '${dataRec.libModule}',iconemodule = '${dataRec.iconeModule}'	WHERE codemodule = ${dataRec.codeModule}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE t_module SET actif='N' WHERE codemenu = codemodule = ${dataRec.codeModule}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/recMenu", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO t_menu (libmenu, codemodule, titrepage, textenew, vueliste, tablemenu, champcle, largeurpage, hauteurpage,infocol, listeaction, iconemenu, fichemenu, typemenu) VALUES ('${dataRec.libMenu}', ${dataRec.codeModule}, '${dataRec.titrePage}', '${dataRec.texteNew}', '${dataRec.vueListe}','${dataRec.tableMenu}', '${dataRec.champCle}', '${dataRec.largeurPage}',  '${dataRec.hauteurPage}', '${dataRec.infoCol}', '${dataRec.listeAction}', '${dataRec.iconeMenu}', '${dataRec.ficheMenu}', ${dataRec.typeMenu})`;
			break;
		case "UPDATE":
			reqSQL = `UPDATE t_menu SET codemodule = ${dataRec.codeModule},libmenu = '${dataRec.libMenu}',titrepage=  '${dataRec.titrePage}',textenew ='${dataRec.texteNew}',vueliste= '${dataRec.vueListe}',tablemenu= '${dataRec.tableMenu}',champcle ='${dataRec.champCle}',largeurpage ='${dataRec.largeurPage}',hauteurpage ='${dataRec.hauteurPage}',infocol ='${dataRec.infoCol}',listeaction= '${dataRec.listeAction}',iconemenu ='${dataRec.iconeMenu}',fichemenu ='${dataRec.ficheMenu}',typemenu =${dataRec.typeMenu}	WHERE codemenu = ${dataRec.codeMenu}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE t_menu SET actif='N' WHERE codemenu = ${dataRec.codeMenu}`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/moduleOrdre", async (req, res) => {
	let tabOrdreModule = req.body.tabOrdre;
	for (const module of tabOrdreModule) {
		let reqSQL = `UPDATE t_module SET ordremodule = ${module.ordreModule} WHERE codemodule=${module.codeModule}`;
		let ResSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	}
	let reqSQL = "SELECT *  FROM v_menumodule";
	tabMenuUser = await utils.SQLExec(reqSQL, utils.dbAppli);
	res.send(tabMenuUser);
});

router.post("/allViews", async (req, res) => {
	let reqTable = `SELECT TABLE_NAME AS nomtable FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${utils.dbAppli.database}' AND TABLE_TYPE='BASE TABLE';`;
	let listeTmp = await utils.SQLExec(reqTable, utils.dbAppli);
	let listeTable = listeTmp.filter((nom) => nom.nomtable.includes("table_"));
	let tabResult = [];
	for (const table of listeTable) {
		let nomTable = table.nomtable;
		let nomVue = nomTable;
		if (nomTable.includes("_")) {
			nomVue = nomTable.split("_")[1];
		}
		let reqSQL = `CREATE OR REPLACE VIEW vue_${nomVue} AS SELECT * FROM ${nomTable}`;
		try {
			let retour = await utils.SQLExec(reqSQL, utils.dbAppli);
			tabResult.push(JSON.stringify(retour));
		} catch {
			tabResult.push("Erreur " + reqSQL);
		}
	}
	res.send({ res: tabResult });
});

router.post("/dataAppli", async (req, res) => {
	let bddAppli = req.body.bddappli;
	if (bddAppli) {
		//test de l'existence de la base de données
		let reqSQL = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${bddAppli}'`;
		let listeDB = await utils.SQLExec(reqSQL, utils.dbSystem);
		if (listeDB.length > 0) {
			utils.dbAppli.database = bddAppli;
			let reqTable = `SELECT TABLE_NAME AS matable FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${bddAppli}' AND TABLE_TYPE='BASE TABLE' AND TABLE_NAME IN ('t_menu','t_module');`;
			let listeTables = await utils.SQLExec(reqTable, utils.dbAppli);
			let reqVue = `SELECT TABLE_NAME AS mavue FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA = '${bddAppli}' AND TABLE_NAME IN ('v_module','v_menumodule');`;
			let listeVues = await utils.SQLExec(reqVue, utils.dbAppli);
			let dataDB = {
				tablemenu: listeTables[0].matable,
				tablemodule: listeTables[1].matable,
				vuemenu: listeVues[0].mavue,
				vuemodule: listeVues[1].mavue,
			};
			res.send(dataDB);
		} else {
			res.send({ res: 405 }); // base de données non trouvée
		}
	}
});
router.post("/menuProfil", async (req, res) => {
	let reqSQL = `SELECT codemenu, libmenu FROM t_menu WHERE menuadmin='0'`;
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	res.send(resSQL);
});
router.post("/dataParam", async (req, res) => {
	let table = req.body.table;
	let reqSQL = `SELECT * FROM ${table}`;
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	res.send(resSQL);
});

module.exports = router;
