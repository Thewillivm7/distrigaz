$(() => {
	$(() => {
		//#region Le svariables
		let actionDB = "";
		let codeDep, libDep, codeVille, listedepot;

		//#endregion
		//#region Les fonctions

		const afficheDataFiche = async () => {
			appliMode();
			let TabVille = listeTable("ville");
			let TabDepot = listeTable("depot");
			MEFSelect("listeville", TabVille);
			MEFSelect("listedepot", TabDepot);
			let dataFiche = infoFiche[0];
			if (dataFiche) {
				codeDep = ajoutZero(dataFiche.codedepot, 2);
				libDep = firstLetter(dataFiche.libdepot);
				codeVille = dataFiche.codeville;
				listedepot = dataFiche.depotlie;
			}
			let titreDepot = "Mise à jour du dépôt ";
			if (!codeDep) {
				titreDepot = "Création d'un dépôt";
			} else {
				$(".fichedepot #codedep").val(codeDep);
				$(".fichedepot #libdep").val(libDep);
				$(".fichedepot #listeville").val(codeVille);
				$(".fichedepot #listedepot").val(listedepot);
			}
			$(".fichedepot .zonetitre .titrepage .elcour").text(libDep);
			$(".fichedepot .zonetitre .titrepage .titre").text(titreDepot);
			$("#libagent").focus();
		};

		const ctrlSaisie = () => {
			codeDep = +$(".fichedepot #codedep").val();
			libDep = $.trim($(".fichedepot #libdep").val());
			codeVille = $(".fichedepot #listeville").val();
			listedepot = $(".fichedepot #listedepot").val();
			let errGeneral =
				codeVille == null ||
				libDep === "" ||
				codeVille === "" ||
				listedepot === "";
			$("#btnenr").prop("disabled", errGeneral);
		};

		const EnrData = () => {
			actionDB = codeDep == "" ? "CREATE" : "UPDATE";
			let dataDepot = {
				action: actionDB,
				codeDep,
				libDep,
				codeVille,
				listedepot,
			};
			let resRec = postData("/recDepot", dataDepot);
			refreshListe(+resRec.result);
		};

		//#endregion

		//#region events
		$(".fichedepot #btnannul, .closefiche").on("click", () => {
			$(".modalfiche").fadeOut(300);
		});

		$(".fichedepot").on("input", "input, select", () => {
			ctrlSaisie();
		});

		$(".fichedepot #btnenr").on("click", () => {
			EnrData();
		});

		//#endregion

		//#region events
		//#endregion

		//#region module

		afficheDataFiche();
		//#endregion
	});
});
