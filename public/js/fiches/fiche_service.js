$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeService, libService;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			codeService = ajoutZero(dataFiche.codeservice, 2);
			libService = dataFiche.libservice;
		}
		let titreService = "Mise à jour du service ";
		if (!libService) {
			titreService = "Création d'un service";
			libService = "";
		} else {
			$("#codeservice").val(codeService);
			$("#libservice").val(libService);
		}
		$(".ficheservice .zonetitre .titrepage .titre").text(titreService);
		$(".ficheservice .zonetitre .titrepage .elcour").text(libService);
		$("#libservice").focus();
	};

	const ctrlSaisie = () => {
		codeService = $("#codeservice").val();
		libService = $.trim($("#libservice").val()).toUpperCase();
		let errGeneral = libService == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	function UniqueEl(p_Tableau, p_cle) {
		return [
			...new Map(
				p_Tableau.map((obj) => [`${obj[p_cle]}`, obj[p_cle]]),
			).values(),
		];
	}

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".ficheservice").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeService == "" ? "CREATE" : "UPDATE";
		let dataService = {
			action: actionDB,
			codeService,
			libService,
		};
		let resRec = postData("/recService", dataService);
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

	//#region
	afficheDataFiche();
	//#endregion
});
