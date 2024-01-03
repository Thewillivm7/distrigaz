$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeEtape, libEtape;
	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			codeEtape = ajoutZero(dataFiche.codeetape, 2);
			libEtape = dataFiche.libetape;
		}
		let titreEtape = "Mise à jour du type client ";
		if (!libEtape) {
			titreEtape = "Création d'un type client";
			libEtape = "";
		} else {
			$("#codeetape").val(codeEtape);
			$("#libetape").val(libEtape);
		}
		$(".ficheetape .zonetitre .titrepage .titre").text(titreEtape);
		$(".ficheetape .zonetitre .titrepage .elcour").text(libEtape);
		$("#libetape").focus();
	};
	const ctrlSaisie = () => {
		codeEtape = +$("#codeetape").val();
		libEtape = $.trim($("#libetape").val().toUpperCase());
		let errGeneral = libEtape == "";
		$("#btnenr").prop("disabled", errGeneral);
	};
	//#endregion
	//#region events
	$(".ficheetape #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".ficheetape").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".ficheetape #btnenr").on("click", () => {
		actionDB = codeEtape == "" ? "CREATE" : "UPDATE";
		let dataEtape = {
			action: actionDB,
			codeEtape,
			libEtape,
		};
		let resRec = postData("/recEtape", dataEtape);
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

	afficheDataFiche();
	//#endregion
});
