$(() => {
	//#region Le svariables
	let actionDB = "",
		numStock,
		compteurArt = 0,
		tabArtSel = [],
		codeClient,
		montantHT,
		montantTTC,
		montantTVA,
		dateStock,
		AppliTVA = false,
		newTabArt,
		ficheStock = $(".fichestock");

	//#region Les fonctions

	const afficheDataFiche = async () => {
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			numStock = dataFiche.numstock;
		}
		let titrestock = "Mise à jour de la stock ";
		if (!numStock) {
			titrestock = "Création d'une stock";
			numStock = "";
			codestock = "";
			$(".fichestock #datestock").val(Today());
		} else {
			$("#codestock").val(codestock);
			$("#numstock").val(numStock);
		}
		$(".fichestock .zonetitre .titrepage .titre").text(titrestock);
		$(".fichestock .zonetitre .titrepage .elcour").text(numStock);
		$("#numstock").focus();
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

	const calculStock = () => {
		$(".fichestock .datarow").each((idx, row) => {
			calculRow($(row));
		});
		AppliTVA = $(".fichestock #tvacb").prop("checked");
		montantHT = 0;
		$(".fichestock .montantht").each((idx, row) => {
			if ($(row).text() != "") {
				montantHT += +$(row).text().replaceAll(" ", "");
			}
		});
		montantTVA = AppliTVA ? Math.round((montantHT * TAUX_TVA) / 100, 0) : 0;
		montantTTC = montantHT + montantTVA;
		let nbLig = $(".fichestock .datarow").length;
		$(".fichestock #totalht").text(millier(montantHT));
		$(".fichestock #totaltva").text(millier(montantTVA));
		$(".fichestock #totalttc").text(millier(montantTTC));
		$(".fichestock #totallig").text(millier(nbLig));
	};
	const majIndexRow = () => {
		let indice = 0;
		tabArtSel = [];
		$(".fichestock .bodylist .datarow").each(function () {
			indice++;
			$(this).find(".colindice").text(indice).attr("data-index", indice);
			// let dataCode = $(this).find(".article").attr("data-code");
			// if (dataCode && dataCode !== "") tabArtSel.push(+dataCode);
		});
	};

	const EnteteStockOk = () => {
		codeClient = $(".fichestock #client").attr("data-code");
		codeClient = codeClient == undefined ? "" : codeClient;
		dateStock = $("#datestock").val();
		objetStock = $.trim($("#objetstock").val());
		return (
			codeClient !== "" &&
			dateStock !== "" &&
			objetStock !== "" &&
			isValidDate(dateStock)
		);
	};
	const LigOk = (p_ligcour) => {
		let codeArt = $.trim(p_ligcour.find(".article").attr("data-code"));
		let qteArt = +p_ligcour.find(".qteart").val();
		return codeArt !== "" && codeArt !== null && qteArt !== 0 && !isNaN(qteArt);
	};
	const DetailStockOK = () => {
		let detailStock = $(".fichestock .bodylist .datarow");
		if (detailStock.length === 0) return false;
		let OK = true;
		detailStock.each(function (idx, el) {
			let ligCour = $(el);
			if (!LigOk(ligCour)) {
				OK = false;
			}
		});
		return OK;
	};

	const ctrlSaisie = () => {
		let enteteOk = EnteteStockOk();
		let detailOk = DetailStockOK();
		let v_ErreurSaisie = !enteteOk || !detailOk;
		$(".fichestock #btnenr").prop("disabled", v_ErreurSaisie);
		return v_ErreurSaisie;
	};

	const majListeCS = () => {
		newTabArt = tabArticle.filter((art) => !tabArtSel.includes(+art.codeart));
		$(".fichestock .bodylist .datarow").each(function () {
			let articleCour = $(this).find(".article");
			articleCour.cs_custom($(".fichestock"), newTabArt, true, false);
		});
	};
	const EnrStock = () => {
		// Enregistrement de l'entête
		if (ctrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		let v_TVA = $(".fichestock #tvacb").prop("checked") ? "1" : "0";
		// Récupération des lignes détail du stock
		let tabDetStock = [];
		let v_LigDetail = $(".fichestock .bodylist .datarow");
		numStock = $.trim($(".fichestock #numstock").text());
		v_LigDetail.each(function () {
			let codeArt = $(this).find(".article").attr("data-code");
			let qteArt = $(this).find(".qteart").val().replaceAll(" ", "");
			let puArt = $(this).find(".puart").val().replaceAll(" ", "");
			tabDetStock.push({
				codeart: codeArt,
				puart: +puArt,
				qteart: +qteArt,
			});
		});
		statutStock = 0;
		actionStock = "CREATE";
		let dataRec = {
			action: actionStock,
			numstock: +numStock,
			codeclient: codeClient,
			objetstock: objetStock,
			statutstock: statutStock,
			tvastock: v_TVA,
			datestock: dateStock,
			detstock: tabDetStock,
			userlogin: loginCour,
		};

		let resRec = postData("/recStock", dataRec);
		if (+resRec.result > 0) {
			if (+resRec.result > 0) {
				$(".modalfiche").fadeOut(300, () => {
					let menu = $(`.menuitem[data-code='${menuSelected}']`);
					menu.removeClass("selected");
					menu.trigger("click");
				});
			} else {
				alert(resRec.result);
			}
		}
	};
	//#endregion

	//#region events

	$(".fichestock").on("focus", ".puart, .qteart", (e) => {
		$(e.target).select();
	});
	$(".fichestock #tvacb").on("change", () => {
		calculStock();
		ctrlSaisie();
	});
	$(".fichestock").on("input paste", ".qteart, .puart", (e) => {
		let elCour = $(e.target);
		if (elCour.val() == "") elCour.val(0);
		let rowCour = elCour.parent().parent();

		calculRow(rowCour);
	});
	$(".fichestock").on("input", ".qteart, .puart", (e) => {
		let elCour = $(e.target);
		let valeur = elCour.val();
		elCour.val(+valeur);
		calculStock();
	});

	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$(".fichestock #client").on("change", function (e) {
		ctrlSaisie();
	});
	$(".fichestock .btnaddart").on("click", function (e) {
		compteurArt = $(".fichestock .datarow").length;
		compteurArt++;
		let dataRow = ajoutArticle(compteurArt);
		$(".fichestock .bodylist").append(dataRow);
		newTabArt = tabArticle.filter((art) => !tabArtSel.includes(+art.codeart));
		articleCour = dataRow.find(".article");
		articleCour.cs_custom($(".fichestock"), newTabArt, true, false);
		calculStock();
	});
	$(".fichestock").on("focus", ".puart, .qteart", function () {
		let valeur = $(this).val().replaceAll(" ", "");
		$(this).attr("type", "number");
		$(this).val(valeur);
		$(this).select();
	});
	$(".fichestock").on("blur", ".puart, .qteart", function () {
		let valeur = millier($(this).val());
		$(this).attr("type", "text");
		$(this).val(valeur);
	});
	$(".fichestock .bodylist").on("click", ".btnsuppart", function () {
		let dataRow = $(this).parent().parent();

		dataRow.remove();
		majIndexRow();
		calculStock();
		ctrlSaisie();
	});
	$(".fichestock").on("input", "input, textarea", () => {
		ctrlSaisie();
	});
	$(".fichestock .bodylist").on("change", ".article", function () {
		let codeArt = $(this).attr("data-code");
		let infoArt = tabArticle.find((art) => +art.codeart === +codeArt);
		if (infoArt) {
			let puArt = millier(infoArt.puart);
			$(this).parent().parent().find(".puart").val(puArt);
		}
		calculStock();
		$(this).parent().parent().find(".qteart").focus();
		ctrlSaisie();
	});

	$(".fichestock #btnenr").on("click", () => {
		EnrStock();
	});

	//#endregion

	//#region events
	//#endregion

	afficheDataFiche();
	let tabClient = postData("/listeTable", { table: "vue_client" });
	let tabArticle = postData("/listeTable", { table: "vue_article" });
	// $("#client").cs_custom(ficheStock, tabClient, true, true);

	$("#client").cs_custom(ficheStock, tabClient, true, true);
	//  $(".commune");
	//#endregion
});
