$(() => {
	//#region
	let cleRech,
		dataFiche,
		actionConfirm,
		numInventaireCour,
		menuSelected = infoFiche,
		userLogin = +$(".infocompte .zonematr").text();
	let actionListe = [
		"btnconsult",
		"btnsupp",
		"btnedit",
		"btnprint",
		"btnvalider",
		"btncloturer",
	];
	let tabAction = TAB_ACTION.filter((action) =>
		actionListe.includes(action.id),
	);
	//#endregion
	//#region Les fonctions

	const listeInventaire = () => {
		tabInventaire = postData("/dataParam", { table: "vue_inventaire" });
		bodyListe = $(".bodylist");
		bodyListe.empty();
		if (tabInventaire.length == 0) {
			return;
		}
		tabInventaire.forEach((inventaire) => {
			let numInventaire = ajoutZero(inventaire.numinventaire, 4);
			let libInventaire = inventaire.libinventaire;
			let statutInventaire = inventaire.statutinventaire;
			let libStatut = "";
			let actionListe = "";
			let color = "";
			switch (+statutInventaire) {
				case 0:
					libStatut = "Brouillon";
					actionListe = [
						"btnvalider",
						"btnprint",
						"btnedit",
						"btnconsult",
						"btnsupp",
					];
					break;
				case 1:
					libStatut = "Validé";
					actionListe = ["btncloturer", "btnedit", "btnconsult", "btnprint"];
					color = "orange";
					break;
				case 2:
					actionListe = ["btnconsult", "btnprint"];
					libStatut = "Clôturé";
					color = "red";
					break;
			}
			let listeIcones = "";
			for (const iconeID of actionListe) {
				let infoAction = TAB_ACTION.find((act) => act.id == iconeID);
				if (infoAction) {
					let strImg = `<div class="action ${iconeID}" data-action="${infoAction.action}">
							<img src="assets/icones/iconeaction/${infoAction.icone}.png" alt="">
							</div>`;
					listeIcones += strImg;
				}
			}
			let strInv = ` <section class="datarow" data-code = ${+numInventaire}>
								<div class="coldata">${numInventaire}</div>
								<div class="coldata">${libInventaire}</div>
								<div class="coldata" style="color:${color}">${libStatut}</div>
								<div class="coldata colaction">${listeIcones}</div>
							</section>
						`;
			bodyListe.append(strInv);
		});
	};
	//#endregion

	//#region

	$("#btnnew").on("click", () => {
		MODE_CONSULTATION = false;
		let data = { fiche: "fiche_inventaire", valeur: "" };
		dataFiche = postData("/fiche", data, "html");
		$(".modalfiche").html(dataFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnedit", function (e) {
		          
		if ($(this).hasClass("inactif")) return;
		$(".modalfiche").empty();
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: "fiche_inventaire",
			table: "vue_inventaire",
			champcle: "numinventaire",
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
			fiche: "fiche_inventaire",
			table: "vue_inventaire",
			champcle: "numinventaire",
			valeur: cleRech,
			maj: false,
		};
		let HTMLFiche = postData("/fiche", data, "html");
		$(".modalfiche").html(HTMLFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnsupp", function (e) {
		let ligCour = $(this).parent().parent();
		numInventaireCour = +ligCour.attr("data-code");
		libData = ligCour.find(".coldata").eq(1).text();
		let dataconfirm = ` N° ${ajoutZero(numInventaireCour, 4)} ${libData}`;
		$(".confirmation .titre").text("Validation de l'inventaire");
		$(".confirmation .message").text("Confirmer la validation de");
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
		actionConfirm = "DELINV";
	});
	$(".bodylist").on("click", ".btnvalider", function (e) {
		let ligCour = $(this).parent().parent();
		numInventaireCour = +ligCour.attr("data-code");
		libData = ligCour.find(".coldata").eq(1).text();
		let dataconfirm = ` N° ${ajoutZero(numInventaireCour, 4)} ${libData}`;
		$(".confirmation .titre").text("Validation de l'inventaire");
		$(".confirmation .message").text("Confirmer la validation de");
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
		actionConfirm = "VALIDATION";
	});
	$(".bodylist").on("click", ".btncloturer", function (e) {
		let ligCour = $(this).parent().parent();
		numInventaireCour = +ligCour.attr("data-code");
		libData = ligCour.find(".coldata").eq(1).text();
		let dataconfirm = ` N° ${ajoutZero(numInventaireCour, 4)} ${libData}`;
		$(".confirmation .titre").text("Clôture de l'inventaire");
		$(".confirmation .message").text("Confirmer la clôture de");
		$(".confirmation .dataconfirm").text(dataconfirm);
		$(".modalconfirmation").fadeIn(300);
		actionConfirm = "CLOTURE";
	});

	$(".bodylist").on("click", ".btnprint", function (e) {
		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: "docinventaire",
			table: "vue_inventaire",
			champcle: "numinventaire",
			valeur: cleRech,
			maj: false,
		};
		let HTMLPrint = postData("/printInventaire", data, "html");
		$(".modalprint .zonepreview").empty();
		$(".modalprint .zonepreview").append(HTMLPrint);
		$(".modalprint").fadeIn(400);
	});

	$(".confirmation .btnappli").on("click", function () {
		if ($(this).hasClass("btnoui")) {
			let resAction = postData("/recInventaire", {
				numinventaire: numInventaireCour,
				action: actionConfirm,
			});
			if (resAction.result > 0) {
				refreshListe(+resAction.result);
			}
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
	listeInventaire();

	//#endregion
});
