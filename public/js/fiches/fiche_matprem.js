$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeMatPrem, libMatPrem, stockAlerte, codeCond;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			libMatPrem = dataFiche.libmatprem;
			codeMatPrem = dataFiche.codematprem;
			stockAlerte = dataFiche.stockalerte;
			codeCond = dataFiche.codecond;
		}

		let titreMatPrem = "Mise à jour de la matière première ";
		if (!libMatPrem) {
			titreMatPrem = "Création d'une matière première";
			libMatPrem = "";
		} else {
			$("#codematprem").val(codeMatPrem);
			$("#libmatprem").val(libMatPrem);
			$("#listecond").val(codeCond);
			$("#stockalerte").val(stockAlerte);
		}
		$(".fichematprem .zonetitre .titrepage .titre").text(titreMatPrem);
		$(".fichematprem .zonetitre .titrepage .elcour").text(libMatPrem);
		$("#libmatprem").focus();
	};

	const ctrlSaisie = () => {
		codeMatPrem = $("#codematprem").val();
		libMatPrem = $.trim($("#libmatprem").val()).toUpperCase();
		let errGeneral = libMatPrem == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fichematprem").on("input", "input, select", () => {
		ctrlSaisie();
	});
	$(".fichematprem").on("change", "#listecond", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeMatPrem == "" ? "CREATE" : "UPDATE";
		let dataMatPrem = {
			action: actionDB,
			codeMatPrem,
			libMatPrem,
		};
		let resRec = postData("/recMatPrem", dataMatPrem);
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

	//#region matprem
	let dataFiche = JSON.parse($("#cachefiche").val())[0];
	if (dataFiche) {
		libMatPrem = dataFiche.libmatprem;
		codeMatPrem = dataFiche.codematprem;
		stockAlerte = dataFiche.stockalerte;
		codeCond = dataFiche.codecond;
	}

	afficheDataFiche();
	//#endregion
});
