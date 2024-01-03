$(() => {
	$(() => {
		//#region Le svariables
		let actionDB = "";
		let codeCom, typeCom, codeCivilite, nomCom, prenomCom, telCom, emailCom;

		//#region Les fonctions

		const afficheDataFiche = async () => {
			appliMode();

			let dataFiche = infoFiche[0];
			if (dataFiche) {
				codeCom = ajoutZero(dataFiche.codecom, 2);
				typeCom = dataFiche.typecom;
				codeCivilite = dataFiche.codecivilite;
				nomCom = dataFiche.nomcom;
				prenomCom = dataFiche.prenomcom;
				telCom = dataFiche.telcom;
				emailCom = dataFiche.emailcom;
			}
			let titreCom = "Mise à jour du commercial";

			let nomPrenom = `${nomCom} ${prenomCom}`;
			if (!codeCom) {
				titreCom = "Création d'un commercial";
				nomPrenom = "";
			} else {
				$("#codecom").val(ajoutZero(codeCom, 3));
				$("#listetype").val(typeCom);
				$("#listecivilite").val(codeCivilite);
				$("#nomcom").val(nomCom);
				$("#prenomcom").val(prenomCom);
				$("#telcom").val(telCom);
				$("#emailcom").val(emailCom);
			}
			$(".fichecom .zonetitre .titrepage .titre").text(titreCom);
			$(".fichecom .zonetitre .titrepage .elcour").text(nomPrenom);
			$("#nomcom").focus();
		};

		const ctrlSaisie = () => {
			codeCom = +$("#codecom").val();
			typeCom = $.trim($("#listetype").val());
			codecivilite = $("#listecivilite").val();
			nomCom = $.trim($("#nomcom").val());
			prenomCom = $.trim($("#prenomcom").val());
			telCom = $("#telcom").val();
			emailCom = $.trim($("#emailcom").val());

			let errGeneral =
				codeCivilite == null ||
				nomCom === "" ||
				prenomCom === "" ||
				typeCom == null ||
				telCom === "";

			$("#btnenr").prop("disabled", errGeneral);
		};

		const EnrData = () => {
			actionDB = codeCom == "" ? "CREATE" : "UPDATE";
			let dataCom = {
				action: actionDB,
				codeCom: +codeCom,
				typeCom: typeCom,
				codeCivilite: codeCivilite,
				nomCom: nomCom,
				prenomCom: prenomCom,
				telCom: telCom,
				emailCom: emailCom,
			};
			let resRec = postData("/recCom", dataCom);
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
		};
		//#endregion

		//#region events
		$(".fiche #btnannul, .closefiche").on("click", () => {
			$(".modalfiche").fadeOut(300);
		});

		$(".fichecom").on("input", "input, select", () => {
			ctrlSaisie();
		});

		$(".fichecom #btnenr").on("click", () => {
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
