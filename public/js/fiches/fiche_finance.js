$(() => {
	//#region Le svariables
	let actionDB = "";
	let numOper,
		codeClient,
		libOper,
		dateOper,
		typeOper,
		montantOper,
		seuilCommande = 0;
	ficheFinance = $(".fichefinance");

	//#region Les fonctions

	const afficheDataFiche = () => {
		let tabTypeOpe = listeTable("typeoperation");
		appliMode();
		MEFSelect("listetype", tabTypeOpe);
		let titreFiche = "Création d'une opération financière";
		let dataFiche = infoFiche[0];
		if (dataFiche) {
			numOper = ajoutZero(dataFiche.numop, 2);
			let codeClient = ajoutZero(dataFiche.codeclient, 3);
			let dataFinClient = MEFFinanceClient(+codeClient);
			let soldeInitial = dataFinClient.soldeInitial;

			let totalMontant = dataFinClient.totalMontant;
			let totalPaiement = dataFinClient.totalPaiement;
			let totalAvoir = dataFinClient.totalAvoir;
			$(".fiche #soldeinit").text(millier(soldeInitial));
			$(".fiche #catotal").text(millier(Math.round(totalMontant)));
			$(".fiche #payetotal").text(millier(totalPaiement));
			$(".fiche #avoirtotal").text(millier(totalAvoir));
			let soldeClient = Math.round(
				+soldeInitial + totalMontant - (totalPaiement - totalAvoir),
			);

			$(".fiche #soldeclient").text(millier(soldeClient));
			let nomClient = dataFiche.nomclient;
			let client = `${codeClient} - ${nomClient}`;
			libOper = dataFiche.libop;
			dateOper = dataFiche.dateeng;
			typeOper = dataFiche.typeop;
			montantOper = millier(dataFiche.montant);
			$(".fiche #listeclient").text(client);
			$(".fichefinance #dateop").val(dateOper);
			$(".fichefinance #libop").val(libOper);
			$(".fichefinance #montant").val(montantOper);
			$(".fichefinance #listetype").val(typeOper);

			titreFiche = "Consultation d'une opération financière";
		} else {
			$(".fichefinance #dateop").val(Today());
			$(".fiche .infoerxt").val("");
		}
		$(".fichefinance .zonetitre .titrepage .titre").text(titreFiche);
		$(".fichefinance .zonetitre .titrepage .elcour").text(numOper);
	};

	const ctrlSaisie = () => {
		codeClient = $(".fiche #listeclient").attr("data-code");
		libOper = $.trim($(".fiche #libop").val());
		typeOper = $(".fiche #listetype").val();
		montantOper = $(".fiche #montant").val();
		dateOper = $(".fiche #dateop").val();
		let err = codeClient == "" || codeClient == undefined;
		libOper == "" || typeOper == null || typeOper == "";
		typeOper == "" || !isValidDate(dateOper);
		montantOper == "0" || montantOper == "";
		$(".fichefinance #btnenr").prop("disabled", err);
	};

	//#endregion

	//#region events
	$(".fiche #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".fiche #btnenr").on("click", () => {
		actionDB = "CREATE";
		montantOper = montantOper.replaceAll(" ", "");
		let dataFinance = {
			action: actionDB,
			codeClient,
			numOper,
			dateOper,
			libOper,
			montantOper,
			typeOper,
			userlogin: loginCour,
		};
		let resRec = postData("/recFinance", dataFinance);
		refreshListe(+resRec.result);
	});
	$(".fichefinance #montant").on("focus", function () {
		let valeur = $(this).val().replaceAll(" ", "");
		$(this).attr("type", "number").val(valeur).select();
	});
	$(".fichefinance #montant").on("blur", function () {
		let valeur = millier($(this).val());
		$(this).attr("type", "text").val(valeur);
	});
	$(".fiche #listeclient").on("change", function () {
		let codeClient = $(this).attr("data-code");
		let infoClient = tabClient.find((cli) => +cli.codeclient === +codeClient);
		if (infoClient) seuilCommande = infoClient.seuilclient;
		$(".fiche #seuilcommande").text(millier(seuilCommande));

		let dataFinClient = MEFFinanceClient(codeClient);
		let totalMontant = dataFinClient.totalMontant;
		let totalPaiement = dataFinClient.totalPaiement;
		let totalAvoir = dataFinClient.totalAvoir;
		let soldeInitial = dataFinClient.soldeInitial;
		$(".fiche #catotal").text(millier(Math.round(totalMontant)));
		$(".fiche #soldeinit").text(millier(soldeInitial));
		$(".fiche #payetotal").text(millier(totalPaiement));
		$(".fiche #avoirtotal").text(millier(totalAvoir));
		let soldeClient = Math.round(
			soldeInitial + totalMontant - (totalPaiement - totalAvoir),
		);
		$(".fiche #soldeclient").text(millier(soldeClient));
		ctrlSaisie();
	});
	$(".fichefinance").on("input paste", () => {
		ctrlSaisie();
	});
	//#endregion

	//#region events
	//#endregion

	//#region commune

	afficheDataFiche();
	let tabClient = postData("/listeTable", { table: "vue_client" });

	$("#listeclient").cs_custom(ficheFinance, tabClient, true, true);

	//#endregion
});
