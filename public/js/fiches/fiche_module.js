$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeModule, libModule, iconeModule;

	//#region Les fonctions

	const listeFichiers = async () => {
		let listeTmp = await $.get("/fichiers", async (data) => {
			return await data[0];
		});
		// let listePages = listeTmp.pages;
		let listeIcones = listeTmp.icones;
		MEFSelect("listeicone", listeIcones);
	};

	const MEFSelect = (p_zone, p_liste, p_init) => {
		let zoneSelect = $("#" + p_zone);
		zoneSelect.empty();
		if (p_init) {
			let strInit = `<option value ="${p_init}">${p_init}</option>`;
			zoneSelect.append(strInit);
		}
		if (p_liste) {
			let keys = Object.keys(p_liste[0]);
			let estTable = isNaN(+keys[0]);
			let chCle, chvaleur;
			if (estTable) {
				chCle = keys[0];
				chvaleur = keys[1];
				if (keys.length == 1) chvaleur = chCle;
			}
			for (const ligne of p_liste) {
				let cle, valeur;
				if (estTable) {
					cle = ligne[chCle];
					valeur = ligne[chvaleur];
				} else {
					cle = ligne;
					valeur = ligne;
				}

				let strOption = `<option value="${cle}">${valeur}</option>`;
				zoneSelect.append(strOption);
			}
		}
		zoneSelect.val("");
	};
	const afficheDataFiche = async () => {
		await listeFichiers();
		let titreModule = "Mise à jour du module ";
		if (!libModule) {
			titreModule = "Création de module";
			libModule = "";
		} else {
			$("#codemodule").val(codeModule);
			$("#libmodule").val(libModule);
			$("#listeicone").val(iconeModule);
			if (iconeModule != "") {
				$("#iconemodule").attr("src", `assets/icones/iconemenu/${iconeModule}`);
			}
		}
		$(".fichemodule .zonetitre .titrepage .titre").text(titreModule);
		$(".fichemodule .zonetitre .titrepage .elcour").text(libModule);
		$("#libmodule").focus();
	};

	const ctrlSaisie = () => {
		codeModule = $("#codemodule").val();
		libModule = $.trim($("#libmodule").val());
		iconeModule = $.trim($("#listeicone").val());
		let errGeneral = libModule == "";
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

	$(".fichemodule").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = codeModule == "" ? "CREATE" : "UPDATE";
		let dataModule = {
			action: actionDB,
			codeModule,
			libModule,
			iconeModule,
		};
		let resRec = postData("/recModule", dataModule);
		if (+resRec.result > 0) {
			let newMenuList = postData("/refresh");
			afficheMenuVert(".accueil", newMenuList);
			afficheMenuHoriz(".accueil", newMenuList);
		}
		refreshListe(+resRec.result);
	});

	$("#listeicone").on("change", function () {
		let icone = $(this).val();
		$("#iconemodule").attr("src", `assets/icones/iconemenu/${icone}`);
	});
	//#endregion

	//#region events
	//#endregion

	//#region module
	let dataFiche = JSON.parse($("#cachefiche").val())[0];

	if (dataFiche) {
		libModule = dataFiche.libmodule;
		codeModule = dataFiche.codemodule;
		iconeModule = dataFiche.iconemodule;
	}
	afficheDataFiche();
	//#endregion
});
