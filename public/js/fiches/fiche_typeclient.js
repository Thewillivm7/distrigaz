$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeTypeClient, libTypeClient;
	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		let titreTypeClient = "Création d'un type client";
		if (dataFiche) {
			codeTypeClient = ajoutZero(dataFiche.codetypeclient, 2);
			libTypeClient = dataFiche.libtypeclient;
			titreTypeClient = "Mise à jour du type client ";
			$("#codetypeclient").val(codeTypeClient);
			$("#libtypeclient").val(libTypeClient);
		}
		$(".fichetypeclient .zonetitre .titrepage .titre").text(titreTypeClient);
		$(".fichetypeclient .zonetitre .titrepage .elcour").text(libTypeClient);
		$("#libtypeclient").focus();
	};
	const ctrlSaisie = () => {
		codeTypeClient = +$("#codetypeclient").val();
		libTypeClient = $.trim($("#libtypeclient").val());
		let errGeneral = libTypeClient == "";
		$("#btnenr").prop("disabled", errGeneral);
	};
	//#endregion
	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fichetypeclient").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeTypeClient == "" ? "CREATE" : "UPDATE";
		let dataTypeClient = {
			action: actionDB,
			codeTypeClient,
			libTypeClient,
		};
		let resRec = postData("/recTypeClient", dataTypeClient);
		refreshListe(+resRec.result);
	});

	//#endregion

	//#region events
	//#endregion

	afficheDataFiche();
	//#endregion
});
