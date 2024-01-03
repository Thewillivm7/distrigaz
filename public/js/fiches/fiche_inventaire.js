$(() => {
	//#region Le svariables
	let actionDB = "",
		numInventaire = "",
		detailInventaire = [],
		stockTheoInv = [],
		ficheInventaire = $(".ficheinventaire");
	let statutInventaire;
	function disabled(){
		if(MODE_CONSULTATION = false){
			$("section").prop(disabled,true)
	}
	}
	
	//#region Les fonctions
	const afficheListeData = async () => {
		let dataFiche = infoFiche[0];
		let elcour = "";
		let titreinventaire = "Création d'un inventaire";
		$(".corpslist").empty();
		let tabArticle = postData("/listeTable", {
			table: "vue_artinventaire",
		});
		let tabDetInv = [];
		statutInventaire = dataFiche ? dataFiche.statutinventaire : 0;

		if (!dataFiche) {
			dataFiche = {};
			for (let det of tabArticle) {
				tabDetInv.push({
					codeart: det.codeart,
					libart: libArt,
					qtematch: 0,
					qtephys: 0,
				});
			}
			dataFiche.detailinventaire = tabDetInv;
		} else {
			numInventaire = dataFiche.numinventaire;
		}
		let detailInventaire = dataFiche.detailinventaire;
		for (let detail of detailInventaire) {
			let infoArt = tabArticle.find((art) => +art.codeart == +detail.codeart);
			let libArt = "";
			if (infoArt) {
				libArt = infoArt.libart;
			}
			let article = `${ajoutZero(detail.codeart, 3)} - ${libArt}`;
			let qteTheo = +detail.qtematch ? detail.qtematch : 0;
			let ecartInv = +detail.qtephys - qteTheo;
			if (statutInventaire < 1) {
				qteTheo = "";
				ecartInv = "";
			}
			let detRow = `<section class="datarow" data-code ="${detail.codeart}">
								<div class="coldata article">${article}</div>
								<div class="coldata qtephys">
									<input type="number" value="${detail.qtephys}">
								</div>
								<div class="coldata qtetheo">${qteTheo}</div>
								<div class="coldata ecart">${ecartInv}</div>
						  </section>`;
			$(".corpslist").append(detRow);
		}
		appliMode();
		$(".ficheinventaire .zonetitre .titrepage .titre").text(titreinventaire);
		$(".ficheinventaire .zonetitre .titrepage .elcour").text(elcour);
		$(".ficheinventaire .datarow").eq(0).find(".qtephys input").focus();
	};

	const EnrInventaire = () => {
		// Récupération des lignes détail du inventaire
		let tabDetInventaire = [];
		let v_LigDetail = $(".ficheinventaire .corpslist .datarow");
		v_LigDetail.each(function () {
			let codeArt = $(this).attr("data-code");
			let qtePhys = $(this).find(".qtephys input").val();
			tabDetInventaire.push({
				codeart: +codeArt,
				qtephys: +qtePhys,
			});
			actionInventaire = numInventaire == "" ? "CREATE" : "UPDATE";
		});

		let dataRec = {
			action: actionInventaire,
			numinventaire: numInventaire,
			detinventaire: tabDetInventaire,
			userlogin: loginCour,
			statutinventaire: statutInventaire,
		};
		let resRec = postData("/recInventaire", dataRec);
		refreshListe(+resRec.result);
	};
	//#endregion

	//#region events

	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fiche").on("input", "input", () => {
		$(".fiche #btnenr").prop("disabled", false);
	});
	$(".fiche").on("focus", "input", (e) => {
		$(e.target).select();
	});

	$(".ficheinventaire #btnenr").on("click", () => {
		EnrInventaire();
	});

	//#endregion

	//#region events
	//#endregion

	// afficheDataFiche();
	afficheListeData();

	//#endregion
});
