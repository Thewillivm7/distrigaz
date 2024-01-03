$(() => {
	//#region Le svariables
	let actionDB = "",
		dataFiche,
		entreestockCour,
		numEntreestock,
		compteurArt = 0,
		tabArtSel = [],
		codeDepot,
		montantHT,
		montantTTC,
		montantTVA,
		dateEntreestock,
		objetEntreestock,
		AppliTVA = false,
		newTabArt,
		ficheEntreestock = $(".ficheentreestock"),
		tabDetEntreestock;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		dataFiche = infoFiche[0];
		let titreentreestock = "Création d'une entrée stock";
		if (dataFiche) {
			titreentreestock = "Consultation de l'entrée de stock ";
			numEntreestock = dataFiche.numentreestock;
			$("#depot").cs_custom(ficheEntreestock, tabDepot, false, true);
			$("#numentreestock").val(numEntreestock);
			AfficheEntreestock();
		} else {
			$("#depot").cs_custom(ficheEntreestock, tabDepot, true, true);
			$(".ficheentreestock #dateentreestock").val(Today());
		}
		$(".ficheentreestock .zonetitre .titrepage .titre").text(titreentreestock);
		$(".ficheentreestock .zonetitre .titrepage .elcour").text(numEntreestock);
		$("#numentreestock").focus();
	};
	const AfficheEntEntreestock = () => {
		entreestockCour = dataFiche;
		if (entreestockCour) {
			numEntreestock = ajoutZero(entreestockCour.nummvt, 4);
			nomDepot = entreestockCour.nomdepot;
			dateEntreestock = entreestockCour.dateng;
			objetEntreestock = entreestockCour.objetmvt;
			console.log(entreestockCour);
			$(".ficheentreestock #numentreestock").text(numEntreestock);
			$(".ficheentreestock #objetentreestock").val(objetEntreestock);
			$(".ficheentreestock #dateentreestock").val(dateEntreestock);

			$(".ficheentreestock #depot").text(nomDepot);
			$(".ficheentreestock #depot").removeClass("actif");
		} else {
			$(".ficheentreestock #dateentreestock").val(Today());
		}
	};
	const AfficheDetEntreestock = () => {
		if (entreestockCour) {
			$(".ficheentreestock .bodylist").empty();
			tabDetEntreestock = entreestockCour.detmvt;
			numLig = 0;
			tabDetEntreestock.forEach((detail) => {
				numLig++;
				let infoArt = tabArticle.find(
					(art) => +art.codeart === +detail.codeart,
				);
				let article = `${ajoutZero(infoArt.codeart, 3)} - ${firstLetter(
					infoArt.libart,
				)}`;
				let ligneArt = ajoutArticleentre(numLig);
				let qteArt = +detail.qteart;
				let puAchart = +detail.puachart;
				let montantHT = qteArt * puAchart;
				articleCour = ligneArt.find(".article");
				articleCour.text(article);
				articleCour.cs_custom($(".ficheentreestock"), tabArticle, false, false);
				ligneArt.find(".qteart").val(millier(qteArt));
				ligneArt.find(".puachart").val(millier(puAchart));
				ligneArt.find(".montantht").text(millier(montantHT));
				$(".ficheentreestock .bodylist").append(ligneArt);
			});
			calculEntreestock();
		}
		if (MODE_CONSULTATION) {
			$(".ficheentreestock")
				.find("input, textarea, select, .z_btn")
				.prop("disabled", true);
			$(".ficheentreestock #labeltva").removeClass("actif");
			$(".ficheentreestock .btnaddart").remove();
			$(".ficheentreestock .bodylist .btnsuppart").remove();
			$(".ficheentreestock .zonebtn").remove();
		}
	};
	const AfficheEntreestock = () => {
		// Affichage de l'entête entreestock
		AfficheEntEntreestock();
		// Affichage du détail entreestock
		AfficheDetEntreestock();
		// CalculGlobal();
		// $(".ficheentreestock").fadeIn(300);
	};
	const calculRow = (p_row) => {
		let qteArt =
			p_row.find(".qteart").val() == ""
				? 0
				: +p_row.find(".qteart").val().replaceAll(" ", "");
		let PUArt =
			p_row.find(".qteart").val() == ""
				? 0
				: +p_row.find(".puachart").val().replaceAll(" ", "");
		let qteRow = qteArt;
		let PURow = PUArt;
		let totalHT = millier(qteRow * PURow);
		p_row.find(".montantht").text(totalHT);
	};

	const calculEntreestock = () => {
		$(".ficheentreestock .datarow").each((idx, row) => {
			calculRow($(row));
		});
		AppliTVA = $(".ficheentreestock #tvacb").prop("checked");
		montantHT = 0;
		$(".ficheentreestock .montantht").each((idx, row) => {
			if ($(row).text() != "") {
				montantHT += +$(row).text().replaceAll(" ", "");
			}
		});
		montantTVA = AppliTVA ? Math.round((montantHT * TAUX_TVA) / 100, 0) : 0;
		montantTTC = montantHT + montantTVA;
		let nbLig = $(".ficheentreestock .datarow").length;
		$(".ficheentreestock #totalht").text(millier(montantHT));
		$(".ficheentreestock #totaltva").text(millier(montantTVA));
		$(".ficheentreestock #totalttc").text(millier(montantTTC));
		$(".ficheentreestock #totallig").text(millier(nbLig));
	};
	const majIndexRow = () => {
		let indice = 0;
		tabArtSel = [];
		$(".ficheentreestock .bodylist .datarow").each(function () {
			indice++;
			$(this).find(".colindice").text(indice).attr("data-index", indice);
			// let dataCode = $(this).find(".article").attr("data-code");
			// if (dataCode && dataCode !== "") tabArtSel.push(+dataCode);
		});
	};
	const EnteteEntreestockOk = () => {
		codeDepot = $(".ficheentreestock #depot").attr("data-code");
		codeDepot = codeDepot == undefined ? "" : codeDepot;
		dateEntreestock = $("#dateentreestock").val();
		objetEntreestock = $.trim($("#objetentreestock").val());
		return (
			codeDepot !== "" &&
			dateEntreestock !== "" &&
			objetEntreestock !== "" &&
			isValidDate(dateEntreestock)
		);
	};
	const LigOk = (p_ligcour) => {
		let codeArt = $.trim(p_ligcour.find(".article").attr("data-code"));
		let qteArt = +p_ligcour.find(".qteart").val();
		return codeArt !== "" && codeArt !== null && qteArt !== 0 && !isNaN(qteArt);
	};
	const ajoutArticleentre = (p_index) => {
		let strArt = ` <section class="datarow" data-index="${p_index}">
                    <div class="coldata colindice">${p_index}</div>
                    <div class="coldata">
                        <span class="article" id="article${p_index}"></span>
                    </div>
                    <div class="coldata">
                        <input type="text" class="qteart" value="0">
                    </div>
                    <div class="coldata">
                        <input type="text" class="puachart" value="0">
                    </div>
                    <div class="coldata">
                        <span class="montantht"></span>
                    </div>
                    <div class="colaction coldata">
						<span class="btnsuppart">&#10008;</span>
                    </div>
                </section>  `;
		let article = $(strArt);
		return article;
	};
	const DetailEntreestockOK = () => {
		let detailEntreestock = $(".ficheentreestock .bodylist .datarow");
		if (detailEntreestock.length === 0) return false;
		let OK = true;
		detailEntreestock.each(function (idx, el) {
			let ligCour = $(el);
			if (!LigOk(ligCour)) {
				OK = false;
			}
		});
		return OK;
	};

	const ctrlSaisie = () => {
		let enteteOk = EnteteEntreestockOk();
		let detailOk = DetailEntreestockOK();
		let v_ErreurSaisie = !enteteOk || !detailOk;
		$(".ficheentreestock #btnenr").prop("disabled", v_ErreurSaisie);
		return v_ErreurSaisie;
	};

	const EnrEntreestock = () => {
		// Enregistrement de l'entête
		if (ctrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		let v_TVA = $(".ficheentreestock #tvacb").prop("checked") ? "1" : "0";
		// Récupération des lignes détail du entreestock
		tabDetEntreestock = [];
		let v_LigDetail = $(".ficheentreestock .bodylist .datarow");
		numEntreestock = $.trim($(".ficheentreestock #numentreestock").text());
		v_LigDetail.each(function () {
			let codeArt = $(this).find(".article").attr("data-code");
			let qteArt = $(this).find(".qteart").val().replaceAll(" ", "");
			let puAchart = $(this).find(".puachart").val().replaceAll(" ", "");
			tabDetEntreestock.push({
				codeart: codeArt,
				puachart: +puAchart,
				qteart: +qteArt,
			});
		});
		statutEntreestock = 0;
		actionEntreestock = "CREATE";
		let dataRec = {
			action: actionEntreestock,
			codedepot: codeDepot,
			objetmvt: objetEntreestock,
			typemvt: "E",
			datemvt: dateEntreestock,
			detmvt: tabDetEntreestock,
			userlogin: loginCour,
		};

		let resRec = postData("/recMvtStock", dataRec);
		refreshListe(+resRec.result);
	};
	//#endregion

	//#region events

	$(".ficheentreestock").on("focus", ".puachart, .qteart", (e) => {
		$(e.target).select();
	});
	$(".ficheentreestock #tvacb").on("change", () => {
		calculEntreestock();
		ctrlSaisie();
	});
	$(".ficheentreestock").on("input paste", ".qteart, .puachart", (e) => {
		let elCour = $(e.target);
		if (elCour.val() == "") elCour.val(0);
		let rowCour = elCour.parent().parent();

		calculRow(rowCour);
	});
	$(".ficheentreestock").on("input", ".qteart, .puachart", (e) => {
		let elCour = $(e.target);
		let valeur = elCour.val();
		elCour.val(+valeur);
		calculEntreestock();
	});

	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$(".ficheentreestock #depot").on("change", function (e) {
		ctrlSaisie();
	});
	$(".ficheentreestock .btnaddart").on("click", function (e) {
		compteurArt = $(".ficheentreestock .datarow").length;
		compteurArt++;
		let dataRow = ajoutArticleentre(compteurArt);
		$(".ficheentreestock .bodylist").append(dataRow);
		newTabArt = tabArticle.filter((art) => !tabArtSel.includes(+art.codeart));
		articleCour = dataRow.find(".article");
		articleCour.cs_custom($(".ficheentreestock"), newTabArt, true, false);
		calculEntreestock();
	});
	$(".ficheentreestock").on("focus", ".puachart, .qteart", function () {
		let valeur = $(this).val().replaceAll(" ", "");
		$(this).attr("type", "number");
		$(this).val(valeur);
		$(this).select();
	});
	$(".ficheentreestock").on("blur", ".puachart, .qteart", function () {
		let valeur = millier($(this).val());
		$(this).attr("type", "text");
		$(this).val(valeur);
	});
	$(".ficheentreestock .bodylist").on("click", ".btnsuppart", function () {
		let dataRow = $(this).parent().parent();

		dataRow.remove();
		majIndexRow();
		calculEntreestock();
		ctrlSaisie();
	});
	$(".ficheentreestock").on("input", "input, textarea", () => {
		ctrlSaisie();
	});
	$(".ficheentreestock .bodylist").on("change", ".article", function () {
		let codeArt = $(this).attr("data-code");
		let infoArt = tabArticle.find((art) => +art.codeart === +codeArt);
		if (infoArt) {
			let puAchart = millier(infoArt.puachart);
			$(this).parent().parent().find(".puachart").val(puAchart);
		}
		calculEntreestock();
		$(this).parent().parent().find(".qteart").focus();
		ctrlSaisie();
	});

	$(".ficheentreestock #btnenr").on("click", () => {
		EnrEntreestock();
	});
	//#endregion

	//#region events
	//#endregion

	let tabDepot = postData("/listeTable", { table: "vue_depot" });
	let tabArticle = postData("/listeTable", { table: "vue_article" });
	tabArticle.sort((a, b) => {
		if (+a.codetypeart >= b.codetypeart) return -1;
		if (+a.codetypeart < b.codetypeart) return 1;
	});
	afficheDataFiche();
	//#endregion
});
