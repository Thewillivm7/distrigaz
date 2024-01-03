$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeTypeArt, libTypeArt;

	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			codeTypeArt = ajoutZero(dataFiche.codetypeart, 2);
			libTypeArt = firstLetter(dataFiche.libtypeart);
		}
		let titreTypeArt = "Mise à jour du type art ";
		if (!libTypeArt) {
			titreTypeArt = "Création d'un type art";
			libTypeArt = "";
		} else {
			$("#codetypeart").val(codeTypeArt);
			$("#libtypeart").val(libTypeArt);
		}
		$(".fichetypeart .zonetitre .titrepage .titre").text(titreTypeArt);
		$(".fichetypeart .zonetitre .titrepage .elcour").text(libTypeArt);
		$("#libtypeart").focus();
	};

	const ctrlSaisie = () => {
		codeTypeArt = +$("#codetypeart").val();
		libTypeArt = firstLetter($.trim($("#libtypeart").val()));
		let errGeneral = libTypeArt == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fichetypeart").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeTypeArt == "" ? "CREATE" : "UPDATE";
		let dataTypeArt = {
			action: actionDB,
			codeTypeArt,
			libTypeArt,
		};
		let resRec = postData("/recTypeArt", dataTypeArt);
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
