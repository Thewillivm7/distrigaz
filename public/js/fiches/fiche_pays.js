$(() => {
	//#region Le svariables
	let actionDB = "";
	let codePays, libPays;

	//#region Les fonctions

	const afficheDataFiche = () => {
		appliMode();
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			libPays = dataFiche.libpays;
			codePays = ajoutZero(dataFiche.codepays, 2);
		}
		let titrePays = "Mise à jour du pays ";
		if (!libPays) {
			titrePays = "Création d'un pays";
			libPays = "";
		} else {
			$("#codepays").val(codePays);
			$("#libpays").val(libPays);
		}
		$(".fichepays .zonetitre .titrepage .titre").text(titrePays);
		$(".fichepays .zonetitre .titrepage .elcour").text(libPays);
		$("#libpays").focus();
	};

	const ctrlSaisie = () => {
		codePays = +$("#codepays").val();
		libPays = $.trim($("#libpays").val()).toUpperCase();
		let errGeneral = libPays == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fichepays").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codePays == "" ? "CREATE" : "UPDATE";
		let dataPays = {
			action: actionDB,
			codePays,
			libPays,
		};
		let resRec = postData("/recPays", dataPays);
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
