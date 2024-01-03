const express = require("express");
const router = express.Router();
const utils = require("../utils/utilitaires");
// Route pour la page "À propos"
router.post("/recFacture", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	let detFacture = JSON.stringify(dataRec.detfacture);
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_facture (codeclient, datefacture,objetfacture, tvafacture, detfacture, datecre, logincre) VALUES (${dataRec.codeclient}, DATE_FORMAT('${dataRec.datefacture}','%Y-%m-%d'), '${dataRec.objetfacture}',${dataRec.tvafacture},'${detFacture}',UTC_TIMESTAMP(),${dataRec.userlogin})`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/recFinance", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let action = dataRec.action;
	let reqSQL = "";
	let detFacture = JSON.stringify(dataRec.detfacture);
	switch (action) {
		case "CREATE":
			reqSQL = `INSERT INTO table_financeclient (codeclient, dateop,libop, typeop, montant, datecre, logincre) VALUES (${dataRec.codeClient}, DATE_FORMAT('${dataRec.dateOper}','%Y-%m-%d'), '${dataRec.libOper}',${dataRec.typeOper},${dataRec.montantOper},UTC_TIMESTAMP(),${dataRec.userlogin})`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

router.post("/recMvtStock", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = [];
	let detMvt = JSON.stringify(dataRec.detmvt);
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_stock (codedepot, typemvt,datemvt,objetmvt,detmvt, datecre, logincre) VALUES (${dataRec.codedepot},'${dataRec.typemvt}',  DATE_FORMAT('${dataRec.datemvt}','%Y-%m-%d'), '${dataRec.objetmvt}','${detMvt}',UTC_TIMESTAMP(),${dataRec.userlogin})`;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});
const UniqueEl = (p_Tableau, p_cle) => {
	return [
		...new Map(p_Tableau.map((obj) => [`${obj[p_cle]}`, obj[p_cle]])).values(),
	];
};
const calculStokSortieFac = async () => {
	let reqSQL = "SELECT * FROM table_facture";

	// let tabStock = postData("/listeTable", { table: "table_stock" });
	let tabFacture = await utils.SQLExec(reqSQL);
	// Sortie pour facture
	let tabQteArt = [];
	for (const fact of tabFacture) {
		let detFacture = JSON.parse(fact.detfacture);
		let tabArtFacture = UniqueEl(detFacture, "codeart");
		for (const artfact of tabArtFacture) {
			let qteArt = 0;
			let listeArtFact = detFacture.filter((art) => +art.codeart === +artfact);
			for (const detart of listeArtFact) {
				qteArt += +detart.qteart;
			}
			tabQteArt.push({ codeart: artfact, qteart: qteArt });
		}
	}
	let tabUnique = UniqueEl(tabQteArt, "codeart");
	let tabFinal = [];
	for (const art of tabUnique) {
		let tabTmp = tabQteArt.filter((tmp) => +tmp.codeart === +art);
		let qteCum = 0;
		for (let tmp of tabTmp) {
			qteCum += +tmp.qteart;
		}
		tabFinal.push({ codeart: art, qteart: qteCum });
	}

	return tabFinal;
};
const calculStokEntree = async () => {
	let reqSQL = "SELECT * FROM table_stock where typemvt='E'";

	// let tabStock = postData("/listeTable", { table: "table_stock" });
	let tabStock = await utils.SQLExec(reqSQL);
	// Sortie pour stock
	let tabQteArt = [];
	for (const fact of tabStock) {
		let detStock = fact.detmvt;
		let tabArtStock = UniqueEl(detStock, "codeart");
		for (const artfact of tabArtStock) {
			let qteArt = 0;
			let listeArtFact = detStock.filter((art) => +art.codeart === +artfact);
			for (const detart of listeArtFact) {
				qteArt += +detart.qteart;
			}
			tabQteArt.push({ codeart: artfact, qteart: qteArt });
		}
	}
	let tabUnique = UniqueEl(tabQteArt, "codeart");
	let tabFinal = [];
	for (const art of tabUnique) {
		let tabTmp = tabQteArt.filter((tmp) => +tmp.codeart === +art);
		let qteCum = 0;
		for (let tmp of tabTmp) {
			qteCum += +tmp.qteart;
		}
		tabFinal.push({ codeart: art, qteart: qteCum });
	}
	return tabFinal;
};
const calculStokSortie = async () => {
	let reqSQL = "SELECT * FROM table_stock where typemvt='S'";

	// let tabStock = postData("/listeTable", { table: "table_stock" });
	let tabStock = await utils.SQLExec(reqSQL);
	// Sortie pour stock
	let tabQteArt = [];
	for (const fact of tabStock) {
		let detStock = fact.detmvt;
		let tabArtStock = UniqueEl(detStock, "codeart");
		for (const artfact of tabArtStock) {
			let qteArt = 0;
			let listeArtFact = detStock.filter((art) => +art.codeart === +artfact);
			for (const detart of listeArtFact) {
				qteArt += +detart.qteart;
			}
			tabQteArt.push({ codeart: artfact, qteart: qteArt });
		}
	}
	let tabUnique = UniqueEl(tabQteArt, "codeart");
	let tabFinal = [];
	for (const art of tabUnique) {
		let tabTmp = tabQteArt.filter((tmp) => +tmp.codeart === +art);
		let qteCum = 0;
		for (let tmp of tabTmp) {
			qteCum += +tmp.qteart;
		}
		tabFinal.push({ codeart: art, qteart: qteCum });
	}

	return tabFinal;
};
const calculDifferenceEntreeSortie = async () => {
	try {
		// Calcul des entrées
		const entrees = await calculStokEntree();

		// Calcul des sorties pour le stock
		const sortiesStock = await calculStokSortie();

		// Calcul des sorties pour la facture
		const sortiesFacture = await calculStokSortieFac();
		// Combinez les sorties de stock et de facture dans un seul tableau
		const sortiesCombinees = [...sortiesStock, ...sortiesFacture];

		// Utilisez une Map pour regrouper les quantités par code d'article
		const quantitesParCodeart = new Map();

		for (const sortie of sortiesCombinees) {
			const codeart = sortie.codeart;
			const qteart = sortie.qteart;

			if (quantitesParCodeart.has(codeart)) {
				// Si le code d'article existe déjà dans la Map, ajoutez la quantité
				quantitesParCodeart.set(
					codeart,
					quantitesParCodeart.get(codeart) + qteart,
				);
			} else {
				// Si le code d'article n'existe pas dans la Map, ajoutez-le avec la quantité
				quantitesParCodeart.set(codeart, qteart);
			}
		}

		// Calcul de la différence entre les entrées et les sorties combinées
		const differences = entrees.map((entree) => {
			const codeart = entree.codeart;
			const qteEntree = entree.qteart;
			const qteSortieCombinee = quantitesParCodeart.get(codeart) || 0;

			const difference = qteEntree - qteSortieCombinee;

			return { codeart, difference };
		});
		return differences;
	} catch (error) {
		console.error("Une erreur est survenue :", error.message);
	}
};

// calculStokEntree()
// calculStokSortieFac()
// calculResteTotal();

// calculDifferenceEntreeSortie();
// Appeler la fonction

router.post("/recInventaire", async (req, res) => {
	let dataRec = req.body;
	dataRec = utils.AposObjet(dataRec);
	let typeOper = dataRec.action;
	let reqSQL = "";
	let detInventaire = JSON.stringify(dataRec.detinventaire);
	switch (typeOper) {
		case "CREATE":
			reqSQL = `INSERT INTO table_inventaire (detailinventaire, statutinventaire, logincre) VALUES ('${detInventaire}',${dataRec.statutinventaire},${dataRec.userlogin})`;
			break;

		case "UPDATE":
			reqSQL = `UPDATE table_inventaire SET detailinventaire = '${detInventaire}' WHERE numinventaire = ${dataRec.numinventaire}`;
			break;

		case "VALIDATION":
			let stocktheoinv = await calculDifferenceEntreeSortie();
			let stockTheoInv = JSON.stringify(stocktheoinv);
			reqSQL = `UPDATE table_inventaire SET statutinventaire = 1,stocktheoinv='${stockTheoInv}' WHERE numinventaire = ${dataRec.numinventaire}`;
			break;
		case "CLOTURE":
			reqSQL = `UPDATE table_inventaire SET statutinventaire = 2 WHERE numinventaire = ${dataRec.numinventaire}`;
			break;
		case "DELETE":
			reqSQL = `UPDATE table_inventaire SET supp='O' WHERE numinventaire = ${dataRec.numinventaire} `;
			break;
	}
	let resSQL = await utils.SQLExec(reqSQL, utils.dbAppli);
	let ligneAff = +resSQL.affectedRows;
	res.send({ result: ligneAff });
});

module.exports = router;
