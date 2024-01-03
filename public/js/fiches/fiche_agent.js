$(() => {
	$(() => {
		//#region Le svariables
		let actionDB = "";
		let matrAgent,
			loginAgent,
			profilAgent,
			civiliteAgent,
			nomAgent,
			prenomAgent,
			depotAgent,
			fonctionAgent,
			dateEmb,
			dateNais,
			emailAgent,
			telAgent;

		//#region Les fonctions

		const afficheDataFiche = async () => {
			let tableProfil = listeTable("profil");
			let tableDepot = listeTable("depot");
			MEFSelect("listeprofil", tableProfil);
			MEFSelect("listedepot", tableDepot);
			appliMode();

			let dataFiche = infoFiche[0];
			if (dataFiche) {
				loginAgent = +ajoutZero(dataFiche.loginagent, 3);
				matrAgent = dataFiche.matragent;
				profilAgent = dataFiche.codeprofil;
				civiliteAgent = dataFiche.civiliteagent;
				nomAgent = dataFiche.nomagent;
				prenomAgent = dataFiche.prenomagent;
				depotAgent = dataFiche.codedepot;
				fonctionAgent = dataFiche.fonctionagent;
				dateEmb = dataFiche.dateemb;
				dateNais = dataFiche.datenais;
				emailAgent = dataFiche.emailagent;
				telAgent = dataFiche.telagent;
			}
			let titreAgent = "Mise à jour de l'agent ";
			let nomPrenom = `${nomAgent} ${prenomAgent}`;
			if (!loginAgent) {
				titreAgent = "Création d'un agent";
				nomPrenom = "";
			} else {
				dateNais = dateNais == null ? "" : dateNais.substring(0, 10);
				dateEmb = dateEmb == null ? "" : dateEmb.substring(0, 10);
				$("#loginagent").val(ajoutZero(loginAgent, 3));
				$("#matragent").val(matrAgent);
				$("#listeprofil").val(profilAgent);
				$("#listecivilite").val(civiliteAgent);
				$("#nomagent").val(nomAgent);
				$("#prenomagent").val(prenomAgent);
				$("#listedepot").val(depotAgent);
				$("#fonctionagent").val(fonctionAgent);
				$("#dateemb").val(dateEmb);
				$("#datenais").val(dateNais);
				$("#emailagent").val(emailAgent);
				$("#telagent").val(telAgent);
			}
			$(".ficheagent .zonetitre .titrepage .titre").text(titreAgent);
			$(".ficheagent .zonetitre .titrepage .elcour").text(nomPrenom);
			$("#libagent").focus();
		};

		const ctrlSaisie = () => {
			loginAgent = +$.trim($("#loginagent").val());

			profilAgent = $("#listeprofil").val();
			civiliteAgent = $("#listecivilite").val();
			nomAgent = $.trim($("#nomagent").val());
			prenomAgent = $.trim($("#prenomagent").val());
			depotAgent = $("#listedepot").val();
			dateEmb = $("#dateemb").val();
			emailAgent = $.trim($("#emailagent").val());

			matrAgent = $.trim($("#matragent").val());
			profilAgent = $.trim($("#listeprofil").val());
			civiliteAgent = $.trim($("#listecivilite").val());
			fonctionAgent = $.trim($("#fonctionagent").val());
			dateNais = $.trim($("#datenais").val());
			telAgent = $("#telagent").val();

			let errGeneral =
				profilAgent == null ||
				civiliteAgent == null ||
				nomAgent === "" ||
				prenomAgent === "" ||
				depotAgent == null ||
				dateEmb == "" ||
				emailAgent === "";

			$("#btnenr").prop("disabled", errGeneral);
		};

		const EnrData = () => {
			actionDB = loginAgent == "" ? "CREATE" : "UPDATE";
			let dataAgent = {
				action: actionDB,
				loginAgent: +loginAgent,
				matrAgent: matrAgent,
				profilAgent: profilAgent,
				civiliteAgent: civiliteAgent,
				nomAgent: nomAgent,
				prenomAgent: prenomAgent,
				depotAgent: depotAgent,
				fonctionAgent: fonctionAgent,
				dateEmb: dateEmb,
				dateNais: dateNais,
				emailAgent: emailAgent,
				telAgent: telAgent,
			};
			let resRec = postData("/recAgent", dataAgent);
			refreshListe(+resRec.result);
		};
		//#endregion

		//#region events
		$(".fiche #btnannul, .closefiche").on("click", () => {
			$(".modalfiche").fadeOut(300);
		});

		$(".ficheagent").on("input", "input, select", () => {
			ctrlSaisie();
		});

		$(".ficheagent #btnenr").on("click", () => {
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
