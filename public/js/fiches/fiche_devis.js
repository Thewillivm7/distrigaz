$(() => {
	//#region Les variables
	let tvaDevis,
		tabArticle = listeTable("article"),
		tabClient = listeTable("client"),
		numDevis,
		dateDevis,
		nomClient,
		devisCour,
		statutDevis,
		objetDevis,
		ligCour,
		tabDetDevis,
		codeClient,
		majFiche;

	//#endregion
	//#region Les fonctions

	const EnteteDevisOk = () => {
		codeClient = $(".fichedevis #listeclient").attr("data-code");
		codeClient = codeClient == undefined ? "" : codeClient;
		dateDevis = $("#datedevis").val();
		objetDevis = $.trim($("#objetdevis").val());
		return (
			codeClient !== "" &&
			codeClient !== undefined &&
			dateDevis !== "" &&
			objetDevis !== "" &&
			isValidDate(dateDevis)
		);
	};
	const LigOk = (p_ligcour) => {
		let codeArt = $.trim(p_ligcour.find(".article").attr("data-code"));
		let descArt = $.trim(p_ligcour.find(".descart").val());
		let qteArt = +p_ligcour.find(".qteart").val();
		return (
			codeArt !== "" &&
			codeArt !== null &&
			descArt !== "" &&
			qteArt !== 0 &&
			!isNaN(qteArt)
		);
	};
	const DetailDevisOK = () => {
		let detailDevis = $(".fichedevis .listearticle .ligdata");
		let nbLigne = detailDevis.length;
		$(".fichedevis #totallig").text(nbLigne);
		if (detailDevis.length === 0) return false;
		let OK = true;
		detailDevis.each(function (idx, el) {
			let ligCour = $(el);
			if (!LigOk(ligCour)) {
				OK = false;
			}
		});
		return OK;
	};

	const CtrlSaisie = () => {
		let enteteOk = EnteteDevisOk();
		let detailOk = DetailDevisOK();
		let v_ErreurSaisie = !enteteOk || !detailOk;
		$(".fichedevis #btnenr").prop("disabled", v_ErreurSaisie);
		return v_ErreurSaisie;
	};

	const AfficheEntDevis = () => {
		appliMode();
		devisCour = infoFiche[0];
		if (MODE_CONSULTATION) {
			$(".newart").remove();
		}
		if (devisCour) {
			numDevis = ajoutZero(devisCour.numdevis, 4);
			nomClient = devisCour.nomclient;
			dateDevis = devisCour.datedevis;
			objetDevis = devisCour.objetdevis;
			tvaDevis = devisCour.tvadevis;
			statutDevis = +devisCour.statutdevis;
			tabDetDevis = JSON.parse(devisCour.detdevis.replace(/\n/g, ""));
			if (statutDevis === 0) $(".zonenumdevis").addClass("actif");
			$(".fichedevis #numdevis").text(numDevis);
			$(".fichedevis #objetdevis").val(objetDevis);
			$(".fichedevis #datedevis").val(dateDevis);

			$(".fichedevis #listeclient")
				.text(nomClient)
				.addClass("inactif")
				.removeClass("actif");
			$(".fichedevis #listeclient")
				.text(nomClient)
				.attr("data-code", devisCour.codeclient);

			$(".fichedevis #tvacb").prop("checked", tvaDevis == "1");
		} else {
			$(".fichedevis #datedevis").val(Today());
		}
	};
	const AfficheDetDevis = () => {
		if (devisCour) {
			$(".fichedevis .listearticle").empty();

			numLig = 0;
			tabDetDevis.forEach((detail) => {
				let infoArt = tabArticle.find(
					(art) => +art.codeart === +detail.codeart,
				);
				let libArt = infoArt ? firstLetter(infoArt.libart) : "";
				let descArt = detail.descart;
				let qteArt = detail.qteart;
				let puArt = detail.puart;
				let newLine = $(".ligmodele").clone();

				newLine.find(".article").attr("data-code", detail.codeart);
				numLig++;

				newLine.find(".colnum").text(numLig);
				let v_Id = "article" + numLig;
				newLine.find(".article").prop("id", v_Id);
				newLine.appendTo($(".fichedevis .listearticle"));

				newLine.removeClass("ligmodele").show();
				newLine.show();
				newLine.find(".qteart").val(qteArt);
				newLine.find(".descart").val(descArt);
				newLine.find(".puart").val(puArt);
				let v_Pas = detail.pas;
				newLine.addClass("lig" + numLig);
				newLine.find(".qteart").attr("min", v_Pas);
				newLine.find(".qteart").attr("step", v_Pas);

				selectFiltre("#" + v_Id, tabArticle, "codeart", "libart", "descart");

				newLine.find(".article .ms_val").text(libArt);

				CalculMontant(newLine);
			});
		}
		appliMode();
	};
	const AfficheDevis = () => {
		// Affichage de l'entête devis
		AfficheEntDevis();
		// Affichage du détail devis
		AfficheDetDevis();
		CalculGlobal();
		$(".fichedevis").fadeIn(300);
	};

	const AjoutLigArt = () => {
		let lignes = $(".fichedevis .listearticle .ligdata");
		let libArt = "",
			qteArt = 0;
		if (lignes.length > 0) {
			let indexDern = lignes.length - 1;
			libArt = lignes.eq(indexDern).find(".article .ms_val").text();
			qteArt = $.trim(lignes.eq(indexDern).find(".qteart").val());
			if (libArt === "" || qteArt === "" || qteArt === "0") return;
		}
		let numLig = lignes.length;

		numLig++;
		let newLine = $(".ligmodele").clone();
		newLine.appendTo($(".fichedevis .listearticle"));
		newLine.removeClass("ligmodele").show();
		let v_Id = "article" + numLig;
		newLine.find(".article").prop("id", v_Id);

		let artCour = $("#" + v_Id);
		newLine.find(".colnum").text(numLig);
		artCour.addClass("actif");
		artCour.show();
		selectFiltre("#" + v_Id, tabArticle, "codeart", "libart", "descart");
		CtrlSaisie();
	};

	const SuppLigArt = (p_NumLig) => {
		lignes = $(".fichedevis .listearticle .ligdata");
		lignes.eq(p_NumLig).remove();
		lignes = $(".fichedevis .listearticle .ligdata");
		let v_Cpt = 1;
		lignes.each(function () {
			v_lig = $(this);
			v_lig.find(".colnum").text(v_Cpt);
			v_Cpt++;
		});
		CalculGlobal();
	};

	const CalculMontant = (p_ligcour) => {
		let qteArt =
			$.trim(p_ligcour.find(".qteart").val()) == ""
				? "0"
				: parseInt(p_ligcour.find(".qteart").val());
		let puArt =
			$.trim(p_ligcour.find(".puart").val()) == ""
				? "0"
				: parseInt(p_ligcour.find(".puart").val());
		let v_Montant = qteArt * puArt;
		p_ligcour.find(".montantht").text(millier(v_Montant));
		CalculGlobal();
	};
	const CalculGlobal = () => {
		let lignes = $(".fichedevis .listearticle .ligdata");
		let v_HTTot = 0;
		let v_TVATotal = 0;
		let v_NetTot = 0;
		lignes.each(function () {
			ligCour = $(this);
			let v_ChHT = ligCour.find(".montantht").text().replaceAll(" ", "");
			let v_MontHT = parseInt(v_ChHT);
			let v_MtTVA = $("#tvacb").prop("checked") ? (v_MontHT * 18) / 100 : 0;
			v_TVATotal += v_MtTVA;
			v_HTTot += v_MontHT;
		});
		v_TVATotal = Math.round(v_TVATotal);
		v_NetTot = v_HTTot + Math.round(v_TVATotal);
		$(".fichedevis #totallig").text(lignes.length);
		$(".fichedevis #totalht").text(millier(v_HTTot));
		$(".fichedevis #totaltva").text(millier(v_TVATotal));
		$(".fichedevis #totalttc").text(millier(v_NetTot));
	};
	const EnrDevis = () => {
		// Enregistrement de l'entête
		if (CtrlSaisie()) {
			alert(
				"Les données saisies ne sont pas correctes, enregistrement annulé !",
			);
			return;
		}
		let v_TVA = $("#tvacb").prop("checked") ? "1" : "0";
		// Récupération des lignes détail du devis
		let tabDetDevis = [];
		let v_LigDetail = $(".fichedevis .listearticle .ligdata");
		numDevis = $.trim($(".fichedevis #numdevis").text());
		v_LigDetail.each(function () {
			let v_CodeArt = $(this).find(".article").attr("data-code");
			let qteArt = $(this).find(".qteart").val();
			let puArt = $(this).find(".puart").val();
			let descArt = $(this).find(".descart").val();
			tabDetDevis.push({
				codeart: v_CodeArt,
				puart: +puArt,
				qteart: +qteArt,
				descart: descArt,
			});
		});
		if (numDevis === "") statutDevis = 0;
		actionDevis = numDevis === "" ? "CREATE" : "UPDATE";
		let dataRec = {
			action: actionDevis,
			numdevis: +numDevis,
			codeclient: codeClient,
			objetdevis: objetDevis,
			statutdevis: statutDevis,
			tvadevis: v_TVA,
			datedevis: dateDevis,
			detdevis: tabDetDevis,
			userlogin: loginCour,
		};

		let resRec = postData("/recDevis", dataRec);
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
	const ModulePrincipal = () => {
		selectFiltre("#listeclient", tabClient, "codeclient", "nomclient");
		$Move($(".newart"), $(".newart .titre")).activeMove();
		AfficheDevis();
	};

	//#endregion
	//#region Les évènements
	$("#btnnewart").on("click", (e) => {
		e.stopPropagation();
		AjoutLigArt();
	});
	//#region les controles
	$(".fichedevis").on("change", " #listeclient, .article", () => {
		CtrlSaisie();
	});
	$(".fichedevis").on("change", ".article", function () {
		$(this).parent().find(".descart").val($(this).attr("data-desc"));
		CtrlSaisie();
	});
	$(".fichedevis .listearticle").on("click", ".btnsuppart", function () {
		let numLigCour = $(this).parent().parent().index();
		SuppLigArt(numLigCour);
		CtrlSaisie();
	});

	$(".fichedevis #tvacb").on("change", () => {
		CalculGlobal();
		CtrlSaisie();
	});
	$(".fichedevis #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$(".fichedevis #btnenr").on("click", () => {
		EnrDevis();
	});
	$(".fichedevis .listearticle").on(
		"change paste keyup",
		".qteart, .puart",
		function () {
			let v_LigCour = $(this).parent().parent();
			CalculMontant(v_LigCour);
			CtrlSaisie();
		},
	);
	$(".fichedevis").on("input change paste", "input, textarea", () => {
		CtrlSaisie();
	});
	//#endregion
	//#region Le module principal
	ModulePrincipal();
	//#endregion
});
