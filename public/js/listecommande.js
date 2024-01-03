$(() => {
	//#region
	let tabArticle, numCdeCour, actionConfirm;
	userLogin = +$(".infocompte .zonematr").text();
	//#endregion
	//#region Les fonctions

	const listeCommande = () => {
		tabCommande = postData("/dataParam", { table: "vue_commande" });
		bodyListe = $(".bodylist");
		bodyListe.empty();
		if (tabCommande.length == 0) {
			return;
		}
		let iconesDraft = ["btnprint", "btnsupp"];
		let iconesValide = ["btnprint"];
		listIconValid = "";
		for (const iconeId of iconesValide) {
			let infoAction = TAB_ACTION.find((act) => act.id == iconeId);
			if (infoAction) {
				let image = `<div class="action ${iconeId}" data-action="${infoAction.action}">
							<img src="assets/icones/iconeaction/${infoAction.icone}.png" alt="">
							</div>`;
				listIconValid += image;
			}
		}
		listIconDraft = "";
		let ClassStatut = "";
		for (const iconeId of iconesDraft) {
			let infoAction = TAB_ACTION.find((act) => act.id == iconeId);
			if (infoAction) {
				let image = `<div class="action ${iconeId}" data-action="${infoAction.action}">
							<img src="assets/icones/iconeaction/${infoAction.icone}.png" alt="">
							</div>`;
				listIconDraft += image;
			}
		}

		let sectEntArticle = `
					<section class="headart">
						<div class="colhead">Article</div>
						<div class="colhead">Qté</div>
						<div class="colhead">Prix Unitaire</div>
						<div class="colhead">Total</div>
						<div class="colhead">Statut</div>
						<div class="colhead">Action</div>
					</section>
			`;

		tabCommande.forEach((commande) => {
			let numCommande = ajoutZero(commande.numcde, 4);
			let nomClient = commande.nomclient;
			let dateDevis = new Date(commande.datedevis).toLocaleDateString();
			let NumDevis = `${ajoutZero(commande.numdevis, 4)} du ${dateDevis}`;
			let dateCommande = new Date(commande.datecde).toLocaleDateString();
			let statutCommande = +commande.statutcde;
			let tvaCommande = commande.tvacde;

			let detCommande = commande.detcde.replace(/\n/g, "");
			let tabDetCommande = JSON.parse(detCommande);
			let nbArt = tabDetCommande.length;
			let montantHT = 0;

			for (const ligart of tabDetCommande) {
				montantHT += ligart.puart * ligart.qteart;
			}
			let MontTTC =
				tvaCommande === 0 ? montantHT : Math.round(montantHT * 1.18, 0);
			let libStatutCde = statutCommande === 0 ? "Enregistré" : "Validé";
			let classCde = statutCommande > 0 ? "validecde" : "";
			let listeAction = statutCommande === 0 ? listIconDraft : listIconValid;
			strRowCde = `
				<section class="rowcde" data-code = "${commande.numcde}">
					<div class="datacde">${numCommande}</div>
					<div class="datacde">${dateCommande}</div>
					<div class="datacde">${nomClient}</div>
					<div class="datacde">${NumDevis}</div>
					<div class="datacde">${nbArt}</div>
					<div class="datacde">${montantHT}</div>
					<div class="datacde ${classCde}">${libStatutCde}</div>
					<div class="datacde colaction">${listeAction}</div>
				</section>`;
			let listDetArt = "";
			for (const detail of tabDetCommande) {
				let codeArt = +detail.codeart;
				let infoArt = tabArticle.find((art) => +art.codeart === codeArt);
				let libArt = firstLetter(infoArt.libart);
				let article = `${ajoutZero(codeArt, 3)} - ${libArt}`;
				let totalArt = +detail.qteart * +detail.puart;
				let iconesAction = [];
				let libStatutArt = "";
				let statutArt = +detail.statutart;
				switch (statutArt) {
					case 0:
						iconesAction = ["btnsupp", "btnbat", "btnodp"]; // enregistré
						libStatutArt = "Enregistré";
						ClassStatut = "";
						break;
					case 1:
						iconesAction = ["btncancel", "btnodp"]; // BAT en attente de validation
						libStatutArt = "BAT en attente";
						break;
					case 2:
						iconesAction = ["btnodp"]; // BAT validé
						libStatutArt = "BAT validé";
						ClassStatut = "bat";
						break;
					case -1:
						iconesAction = ["btnfactbat"];
						libStatutArt = "BAT refusé";
						break;
					case 3:
						ClassStatut = "prod";
						libStatutArt = "En production";
						break;
					default:
						ClassStatut = "livre";
						libStatutArt = "Livré";
				}
				let listeIcones = "";
				for (let iconeId of iconesAction) {
					let infoAction = TAB_ACTION.find((act) => act.id == iconeId);
					if (infoAction) {
						if (iconeId == "btnsupp") iconeId = "btnsuppart";
						let image = `<div class="action ${iconeId}" data-action="${infoAction.action}">
							<img src="assets/icones/iconeaction/${infoAction.icone}.png" alt="">
							</div>`;
						listeIcones += image;
					}
				}
				let strArt = ` 
						<section class="rowarticle" data-art ='${codeArt}'>
							<div class="colart">${article}</div>
							<div class="colart">${detail.qteart}</div>
							<div class="colart">${detail.puart}</div>
							<div class="colart">${totalArt}</div>
							<div class="colart ${ClassStatut}">${libStatutArt}</div>
							<div class="colart colaction">${listeIcones}</div>
						</section>`;
				listDetArt += strArt;
			}
			let grCommande = `
				<section class="grcommande">
					${strRowCde}
					<section class="listearticle">
						${sectEntArticle}
						 <section class="detailarticle">
							${listDetArt}
						</section>
					</section>
				</section>`;
			bodyListe.append(grCommande);
		});
	};

	//#endregion

	//#region
	$(".listecommande").on("click", ".rowcde", function (e) {
		e.stopPropagation();
		numCdeCour = $(this).attr("data-code");
		let grCde = $(this).parent();
		var listeArticle = $(this).next(".listearticle");
		$(".grcommande").removeClass("actif");
		$(".listearticle").slideUp();
		listeArticle.slideUp();
		if (listeArticle.is(":visible")) {
			listeArticle.slideUp(300);
			grCde.removeClass("actif");
		} else {
			grCde.addClass("actif");
			listeArticle.slideDown(300);
		}
	});
	$(".bodylist").on("click", ".btnprint", function (e) {
		e.stopPropagation();
		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = +ligCour.attr("data-code");
		let data = {
			fiche: "doccommande",
			table: "vue_commande",
			champcle: "numcde",
			valeur: cleRech,
			maj: false,
		};
		let HTMLPrint = postData("/printCde", data, "html");
		$(".modalprint .zonepreview").empty();
		$(".modalprint .zonepreview").append(HTMLPrint);
		$(".modalprint").fadeIn(400);
	});

	//suppression d'une commande
	$(".bodylist").on("click", ".btnsupp", function (e) {
		e.stopPropagation();
		let ligCour = $(this).parent().parent();
		actionConfirm = "DELCDE";
		numCdeCour = +ligCour.attr("data-code");
		libData = ligCour.find(".coldata").eq(1).text();
		let dataconfirm = `Devis N° ${ajoutZero(numCdeCour, 4)} du ${libData}`;
		$(".confirmation .titre").text("Suppression d'un bon de commande");
		$(".confirmation .message").text(
			"Confirmer la suppresion du bon de commande",
		);
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
	});
	//suppression d'un article
	$(".bodylist").on("click", ".btnsuppart", function (e) {
		let ligCour = $(this).parent().parent();
		actionConfirm = "DELART";
		libData = ligCour.find(".colart").eq(0).text();
		let dataconfirm = libData;
		$(".confirmation .titre").text("Suppression d'article en commande");
		$(".confirmation .message").text("Confirmer la suppresion de l'article");
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
	});

	$(".confirmation .btnappli").on("click", function () {
		if ($(this).hasClass("btnnon")) {
			$(".confirmation .btnclose").trigger("click");
			return;
		}
		switch (actionConfirm) {
			case "DELCDE":
				break;
			case "DELART":
				break;
			case "GENBAT":
				break;
			case "GENODP":
				break;
		}
	});
	$(".confirmation .btnclose").on("click", () => {
		$(".modalconfirmation").fadeOut(300);
	});

	$(".bodylist").on("click", ".btnbat, .btnodp", function () {
		let typeProd = $(this).hasClass("btnbat") ? "BAT" : "PROD";
		if ($(this).hasClass("inactif")) return;
		$(".modalfiche").empty();
		let ligCour = $(this).parent().parent();
		let codeArt = ligCour.attr("data-art");
		let data = {
			numcde: numCdeCour,
			codeart: codeArt,
			typeprod: typeProd,
		};
		let HTMLFiche = postData("/ficheProd", data, "html");
		$(".modalfiche").append(HTMLFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".closeliste").on("click", () => {
		$(".zonelistedata").fadeOut(300, () => {
			$(".zonelistedata").empty();
			$(".menuitem").removeClass("selected");
			$(".module").removeClass("selected");
		});
	});
	$(".closeprint").on("click", () => {
		$(".modalprint").fadeOut(300);
	});
	//#endregion

	//#region
	tabArticle = listeTable("article");
	listeCommande();
	//#endregion
});
