const PORT = 3006;

const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const utils = require("./utils/utilitaires");

app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "IHM"));
app.set("view engine", "ejs");

// Importez les fichiers de routage
const paramRoutes = require("./routes/paramRoutes");
const majTableRoutes = require("./routes/majTableRoutes");
const operationRoutes = require("./routes/operationRoutes");
const listeTableRoutes = require("./routes/listeTableRoutes");
const printRoutes = require("./routes/printRoutes");

app.use("/", paramRoutes);
app.use("/", majTableRoutes);
app.use("/", operationRoutes);
app.use("/", listeTableRoutes);
app.use("/", printRoutes);

//Variable globales
let userLogin, infoPage, userProfil, tabMenuUser;

// routes GET

// app.get("/", async (req, res) => {
// 	let contenuJSON = await utils.lireFichier("./themeappli.json");
// 	let dataJSON = JSON.parse(contenuJSON);
// 	res.render("pagetest", { dataJSON });
// });
app.get("/", async (req, res) => {
	userLogin = undefined;
	res.render("index", { page: "connexion", info: infoPage });
});

app.get("/accueil", async (req, res) => {
	if (!userLogin) {
		res.redirect("/");
		return;
	}
	let reqSQL =
		userProfil == "ADMIN000"
			? "SELECT * FROM v_menumodule"
			: "SELECT * FROM v_menumodule";
	let contenuJSON = await utils.lireFichier("./themeappli.json");
	let dataTheme = JSON.parse(contenuJSON);
	tabMenuUser = await utils.SQLExec(reqSQL);
	res.render("accueil", {
		infoMenu: tabMenuUser,
		infoUser: infoPage,
		logoAppli,
		dataTheme,
	});
});
app.get("/fichiers", async (req, res) => {
	let iconeActions = await utils.fichierDossier(
		"public/assets/icones/iconeaction",
	);
	let listeIcones = await utils.fichierDossier(
		"public/assets/icones//iconemenu",
	);
	let listeImages = await utils.fichierDossier("public/assets/images");
	let listeFiches = await utils.fichierDossier("IHM/fiches");

	res.send({
		images: listeImages,
		icones: listeIcones,
		fiches: listeFiches,
		iconeactions: iconeActions,
	});
});
app.get("/dataDB", async (req, res) => {
	if (utils.dbAppli.database !== "") {
		let reqModule = `SELECT * FROM t_module WHERE supp='N'`;
		let listeModule = await utils.SQLExec(reqModule);

		let reqTable = `SELECT TABLE_NAME AS matable FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${utils.dbAppli.database}' AND TABLE_TYPE='BASE TABLE';`;
		let listeTables = await utils.SQLExec(reqTable);
		let reqVue = `SELECT TABLE_NAME AS mavue FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA = '${utils.dbAppli.database}';`;
		let listeVues = await utils.SQLExec(reqVue);
		res.send({
			modules: listeModule,
			tables: listeTables,
			vues: listeVues,
		});
	}
});
app.post("/refresh", async (req, res) => {
	let reqSQL = "SELECT *  FROM v_menumodule";
	tabMenuUser = await utils.SQLExec(reqSQL);
	res.send(tabMenuUser);
});

// routes POST
app.post("/connexion", async (req, res) => {
	userLogin = req.body.userlogin;
	let userPassword = req.body.userpassword;
	if (isNaN(+userLogin)) {
		let contenuJSON = await utils.lireFichier("./adminusers.json");
		let dataJSON = JSON.parse(contenuJSON);
		let infoAdmin = dataJSON.find(
			(admin) =>
				admin.userlogin === userLogin && admin.userpassword === userPassword,
		);
		if (!infoAdmin) {
			// administrateur non trouvé
			res.send({ res: 404 });
			return;
		}
		userProfil = "ADMIN000";
		infoPage = {
			page: "",
			login: infoAdmin.initial,
			nomAgent: infoAdmin.userlastname,
			prenomAgent: infoAdmin.userfirstname,
			fonctionAgent: infoAdmin.fonction,
			serviceAgent: infoAdmin.service,
			agenceAgent: "",
			profilAgent: infoAdmin.userprofil,
			emailAgent: infoAdmin.useremail,
		};
		// lecture du fichier config
		configFile = await utils.lireFichier("./configappli.json");
		let infoAppli = JSON.parse(configFile);
		if (configFile == "404") {
			// fichier config non trouvé
			res.send({ res: 300 });
		} else {
			utils.dbAppli.database = infoAppli.bddappli;
			logoAppli = infoAppli.iconeappli;
			res.send({ res: 200 });
		}
	} else {
		// cas des agents
		res.send({ res: 202, userlogin: userLogin });
	}
});

app.post("/execMenu", async (req, res) => {
	if (userLogin === undefined) {
		res.redirect("/");
		return;
	}
	let menuReq = +req.body.codemenu;
	menuSelected = menuReq;
	loginCour = userLogin;

	// on crée les données à ramener
	let infoMenu = tabMenuUser.find((menu) => +menu.codemenu == menuReq);
	let typeMenu = +infoMenu.typemenu;
	if (typeMenu === 1) {
		let ficheMenu = `fiches/${infoMenu.fichemenu}`;
		res.render(ficheMenu, { menuSelected: infoMenu.codemenu });
		return;
	}
	let tabCol = undefined;
	if (infoMenu.infocol === undefined || infoMenu.infocol === "") {
		let ficheErr = `fiches/ficheerr`;
		res.render(ficheErr);
		return;
	}
	tabCol = JSON.parse(infoMenu.infocol);
	let dataMenu = {
		codemenu: infoMenu.codemenu,
		libmenu: infoMenu.libmenu,
		codemodule: infoMenu.codemodule,
		textenew: infoMenu.textenew,
		titrepage: infoMenu.titrepage,
		pagewidth: infoMenu.largeurpage,
		pageheight: infoMenu.hauteurpage,
		iconemenu: infoMenu.iconemenu,
		fichemenu: infoMenu.fichemenu,
		tabcol: tabCol,
		tablemenu: infoMenu.tablemenu,
		vueliste: infoMenu.vueliste,
		listeaction: infoMenu.listeaction,
		typemenu: infoMenu.typemenu,
		champcle: infoMenu.champcle,
	};
	if (tabCol) {
		let tabChamps = [];
		for (const col of tabCol) {
			tabChamps.push(col.champ);
		}
		let listeChamps = tabChamps.join(",");
		let table_menu = infoMenu.vueliste;

		let reqSQL = `SELECT ${listeChamps} FROM ${table_menu} `;
		dataListe = await utils.SQLExec(reqSQL);
	}
	if (infoMenu) res.render("listedata", { dataMenu, dataListe });
});
app.post("/fiche", async (req, res) => {
	let fiche = "fiches/" + req.body.fiche;
	let dataFiche = req.body;
	let tableLie = dataFiche.table;
	let champCle = dataFiche.champcle;
	let valRech = dataFiche.valeur;
	let infoFiche = [];
	if (valRech !== "") {
		let reqSQL = `SELECT * FROM ${tableLie} WHERE ${champCle} = ${valRech}`;
		let resReq = await utils.SQLExec(reqSQL);
		if (resReq.length > 0) {
			infoFiche = resReq;
		}
	}
	res.render(fiche, { infoFiche });
});
app.post("/listecol", async (req, rep) => {
	let tableCour = req.body.table;
	let reqSQL = `SHOW COLUMNS FROM  ${tableCour}`;
	let resListe = await utils.SQLExec(reqSQL);
	rep.send(resListe);
});

app.post("/selectListe", async (req, rep) => {
	let dataSel = req.body;
	let code = dataSel.champs.split(",")[0];
	let libelle = dataSel.champs.split(",")[1];
	let reqSQL = `SELECT ${code} AS code, ${libelle} AS lib FROM table_${dataSel.table}`;
	let listeSel = await utils.SQLExec(reqSQL);
	rep.render("selectliste", { listeSel });
});
/************ */
app.listen(PORT, console.log("serveur prêt sur le port " + PORT));
