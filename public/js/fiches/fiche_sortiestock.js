$(() => {
	//#region Le svariables
	let actionDB = "",
		dataFiche,
		sortiestockCour,
		numSortiestock,
		compteurArt = 0,
		tabArtSel = [],
		codeDepot,
		montantHT,
		montantTTC,
		montantTVA,
		dateSortiestock,
		AppliTVA = false,
		newTabArt,
		ficheSortiestock = $(".fichesortiestock"),
		objetSortiestock,
		tabDetSortiestock;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		dataFiche = infoFiche[0];
		let titresortiestock = "Création d'une sortie stock";
		if (dataFiche) {
			titresortiestock = "Consultation de l'sortie de stock ";
			numSortiestock = dataFiche.numsortiestock;
			$("#depot").cs_custom(ficheSortiestock, tabDepot, false, true);
			$("#numsortiestock").val(numSortiestock);
			AfficheSortiestock();
		} else {
			$("#depot").cs_custom(ficheSortiestock, tabDepot, true, true);
			$(".fichesortiestock #datesortiestock").val(Today());
		}
		$(".fichesortiestock .zonetitre .titrepage .titre").text(titresortiestock);
		$(".fichesortiestock .zonetitre .titrepage .elcour").text(numSortiestock);
		$("#numsortiestock").focus();
	};
	const AfficheEntSortiestock = () => {
		sortiestockCour = dataFiche;
		if (sortiestockCour) {
			numSortiestock = ajoutZero(sortiestockCour.nummvt, 4);
			nomDepot = sortiestockCour.nomdepot;
			dateSortiestock = sortiestockCour.dateng;
			objetSortiestock = sortiestockCour.objetmvt;
			$(".fichesortiestock #numsortiestock").text(numSortiestock);
			$(".fichesortiestock #objetsortiestock").val(objetSortiestock);
			$(".fichesortiestock #datesortiestock").val(dateSortiestock);

			$(".fichesortiestock #depot").text(nomDepot);
			$(".fichesortiestock #depot").removeClass("actif");
		} else {
			$(".fichesortiestock #datesortiestock").val(Today());
		}
	};
	const AfficheDetSortiestock = () => {
		if (sortiestockCour) {
			$(".fichesortiestock .bodylist").empty();
			tabDetSortiestock = sortiestockCour.detmvt;
			numLig = 0;
			tabDetSortiestock.forEach((detail) => {
				numLig++;
				let infoArt = tabArticle.find(
					(art) => +art.codeart === +detail.codeart,
				);
				let article = `${ajoutZero(infoArt.codeart, 3)} - ${firstLetter(
					infoArt.libart,
				)}`;
				let ligneArt = ajoutArticlesortie(numLig);
				let qteArt = +detail.puventart;
				let puVentart = +detail.qteart;
				let montantHT = qteArt * puVentart;
				articleCour = ligneArt.find(".article");
				articleCour.text(article);
				articleCour.cs_custom($(".fichesortiestock"), tabArticle, false, false);
				ligneArt.find(".qteart").val(millier(qteArt));
				ligneArt.find(".puventart").val(millier(puVentart));
				ligneArt.find(".montantht").text(millier(montantHT));
				$(".fichesortiestock .bodylist").append(ligneArt);
			});
			calculSortiestock();
		}
		if (MODE_CONSULTATION) {
			$(".fichesortiestock")
				.find("input, textarea, select, .z_btn")
				.prop("disabled", true);
			$(".fichesortiestock #labeltva").removeClass("actif");
			$(".fichesortiestock .btnaddart").remove();
			$(".fichesortiestock .bodylist .btnsuppart").remove();
			$(".fichesortiestock .zonebtn").remove();
		}
	};
	const AfficheSortiestock = () => {
		AfficheEntSortiestock();
		AfficheDetSortiestock();
	};
	const calculRow = (p_row) => {
		let qteArt =
			p_row.find(".qteart").val() == ""
				? 0
				: +p_row.find(".qteart").val().replaceAll(" ", "");
		let PUArt =
			p_row.find(".qteart").val() == ""
				? 0
				: +p_row.find(".puventart").val().replaceAll(" ", "");
		let qteRow = qteArt;
		let PURow = PUArt;
		let totalHT = millier(qteRow * PURow);
		p_row.find(".montantht").text(totalHT);
	};

	const calculSortiestock = () => {
		$(".fichesortiestock .datarow").each((idx, row) => {
			calculRow($(row));
		});
		AppliTVA = $(".fichesortiestock #tvacb").prop("checked");
		montantHT = 0;
		$(".fichesortiestock .montantht").each((idx, row) => {
			if ($(row).text() != "") {
				montantHT += +$(row).text().replaceAll(" ", "");
			}
		});
		montantTVA = AppliTVA ? Math.round((montantHT * TAUX_TVA) / 100, 0) : 0;
		montantTTC = montantHT + montantTVA;
		let nbLig = $(".fichesortiestock .datarow").length;
		$(".fichesortiestock #totalht").text(millier(montantHT));
		$(".fichesortiestock #totaltva").text(millier(montantTVA));
		$(".fichesortiestock #totalttc").text(millier(montantTTC));
		$(".fichesortiestock #totallig").text(millier(nbLig));
	};
	const majIndexRow = () => {
		let indice = 0;
		tabArtSel = [];
		$(".fichesortiestock .bodylist .datarow").each(function () {
			indice++;
			$(this).find(".colindice").text(indice).attr("data-index", indice);
		});
	};
	const EnteteSortiestockOk = () => {
		codeDepot = $(".fichesortiestock #depot").attr("data-code");
		codeDepot = codeDepot == undefined ? "" : codeDepot;
		dateSortiestock = $("#datesortiestock").val();
		objetSortiestock = $.trim($("#objetsortiestock").val());
		return (
			codeDepot !== "" &&
			dateSortiestock !== "" &&
			objetSortiestock !== "" &&
			isValidDate(dateSortiestock)
		);
	};
	const LigOk = (p_ligcour) => {
		let codeArt = $.trim(p_ligcour.find(".article").attr("data-code"));
		let qteArt = +p_ligcour.find(".qteart").val();
		return codeArt !== "" && codeArt !== null && qteArt !== 0 && !isNaN(qteArt);
	};
	const ajoutArticlesortie = (p_index) => {
		let strArt = ` <section class="datarow" data-index="${p_index}">
                    <div class="coldata colindice">${p_index}</div>
                    <div class="coldata">
                        <span class="article" id="article${p_index}"></span>
                    </div>
                    <div class="coldata">
                        <input type="text" class="qteart" value="0">
                    </div>
                    <div class="coldata">
                        <input type="text" class="puventart" value="0">
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
	const DetailSortiestockOK = () => {
		let detailSortiestock = $(".fichesortiestock .bodylist .datarow");
		if (detailSortiestock.length === 0) return false;
		let OK = true;
		detailSortiestock.each(function (idx, el) {
			let ligCour = $(el);
			if (!LigOk(ligCour)) {
				OK = false;
			}
		});
		return OK;
	};

	const ctrlSaisie = () => {
		let enteteOk = EnteteSortiestockOk();
		let detailOk = DetailSortiestockOK();
		let v_ErreurSaisie = !enteteOk || !detailOk;
		$(".fichesortiestock #btnenr").prop("disabled", v_ErreurSaisie);
		return v_ErreurSaisie;
	};

	const EnrSortiestock = () => {
		// Enregistrement de l'entête
		if (ctrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		let v_TVA = $(".fichesortiestock #tvacb").prop("checked") ? "1" : "0";
		// Récupération des lignes détail du sortiestock
		let tabDetSortiestock = [];
		let v_LigDetail = $(".fichesortiestock .bodylist .datarow");
		numSortiestock = $.trim($(".fichesortiestock #numsortiestock").text());
		v_LigDetail.each(function () {
			let codeArt = $(this).find(".article").attr("data-code");
			let qteArt = $(this).find(".qteart").val().replaceAll(" ", "");
			let puVentart = $(this).find(".puventart").val().replaceAll(" ", "");
			tabDetSortiestock.push({
				codeart: codeArt,
				puventart: +puVentart,
				qteart: +qteArt,
			});
		});
		statutSortiestock = 0;
		actionSortiestock = "CREATE";
		let dataRec = {
			action: actionSortiestock,
			codedepot: codeDepot,
			objetmvt: objetSortiestock,
			typemvt: "S",
			datemvt: dateSortiestock,
			detmvt: tabDetSortiestock,
			userlogin: loginCour,
		};

		let resRec = postData("/recMvtStock", dataRec);
		refreshListe(+resRec.result);
	};
	//#endregion

	//#region events

	$(".fichesortiestock").on("focus", ".puventart, .qteart", (e) => {
		$(e.target).select();
	});
	$(".fichesortiestock #tvacb").on("change", () => {
		calculSortiestock();
		ctrlSaisie();
	});
	$(".fichesortiestock").on("input paste", ".qteart, .puventart", (e) => {
		let elCour = $(e.target);
		if (elCour.val() == "") elCour.val(0);
		let rowCour = elCour.parent().parent();

		calculRow(rowCour);
	});
	$(".fichesortiestock").on("input", ".qteart, .puventart", (e) => {
		let elCour = $(e.target);
		let valeur = elCour.val();
		elCour.val(+valeur);
		calculSortiestock();
	});

	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$(".fichesortiestock #depot").on("change", function (e) {
		ctrlSaisie();
	});
	$(".fichesortiestock .btnaddart").on("click", function (e) {
		compteurArt = $(".fichesortiestock .datarow").length;
		compteurArt++;
		let dataRow = ajoutArticlesortie(compteurArt);
		$(".fichesortiestock .bodylist").append(dataRow);
		newTabArt = tabArticle.filter((art) => !tabArtSel.includes(+art.codeart));
		articleCour = dataRow.find(".article");
		articleCour.cs_custom($(".fichesortiestock"), newTabArt, true, false);
		calculSortiestock();
	});
	$(".fichesortiestock").on("focus", ".puventart, .qteart", function () {
		let valeur = $(this).val().replaceAll(" ", "");
		$(this).attr("type", "number");
		$(this).val(valeur);
		$(this).select();
	});
	$(".fichesortiestock").on("blur", ".puventart, .qteart", function () {
		let valeur = millier($(this).val());
		$(this).attr("type", "text");
		$(this).val(valeur);
	});
	$(".fichesortiestock .bodylist").on("click", ".btnsuppart", function () {
		let dataRow = $(this).parent().parent();

		dataRow.remove();
		majIndexRow();
		calculSortiestock();
		ctrlSaisie();
	});
	$(".fichesortiestock").on("input", "input, textarea", () => {
		ctrlSaisie();
	});

	$(".fichesortiestock .bodylist").on("change", ".article", function () {
		let codeArt = $(this).attr("data-code");
		let infoArt = tabArticle.find((art) => +art.codeart === +codeArt);
		if (infoArt) {
			let puVentart = millier(infoArt.puventart);
			$(this).parent().parent().find(".puventart").val(puVentart);
		}
		calculSortiestock();
		$(this).parent().parent().find(".qteart").focus();
		ctrlSaisie();
	});

	$(".fichesortiestock #btnenr").on("click", () => {
		EnrSortiestock();
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
