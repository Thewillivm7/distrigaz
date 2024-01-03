$(() => {
	//#region Les variables
	let tabTypeClient = listeTable("typeclient"),
		tabCategClient = listeTable("categclient"),
		tabCommune = listeTable("commune"),
		tabCom = listeTable("commercial");
	let codeClient,
		categClient,
		typeClient,
		nomClient,
		telClient,
		seuilClient,
		emailClient,
		depotClient;

	//#endregion
	//#region Les fonctions

	const CtrlSaisie = () => {
		let enteteOk = EnteteDevisOk();
		let detailOk = DetailDevisOK();
		let v_ErreurSaisie = !enteteOk || !detailOk;
		$(".ficheclient #btnenr").prop("disabled", v_ErreurSaisie);
		return v_ErreurSaisie;
	};

	const AfficheClient = () => {
		let tabDepot = postData("/listeTable", { table: "table_depot" });
		MEFSelect("listedepot", tabDepot);
		let dataFiche = infoFiche[0];
		let titreClient = "Création d'un client";
		$(".ficheclient").find("input, select").val("");
		$(".ficheclient").find("infoext").text("");
		if (dataFiche) {
			titreClient = "Mise à jour du client ";
			codeClient = ajoutZero(dataFiche.codeclient, 2);
			nomClient = dataFiche.nomclient;
			telClient = dataFiche.telclient;
			categClient = dataFiche.codecategclient;
			typeClient = dataFiche.codetypeclient;
			seuilClient = dataFiche.seuilclient;
			emailClient = dataFiche.emailclient;
			depotClient = dataFiche.codedepot;
			$("#codeclient").val(codeClient);
			$("#listetype").val(typeClient);
			$("#listecateg").val(categClient);
			$("#seuilclient").val(seuilClient);

			$("#nomclient").val(nomClient);
			$("#telclient").val(telClient);
			$("#emailclient").val(emailClient);
			$("#listedepot").val(depotClient);
			let dataFinClient = MEFFinanceClient(codeClient);
			let totalMontant = dataFinClient.totalMontant;
			let totalPaiement = dataFinClient.totalPaiement;
			let totalAvoir = dataFinClient.totalAvoir;
			let soldeInitial = dataFinClient.soldeInitial;
			$(".fiche #caclient").text(millier(Math.round(totalMontant)));
			$(".fiche #totalpaiement").text(millier(totalPaiement));
			$(".fiche #totalavoir").text(millier(totalAvoir));
			$(".fiche #soldeinit").text(millier(soldeInitial));
			let soldeClient = Math.round(
				+soldeInitial + totalMontant - (totalPaiement - totalAvoir),
			);
			$(".fiche #soldeclient").text(millier(soldeClient));
		}
		$(".ficheclient .zonetitre .titrepage .titre").text(titreClient);
		$(".ficheclient .zonetitre .titrepage .elcour").text(nomClient);

		$("#libclient").focus();
		$(".ficheclient").fadeIn(300);
	};

	const EnrClient = () => {
		MEFSelect("listetypeclient", tabTypeClient);
		MEFSelect("categclient", tabCategClient);
		MEFSelect("client", tabClient);
		if (CtrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		let v_TVA = $("#tvacb").prop("checked") ? "1" : "0";
		// Récupération des lignes détail du devis
		let tabDetDevis = [];
		let v_LigDetail = $(".ficheclient .listearticle .ligdata");
		numDevis = $.trim($(".ficheclient #numdevis").text());
		v_LigDetail.each(function () {
			let v_CodeArt = $(this).find(".article").attr("data-value");
			let qteArt = $(this).find(".qteart").val();
			let puArt = $(this).find(".puart").val();
			let descArt = $(this).find(".descart").val();
			tabDetDevis.push({
				codeart: v_CodeArt,
				puart: puArt,
				qteart: qteArt,
				descart: descArt,
			});
		});
		if (numDevis === "") statutDevis = 0;
		actionDevis = numDevis === "" ? "CREATE" : "UPDATE";
		let v_Data = {
			action: actionDevis,
			numdevis: numDevis,
			codeclient: codeClient,
			objetdevis: objetDevis,
			statutdevis: statutDevis,
			tvadevis: v_TVA,
			datedevis: dateDevis,
			detdevis: tabDetDevis,
			userlogin: infoFiche.userlogin,
		};
		let resRec = postData("/recDevis", v_Data);
		refreshListe(+resRec.result);
	};
	const ModulePrincipal = () => {
		MEFSelect("listetype", tabTypeClient);
		AfficheClient();
	};

	//#endregion
	//#region Les évènements

	$(".ficheclient #listecommune").on("change", () => {
		let commune = $(".ficheclient #listecommune option:selected");
		let ville = commune.attr("data-ville");
		$(".ficheclient #ville").text(ville);
	});

	//#region les controles

	$(".ficheclient #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	//#endregion
	//#region Le module principal
	ModulePrincipal();
	//#endregion
});
