$(() => {
	//#region
	let cleRech,
		dataFiche,
		actionConfirm,
		numDevisCour,
		menuSelected = infoFiche,
		userLogin = +$(".infocompte .zonematr").text();
	let actionListe = [
		"btnconsult",
		"btnsupp",
		"btnedit",
		"btnprint",
		"btncde",
		"btnbat",
		"btndop",
	];
	let tabAction = TAB_ACTION.filter((action) =>
		actionListe.includes(action.id),
	);
	//#endregion
	//#region Les fonctions

	const listeDevis = () => {
		tabDevis = postData("/dataParam", { table: "vue_devis" });
		bodyListe = $(".bodylist");
		bodyListe.empty();
		if (tabDevis.length == 0) {
			return;
		}
		let iconesDaft = ["btncde", "btnprint", "btnsupp", "btnedit", "btnconsult"];
		let iconesValide = ["btnprint", "btnconsult"];
		listIconValid = "";
		for (const iconeId of iconesValide) {
			let infoAction = tabAction.find((act) => act.id == iconeId);
			if (infoAction) {
				let image = `<div class="action ${iconeId}" data-action="${infoAction.action}">
								<img src="assets/icones/iconeaction/${infoAction.icone}.png" alt="">
							</div>`;
				listIconValid += image;
			}
		}
		listIconDaft = "";

		for (const iconeId of iconesDaft) {
			let infoAction = tabAction.find((act) => act.id == iconeId);
			if (infoAction) {
				let image = `<div class="action ${iconeId}" data-action="${infoAction.action}">
								<img src="assets/icones/iconeaction/${infoAction.icone}.png" alt="">
							</div>`;
				listIconDaft += image;
			}
		}
		tabDevis.forEach((devis) => {
			let numDevis = ajoutZero(devis.numdevis, 4);
			let nomClient = devis.nomclient;
			let objetDevis = devis.objetdevis;
			let dateDevis = new Date(devis.datedevis).toLocaleDateString();
			let statutDevis = devis.statutdevis;
			let tvaDevis = devis.tvadevis;
			let detDevis = devis.detdevis.replace(/\n/g, "");
			let tabDetDevis = JSON.parse(detDevis);
			let montantHT = 0;
			for (const ligart of tabDetDevis) {
				montantHT += ligart.puart * ligart.qteart;
			}
			let MontTTC =
				tvaDevis === 0 ? montantHT : Math.round(montantHT * 1.18, 0);
			let v_LibStatut = statutDevis == "0" ? "Enregistré" : "Validé";
			let v_Class = "";
			let listeIcones = listIconDaft;
			if (statutDevis == "1") {
				v_Class = "valide";
				listeIcones = listIconValid;
			}
			let v_Str = `<section class="datarow" data-statut="${statutDevis}" data-code ="${devis.numdevis}">
                            <div class="coldata">${numDevis}</div>
                            <div class="coldata">${dateDevis}</div>
                            <div class="coldata">${nomClient}</div>
                            <div class="coldata">${objetDevis}</div>
                            <div class="coldata">${montantHT}</div>
                            <div class="coldata">${MontTTC}</div>
                            <div class="coldata ${v_Class}">${v_LibStatut}</div>
                            <div class="coldata colaction">${listeIcones}</div>
							
                        </section>
                        `;
			bodyListe.append(v_Str);
		});
	};
	//#endregion

	//#region

	$("#btnnew").on("click", () => {
		MODE_CONSULTATION = false;
		let data = { fiche: "fiche_devis", valeur: "" };
		dataFiche = postData("/fiche", data, "html");
		$(".modalfiche").html(dataFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnedit", function (e) {
		MODE_CONSULTATION = false;
		if ($(this).hasClass("inactif")) return;
		$(".modalfiche").empty();
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: "fiche_devis",
			table: "vue_devis",
			champcle: "numdevis",
			valeur: cleRech,
		};
		let HTMLFiche = postData("/fiche", data, "html");
		$(".modalfiche").append(HTMLFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnconsult", function (e) {
		MODE_CONSULTATION = true;
		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: "fiche_devis",
			table: "vue_devis",
			champcle: "numdevis",
			valeur: cleRech,
			maj: false,
		};
		let HTMLFiche = postData("/fiche", data, "html");
		$(".modalfiche").html(HTMLFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnsupp", function (e) {
		MODE_CONSULTATION = false;
		actionConfirm = "DELDEVIS";
		let ligCour = $(this).parent().parent();
		numDevisCour = +ligCour.attr("data-code");
		libData = ligCour.find(".coldata").eq(1).text();
		let dataconfirm = `Devis N° ${ajoutZero(numDevisCour, 4)} du ${libData}`;
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
	});
	$(".bodylist").on("click", ".btncde", function (e) {
		let ligCour = $(this).parent().parent();
		numDevisCour = +ligCour.attr("data-code");
		libData = ligCour.find(".coldata").eq(1).text();
		let dataconfirm = `Devis N° ${ajoutZero(numDevisCour, 4)} du ${libData}`;
		$(".confirmation .titre").text(
			"Génération de bon de commande à partir du devis",
		);
		$(".confirmation .message").text(
			"Confirmer la génération du bon de commande à partir du",
		);
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
		actionConfirm = "GENBC";
	});
	$(".bodylist").on("click", ".btnprint", function (e) {
		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: "docdevis",
			table: "vue_devis",
			champcle: "numdevis",
			valeur: cleRech,
			maj: false,
		};
		let HTMLPrint = postData("/printDevis", data, "html");
		$(".modalprint .zonepreview").empty();
		$(".modalprint .zonepreview").append(HTMLPrint);
		$(".modalprint").fadeIn(400);
	});
	$(".confirmation .btnappli").on("click", function () {
		let resulOper = 0;
		if ($(this).hasClass("btnnon")) {
			$(".confirmation .btnclose").trigger("click");
			return;
		}
		let infoDevis = tabDevis.find((devis) => +devis.numdevis === numDevisCour);
		infoDevis.statutart = 0;
		let detDevis = JSON.parse(infoDevis.detdevis);
		for (let det of detDevis) {
			det.statutart = 0;
		}
		switch (actionConfirm) {
			case "GENBC":
				let dataRec1, resRec1;
				dataRec1 = {
					action: "GENBC",
					numdevis: numDevisCour,
					userlogin: userLogin,
					codeclient: infoDevis.codeclient,
					objetdevis: infoDevis.objetdevis,
					tvadevis: infoDevis.tvadevis,
					detdevis: JSON.stringify(detDevis),
					userlogin: loginCour,
				};
				resRec1 = postData("/recDevis", dataRec1);
				resulOper = +resRec1.result;
				if (resulOper !== 1) {
					alert(
						"Erreur survenue lors de la genération du BC, Opération non effectuée",
					);
				}
				break;
			case "DELDEVIS":
				let dataRec2 = {
					action: "DELETE",
					numdevis: numDevisCour,
					userlogin: userLogin,
				};
				resRec2 = postData("/recDevis", dataRec2);
				resulOper = +resRec2.result;

				if (resulOper !== 1) {
					alert(
						"Erreur survenue lors de la désactivation du devi, Opération non effectuée",
					);
				}
				break;
		}
		if (resulOper === 1) {
			let menu = $(`.accueil .menuitem[data-code='${menuSelected}']`);
			menu.removeClass("selected");
			menu.trigger("click");
		}
		$(".confirmation .btnclose").trigger("click");
	});
	$(".confirmation .btnclose").on("click", () => {
		$(".modalconfirmation").fadeOut(300);
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
	listeDevis();

	//#endregion
});
