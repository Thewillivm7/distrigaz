$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeCommune, libCommune, codeVille;

	//#region Les fonctions
	const afficheDataFiche = async () => {
		appliMode();

		let tabVille = listeTable("ville");
		MEFSelect("listeville", tabVille);
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			codeCommune = ajoutZero(dataFiche.codecommune, 2);
			libCommune = dataFiche.libcommune;
			codeVille = dataFiche.codeville;
		}
		let titreCommune = "Mise à jour de la commune ";
		if (!libCommune) {
			titreCommune = "Création d'une commune";
			libCommune = "";
			codeVille = "";
		} else {
			$("#codecommune").val(codeCommune);
			$("#libcommune").val(libCommune);
			$("#listeville").val(codeVille);
		}
		$(".fichecommune .zonetitre .titrepage .titre").text(titreCommune);
		$(".fichecommune .zonetitre .titrepage .elcour").text(libCommune);
		$("#libcommune").focus();
	};

	const ctrlSaisie = () => {
		codeCommune = +$("#codecommune").val();
		libCommune = $.trim($("#libcommune").val()).toUpperCase();
		codeVille = $.trim($("#listeville").val());
		let errGeneral = libCommune == "" || codeVille == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fichecommune").on("input", "input, select", () => {
		ctrlSaisie();
	});
	$(".fichecommune").on("change", "#listeville", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeCommune == "" ? "CREATE" : "UPDATE";
		let dataCommune = {
			action: actionDB,
			codeCommune,
			libCommune,
			codeVille,
		};
		let resRec = postData("/recCommune", dataCommune);
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
