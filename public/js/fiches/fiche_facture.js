$(() => {
	//#region Le svariables
	let actionDB = "",
		dataFiche,
		factureCour,
		numFacture,
		compteurArt = 0,
		tabArtSel = [],
		codeClient,
		montantHT,
		montantTTC,
		montantTVA,
		dateFacture,
		AppliTVA = false,
		newTabArt,
		ficheFacture = $(".fichefacture"),
		tabDetFacture;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		dataFiche = infoFiche[0];
		let titrefacture = "Création d'une facture";
		if (dataFiche) {
			titrefacture = "Consultation de la facture ";
			numFacture = dataFiche.numfacture;
			$("#client").cs_custom(ficheFacture, tabClient, false, true);
			$("#numfacture").val(numFacture);
			AfficheFacture();
		} else {
			$("#client").cs_custom(ficheFacture, tabClient, true, true);
			$(".fichefacture #datefacture").val(Today());
		}
		$(".fichefacture .zonetitre .titrepage .titre").text(titrefacture);
		$(".fichefacture .zonetitre .titrepage .elcour").text(numFacture);
		$("#numfacture").focus();
	};
	const AfficheEntFacture = () => {
		factureCour = dataFiche;
		if (factureCour) {
			numFacture = ajoutZero(factureCour.numfacture, 4);
			nomClient = factureCour.nomclient;
			dateFacture = factureCour.dateeng;
			objetFacture = factureCour.objetfacture;
			tvaFacture = factureCour.tvafacture;
			statutFacture = +factureCour.statutfacture;
			// tabDetFacture = JSON.parse(factureCour.detfacture.replace(/\n/g, ""));
			if (statutFacture === 0) $(".zonenumfacture").addClass("actif");
			$(".fichefacture #numfacture").text(numFacture);
			$(".fichefacture #objetfacture").val(objetFacture);
			$(".fichefacture #datefacture").val(dateFacture);

			$(".fichefacture #client").text(nomClient);
			$(".fichefacture #client").removeClass("actif");

			$(".fichefacture #tvacb").prop("checked", tvaFacture == "1");
		} else {
			$(".fichefacture #datefacture").val(Today());
		}
	};
	const AfficheDetFacture = () => {
		if (factureCour) {
			$(".fichefacture .bodylist").empty();
			tabDetFacture = JSON.parse(factureCour.detfacture);
			numLig = 0;
			tabDetFacture.forEach((detail) => {
				numLig++;
				let infoArt = tabArticle.find(
					(art) => +art.codeart === +detail.codeart,
				);
				let article = `${ajoutZero(infoArt.codeart, 3)} - ${firstLetter(
					infoArt.libart,
				)}`;
				let ligneArt = ajoutArticle(numLig);
				let qteArt = +detail.puart;
				let puArt = +detail.qteart;
				let montantHT = qteArt * puArt;
				articleCour = ligneArt.find(".article");
				articleCour.text(article);
				articleCour.cs_custom($(".fichefacture"), tabArticle, false, false);
				ligneArt.find(".qteart").val(millier(qteArt));
				ligneArt.find(".puart").val(millier(puArt));
				ligneArt.find(".montantht").text(millier(montantHT));
				$(".fichefacture .bodylist").append(ligneArt);
			});
			calculFacture();
		}
		if (MODE_CONSULTATION) {
			$(".fichefacture")
				.find("input, textarea, select, .z_btn")
				.prop("disabled", true);
			$(".fichefacture #labeltva").removeClass("actif");
			$(".fichefacture .btnaddart").remove();
			$(".fichefacture .bodylist .btnsuppart").remove();
			$(".fichefacture .zonebtn").remove();
		}
	};
	const AfficheFacture = () => {
		// Affichage de l'entête facture
		AfficheEntFacture();
		// Affichage du détail facture
		AfficheDetFacture();
		// CalculGlobal();
		// $(".fichefacture").fadeIn(300);
	};
	const calculRow = (p_row) => {
		let qteArt =
			p_row.find(".qteart").val() == ""
				? 0
				: +p_row.find(".qteart").val().replaceAll(" ", "");
		let PUArt =
			p_row.find(".qteart").val() == ""
				? 0
				: +p_row.find(".puart").val().replaceAll(" ", "");
		let qteRow = qteArt;
		let PURow = PUArt;
		let totalHT = millier(qteRow * PURow);
		p_row.find(".montantht").text(totalHT);
	};

	const calculFacture = () => {
		$(".fichefacture .datarow").each((idx, row) => {
			calculRow($(row));
		});
		AppliTVA = $(".fichefacture #tvacb").prop("checked");
		montantHT = 0;
		$(".fichefacture .montantht").each((idx, row) => {
			if ($(row).text() != "") {
				montantHT += +$(row).text().replaceAll(" ", "");
			}
		});
		montantTVA = AppliTVA ? Math.round((montantHT * TAUX_TVA) / 100, 0) : 0;
		montantTTC = montantHT + montantTVA;
		let nbLig = $(".fichefacture .datarow").length;
		$(".fichefacture #totalht").text(millier(montantHT));
		$(".fichefacture #totaltva").text(millier(montantTVA));
		$(".fichefacture #totalttc").text(millier(montantTTC));
		$(".fichefacture #totallig").text(millier(nbLig));
	};
	const majIndexRow = () => {
		let indice = 0;
		tabArtSel = [];
		$(".fichefacture .bodylist .datarow").each(function () {
			indice++;
			$(this).find(".colindice").text(indice).attr("data-index", indice);
			// let dataCode = $(this).find(".article").attr("data-code");
			// if (dataCode && dataCode !== "") tabArtSel.push(+dataCode);
		});
	};
	const EnteteFactureOk = () => {
		codeClient = $(".fichefacture #client").attr("data-code");
		codeClient = codeClient == undefined ? "" : codeClient;
		dateFacture = $("#datefacture").val();
		objetFacture = $.trim($("#objetfacture").val());
		return (
			codeClient !== "" &&
			dateFacture !== "" &&
			objetFacture !== "" &&
			isValidDate(dateFacture)
		);
	};
	const LigOk = (p_ligcour) => {
		let codeArt = $.trim(p_ligcour.find(".article").attr("data-code"));
		let qteArt = +p_ligcour.find(".qteart").val();
		return codeArt !== "" && codeArt !== null && qteArt !== 0 && !isNaN(qteArt);
	};
	const DetailFactureOK = () => {
		let detailFacture = $(".fichefacture .bodylist .datarow");
		if (detailFacture.length === 0) return false;
		let OK = true;
		detailFacture.each(function (idx, el) {
			let ligCour = $(el);
			if (!LigOk(ligCour)) {
				OK = false;
			}
		});
		return OK;
	};

	const ctrlSaisie = () => {
		let enteteOk = EnteteFactureOk();
		let detailOk = DetailFactureOK();
		let v_ErreurSaisie = !enteteOk || !detailOk;
		$(".fichefacture #btnenr").prop("disabled", v_ErreurSaisie);
		return v_ErreurSaisie;
	};

	const majListeCS = () => {
		newTabArt = tabArticle.filter((art) => !tabArtSel.includes(+art.codeart));
		$(".fichefacture .bodylist .datarow").each(function () {
			let articleCour = $(this).find(".article");
			articleCour.cs_custom($(".fichefacture"), newTabArt, true, false);
		});
	};
	const EnrFacture = () => {
		// Enregistrement de l'entête
		if (ctrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		let v_TVA = $(".fichefacture #tvacb").prop("checked") ? "1" : "0";
		// Récupération des lignes détail du facture
		tabDetFacture = [];
		let v_LigDetail = $(".fichefacture .bodylist .datarow");
		numFacture = $.trim($(".fichefacture #numfacture").text());
		v_LigDetail.each(function () {
			let codeArt = $(this).find(".article").attr("data-code");
			let qteArt = $(this).find(".qteart").val().replaceAll(" ", "");
			let puArt = $(this).find(".puart").val().replaceAll(" ", "");
			tabDetFacture.push({
				codeart: codeArt,
				puart: +puArt,
				qteart: +qteArt,
			});
		});
		statutFacture = 0;
		actionFacture = "CREATE";
		let dataRec = {
			action: actionFacture,
			numfacture: +numFacture,
			codeclient: codeClient,
			objetfacture: objetFacture,
			statutfacture: statutFacture,
			tvafacture: v_TVA,
			datefacture: dateFacture,
			detfacture: tabDetFacture,
			userlogin: loginCour,
		};

		let resRec = postData("/recFacture", dataRec);
		refreshListe(+resRec.result);
	};
	//#endregion

	//#region events

	$(".fichefacture").on("focus", ".puart, .qteart", (e) => {
		$(e.target).select();
	});
	$(".fichefacture #tvacb").on("change", () => {
		calculFacture();
		ctrlSaisie();
	});
	$(".fichefacture").on("input paste", ".qteart, .puart", (e) => {
		let elCour = $(e.target);
		if (elCour.val() == "") elCour.val(0);
		let rowCour = elCour.parent().parent();

		calculRow(rowCour);
	});
	$(".fichefacture").on("input", ".qteart, .puart", (e) => {
		let elCour = $(e.target);
		let valeur = elCour.val();
		elCour.val(+valeur);
		calculFacture();
	});

	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$(".fichefacture #client").on("change", function (e) {
		ctrlSaisie();
	});
	$(".fichefacture .btnaddart").on("click", function (e) {
		compteurArt = $(".fichefacture .datarow").length;
		compteurArt++;
		let dataRow = ajoutArticle(compteurArt);
		$(".fichefacture .bodylist").append(dataRow);
		newTabArt = tabArticle.filter((art) => !tabArtSel.includes(+art.codeart));
		articleCour = dataRow.find(".article");
		articleCour.cs_custom($(".fichefacture"), newTabArt, true, false);
		calculFacture();
	});
	$(".fichefacture").on("focus", ".puart, .qteart", function () {
		let valeur = $(this).val().replaceAll(" ", "");
		$(this).attr("type", "number");
		$(this).val(valeur);
		$(this).select();
	});
	$(".fichefacture").on("blur", ".puart, .qteart", function () {
		let valeur = millier($(this).val());
		$(this).attr("type", "text");
		$(this).val(valeur);
	});
	$(".fichefacture .bodylist").on("click", ".btnsuppart", function () {
		let dataRow = $(this).parent().parent();

		dataRow.remove();
		majIndexRow();
		calculFacture();
		ctrlSaisie();
	});
	$(".fichefacture").on("input", "input, textarea", () => {
		ctrlSaisie();
	});
	$(".fichefacture .bodylist").on("change", ".article", function () {
		let codeArt = $(this).attr("data-code");
		let infoArt = tabArticle.find((art) => +art.codeart === +codeArt);
		if (infoArt) {
			let puArt = millier(infoArt.puart);
			$(this).parent().parent().find(".puart").val(puArt);
		}
		calculFacture();
		$(this).parent().parent().find(".qteart").focus();
		ctrlSaisie();
	});

	$(".fichefacture #btnenr").on("click", () => {
		EnrFacture();
	});
	//#endregion

	//#region events
	//#endregion

	let tabClient = postData("/listeTable", { table: "vue_client" });
	let tabArticle = postData("/listeTable", { table: "vue_article" });
	tabArticle.sort((a, b) => {
		if (+a.codetypeart >= b.codetypeart) return -1;
		if (+a.codetypeart < b.codetypeart) return 1;
	});
	afficheDataFiche();
	//#endregion
});
