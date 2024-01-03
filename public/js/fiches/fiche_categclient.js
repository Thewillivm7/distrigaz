$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeCategClient, libCategClient;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();

		let dataFiche = infoFiche[0];
		if (dataFiche) {
			codeCategClient = ajoutZero(dataFiche.codecategclient, 2);
			libCategClient = dataFiche.libcategclient;
		}
		let titreCategClient = "Mise à jour de la catégorie client ";
		if (!libCategClient) {
			titreCategClient = "Création d'une categorie client";
			libCategClient = "";
		} else {
			$("#codecategclient").val(codeCategClient);
			$("#libcategclient").val(libCategClient);
		}
		$(".fichecategclient .zonetitre .titrepage .titre").text(titreCategClient);
		$(".fichecategclient .zonetitre .titrepage .elcour").text(libCategClient);
		$("#libcategclient").focus();
	};

	const ctrlSaisie = () => {
		codeCategClient = +$("#codecategclient").val();
		libCategClient = $.trim($("#libcategclient").val());
		let errGeneral = libCategClient == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fichecategclient").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeCategClient == "" ? "CREATE" : "UPDATE";
		let dataCategClient = {
			action: actionDB,
			codeCategClient,
			libCategClient,
		};
		let resRec = postData("/recCategClient", dataCategClient);
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

	//#region categclient
	afficheDataFiche();
	//#endregion
});
