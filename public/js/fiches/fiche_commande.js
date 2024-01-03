$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeCommune, libCommune, codeVille;

	//#region Les fonctions

	const postData = (p_url, p_data, p_type = "json") => {
		var theResponse = "";
		$.ajax({
			url: p_url, // L'URL de votre route Node.js
			type: "post",
			async: false,
			data: JSON.stringify(p_data),
			dataType: p_type,
			contentType: "application/json", // Type de contenu de la requête
			success: function (result) {
				theResponse = result;
			},
			error: function (err) {
				// Gérez les erreurs ici
				console.error(err);
			},
		});
		return theResponse;
	};

	const afficheDataFiche = async () => {
		let listeVille = postData("/dataParam", { table: "table_ville" });
		MEFSelect("listeville", listeVille);
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
		codeCommune = $("#codecommune").val();
		libCommune = $.trim($("#libcommune").val()).toUpperCase();
		codeVille = $.trim($("#listeville").val());
		let errGeneral = libCommune == "" || codeVille == "";
		$("#btnenr").prop("disabled", errGeneral);
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
					valeur = ligne[chvaleur].toUpperCase();
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
					let menuSelected = $("#menuselected").val();
					let menu = $(`.menuitem[data-code='${menuSelected}']`);
					menu.removeClass("selected");
					menu.trigger("click");
				});
			}
		}
	});

	//#endregion

	//#region events
	//#endregion

	//#region commune
	let dataFiche = JSON.parse($("#cachefiche").val())[0];
	if (dataFiche) {
		libCommune = dataFiche.libcommune;
		codeCommune = dataFiche.codecommune;
		codeVille = dataFiche.codeville;
	}

	afficheDataFiche();
	//#endregion
});
