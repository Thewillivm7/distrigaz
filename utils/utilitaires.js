const mysql = require("mysql2");
var transaction = require("node-mysql-transaction");

const fs = require("fs");
const dbSystem = {
	host: "localhost",
	user: "root",
	password: "root",
	database: "sys",
};

const dbAppli = {
	host: "localhost",
	user: "root",
	password: "root",
	database: "distrigaz",
};
var trConnection = transaction({
	connection: [mysql.createConnection, dbAppli],
	dynamicConnection: 32,
	timeout: 600,
});
const SQLExec = (p_query, p_BDD = dbAppli) => {
	const myConn = mysql.createConnection(p_BDD);

	return new Promise((resolve, reject) => {
		myConn.connect((err) => {
			if (err) {
				reject(err);
				return err;
			}
			myConn.query(p_query, (err, results) => {
				if (err) {
					reject(err);
					return err;
				}
				myConn.end((err) => {
					if (err) {
						reject(err);
						return err;
					}
					resolve(results);
				});
			});
		});
	});
};

arrQueries = [
	"update table1 set field1='val1',field2='val2' where id=5;",
	"update table1 set field3='val3',field4='val4' where id=10;",
];
const transactSQL = async (queries) => {
	return new Promise(async (resolve, reject) => {
		var chain = trConnection.chain();

		chain
			.on("commit", function () {
				resolve("1");
			})
			.on("rollback", function (err) {
				reject("0");
			});

		for (var i = 0; i < queries.length; i += 1) {
			try {
				await chain.query(queries[i]);
			} catch (error) {
				reject("0"); // En cas d'erreur lors de l'exécution de la requête
			}
		}
	});
};

const transactExec = async (p_tabReq) => {
	return new Promise((resolve, reject) => {
		transactSQL(p_tabReq)
			.then((result) => {
				resolve(result);
			})
			.catch((error) => {
				resolve("0");
			});
	});
};

function AposObjet(objet) {
	var nouvelObjet = {};

	for (var propriete in objet) {
		if (objet.hasOwnProperty(propriete)) {
			var valeur = objet[propriete];

			// Vérifiez si la valeur de la propriété contient des apostrophes
			if (typeof valeur === "string" && valeur.indexOf("'") !== -1) {
				// Échappez les apostrophes dans la valeur de la propriété
				valeur = valeur.replace(/'/g, "\\'");
			}

			// Utilisez la valeur échappée pour définir la propriété dans le nouvel objet
			nouvelObjet[propriete] = valeur;
		}
	}

	return nouvelObjet;
}

function fichierDossier(cheminDossier) {
	return new Promise((resolve, reject) => {
		fs.readdir(cheminDossier, (erreur, fichiers) => {
			if (erreur) {
				reject(erreur); // En cas d'erreur, rejetez la promesse avec l'erreur
			} else {
				resolve(fichiers); // En cas de succès, résolvez la promesse avec la liste des fichiers
			}
		});
	});
}

function lireFichier(p_fichier) {
	return new Promise((resolve, reject) =>
		fs.access(p_fichier, fs.constants.F_OK, (err) => {
			if (err) {
				// Le fichier n'existe pas
				resolve(404);
			} else {
				// Le fichier existe, lisez son contenu
				fs.readFile(p_fichier, "utf8", (err, data) => {
					if (err) {
						resolve(500);
					} else {
						resolve(data);
					}
				});
			}
		}),
	);
}

const lectureFicBDD = async (p_fichier) => {
	return new Promise((resolve, reject) =>
		fetch(p_fichier)
			.then((response) => response.json())
			.then((data) => {
				resolve(data);
				// Votre code de recherche de données ici
			})
			.catch((error) => console.error("Erreur :", error)),
	);
};

const extensionsImages = [".jpg", ".jpeg", ".png", ".gif"];

module.exports = {
	SQLExec,
	dbAppli,
	fichierDossier,
	AposObjet,
	lireFichier,
	lectureFicBDD,
	transactExec,
};
