$(() => {
	//#region Le svariables
	let actionDB = "",
		descArt,
		codeArt,
		delaiPrevu,
		listeEtape,
		commentaire,
		numCde,
		numDevis,
		codeClient,
		etapeCour,
		typeProd,
		tabEtape,
		typeODP,
		statutODP,
		qteArt,
		infoCde,
		detCde;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		let tabArticle = listeTable("article");
		let dataFiche = infoFiche[0];
		typeProd = dataFiche.typeprod;
		numCde = ajoutZero(dataFiche.numcde, 4);
		numDevis = ajoutZero(dataFiche.numdevis, 4);
		codeClient = ajoutZero(dataFiche.codeclient, 3);
		let nomClient = dataFiche.nomclient.toUpperCase();
		let dateCde = new Date(dataFiche.datecde).toLocaleDateString();
		let dateDevis = new Date(dataFiche.datedevis).toLocaleDateString();
		let infoCde = `BC N° ${numCde} du ${dateCde}`;
		let infoDevis = `Devis N° ${numDevis} du ${dateDevis}`;
		let infoClient = `${codeClient} - ${nomClient}`;
		let titreFiche =
			"Création " + (typeProd === "BAT" ? "d'un BAT" : "d'un ODP");
		let classType = typeProd === "BAT" ? "bat" : "odp";
		$(".ficheprod .zonetitre .titrepage .titre")
			.text(titreFiche)
			.addClass(classType);
		$(".ficheprod .infocde").text(infoCde);
		$(".ficheprod .infodevis").text(infoDevis);
		$(".ficheprod .infoclient").text(infoClient);
		$(".ficheprod").find("#infosarticle, #qteart").addClass(classType);
		// Article
		codeArt = +dataFiche.codeart;
		let articleCour = tabArticle.find((art) => +art.codeart == codeArt);
		if (articleCour) {
			let infoArt = `${ajoutZero(codeArt, 4)} - ${firstLetter(
				articleCour.libart,
			)}`;
			descArt = firstLetter(articleCour.descart);
			detCde = JSON.parse(dataFiche.detcde);
			infoCde = detCde.find((art) => +art.codeart === codeArt);
			let qteCde = infoCde.qteart;
			qteArt = typeProd === "BAT" ? "01" : qteCde;
			$(".ficheprod #descart").val(descArt);
			$(".ficheprod #qteart").text(qteArt);
			$(".ficheprod #infosarticle").text(infoArt);
		}
		MEFListeEtape();
	};
	const MEFListeEtape = () => {
		let listeEtape = listeTable("etape");
		let zoneListe = $(".ficheprod .etapedispo .listeetape");
		zoneListe.empty();
		for (let etape of listeEtape) {
			let strEtape = `<section class="etapeprod" data-code ='${etape.codeetape}'>
								<div class="libetape">${etape.libetape}</div>
								<div class="btnetape">&#10010;</div>
							</section>`;
			zoneListe.append(strEtape);
		}
	};
	const ctrlSaisie = () => {
		tabEtape = [];
		$(".etapesel .listeetape .etapeprod").each((idx, el) => {
			tabEtape.push($(el).attr("data-code"));
		});
		listeEtape = tabEtape.join(",");
		descArt = $.trim($(".ficheprod #descart").val());
		delaiPrevu = $(".ficheprod #delaiprev").val();
		commentaire = $.trim($(".ficheprod #commentodp").val());
		let errGeneral = tabEtape.length === 0 || descArt == "" || delaiPrevu == "";
		$("#btnenr").prop("disabled", errGeneral);
		return errGeneral;
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$(".etapedispo").on("click", ".btnetape", function () {
		let ordre = $(".etapesel .listeetape .etapeprod").length + 1;
		let ligCour = $(this).parent();
		let etapeCour = ligCour.clone();
		$(".etapesel .listeetape").append(etapeCour);
		$(".etapesel .listeetape .btnetape").html("&#10005;");
		etapeCour.prepend(`<div class="ordre">${ordre} - </div>`);
		ligCour.addClass("selected");
		ctrlSaisie();
	});
	$(".etapesel").on("click", ".btnetape", function () {
		let ligCour = $(this).parent();
		let codeEtape = ligCour.attr("data-code");
		let etapeDispo = $(
			`.etapedispo .listeetape .etapeprod[data-code='${codeEtape}']`,
		);
		etapeDispo.removeClass("selected");
		ligCour.remove();
		ctrlSaisie();
	});
	$(".ficheprod").on("input paste", "select, input, textarea", () => {
		ctrlSaisie();
	});
	$(".ficheprod #btnenr").on("click", () => {
		if (ctrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		typeODP = typeProd === "BAT" ? 0 : 1;
		let indexArt = detCde.findIndex((art) => +art.codeart === codeArt);
		detCde[indexArt].statutart = typeODP === 0 ? 1 : 3;
		let dataRec = {
			action: "CREATE",
			numDevis: +numDevis,
			numCde: +numCde,
			codeClient,
			listeEtape,
			etapeCour: tabEtape[0],
			typeODP,
			statutODP: 0,
			delaiPrevu,
			codeArt,
			descArt,
			qteArt: +qteArt,
			commentaire,
			profilCour,
			loginCour,
			detCde,
		};
		let resRec = postData("/recODP", dataRec);
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
	});
	//#endregion

	//#region events
	//#endregion

	//#region pays

	afficheDataFiche();
	//#endregion
});
