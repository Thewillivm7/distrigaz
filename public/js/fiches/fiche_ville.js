$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeVille = "",
		libVille = "",
		xxx = 0;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		let titreVille = "Création d'une ville";
		if (dataFiche) {
			libVille = dataFiche.libville;
			codeVille = ajoutZero(dataFiche.codeville, 2);
			titreVille = "Mise à jour de la ville ";
		}
		$("#codeville").val(codeVille);
		$("#libville").val(libVille);
		$(".ficheville .zonetitre .titrepage .titre").text(titreVille);
		$(".ficheville .zonetitre .titrepage .elcour").text(libVille);
		$("#libville").focus();
	};
	const ctrlSaisie = () => {
		codeVille = +$("#codeville").val();
		libVille = $.trim($("#libville").val()).toUpperCase();
		let errGeneral = libVille == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".ficheville").on("input", "input, select", () => {
		ctrlSaisie();
	});
	$(".ficheville").on("change", "#listeville", () => {
		ctrlSaisie();
	});

	$(".ficheville #btnenr").on("click", () => {
		actionDB = codeVille == "" ? "CREATE" : "UPDATE";
		let dataVille = {
			action: actionDB,
			codeVille,
			libVille,
		};
		let resRec = postData("/recVille", dataVille);
		refreshListe(+resRec.result);
	});
	//#endregion

	//#region
	afficheDataFiche();
	$Move(".fiche", ".fiche .zonetitre").activeMove();

	//#endregion
});
