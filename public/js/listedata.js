$(async () => {
	//#region
	let ficheMenu, tableLie, champCle, cleRech;
	let actionListe = dataMenu.listeaction;
	let tabAction = TAB_ACTION.filter((action) =>
		actionListe.includes(action.id),
	);
	//#endregion
	//#region Les fonctions
	//#region
	const afficheListeData = () => {
		tabCol = dataMenu.tabcol;
		let tabTmp = [];
		for (const col of tabCol) {
			tabTmp.push(col.largeur);
		}
		let ChampCle = dataMenu.champcle;
		$(".bodylist").empty();
		for (const row of dataListe) {
			const keys = Object.keys(row);
			let listCol = "";
			for (const key of keys) {
				let infoCol = tabCol.find((col) => col.champ === key);
				let AlignCol = infoCol ? infoCol.alignement : "";
				let valeurCol = key === champCle ? ajoutZero(row[key], 3) : row[key];
				let strCol = `  <div class="coldata" style="text-align:${AlignCol}">
									${valeurCol}
								</div>				`;
				listCol += strCol;
			}
			let listeAction = "";
			for (const actionCour of tabAction) {
				let strAction = `
				 <div class="action ${actionCour.id}" data-action="${actionCour.action}">
                    <img width="20px" src="assets/icones/iconeaction/${actionCour.icone}.png" alt="">
                </div>			`;
				listeAction += strAction;
			}
			let strRow = `<section class="datarow" data-code="${row[ChampCle]}" >
							${listCol}
							<section class="colaction">
								${listeAction}
							</section>
						  </section>`;
			$(".bodylist").append(strRow);
		}
		let actionGTC = 45 * tabAction.length;
		let rowGTC = tabTmp.join(" ") + ` ${actionGTC}px`;
		$(".datarow, .headlist").css("grid-template-columns", rowGTC);
	};

	//#endregion

	//#region events
	let ACTION;
	$(".listedata #filtredata").on("input", function () {
		let filtre = $.trim($(this).val().toLowerCase());
		$(".listedata #clearfilter").hide();
		if (filtre !== "") $(".listedata #clearfilter").show();
		$(".bodylist .datarow").show();
		$(".bodylist .datarow").each((idx, lig) => {
			let dataRow = $(lig);
			if (!dataRow.text().toLowerCase().includes(filtre)) {
				dataRow.hide();
			}
		});
	});
	$(".listedata #clearfilter").on("click", () => {
		$(".bodylist .datarow").show();
		$(".listedata #filtredata").val("");
		$(".listedata #clearfilter").hide();
	});

	$("#btnnew").on("click", () => {
		MODE_CONSULTATION = false;
		let data = {
			fiche: ficheMenu,
			table: tableLie,
			champcle: champCle,
			valeur: "",
		};
		$(".modalfiche").empty();
		let dataFiche = postData("/fiche", data, "html");
		$(".modalfiche").append(dataFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnedit", function (e) {
		MODE_CONSULTATION = false;
		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: ficheMenu,
			table: vueliste,
			champcle: champCle,
			valeur: cleRech,
		};
		$(".modalfiche .fiche").remove();
		let HTMLFiche = postData("/fiche", data, "html");
		$(".modalfiche").html(HTMLFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnconsult", function (e) {
		MODE_CONSULTATION = true;

		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: ficheMenu,
			table: vueliste,
			champcle: champCle,
			valeur: cleRech,
		};
		$(".modalfiche .fiche").remove();
		let HTMLFiche = postData("/fiche", data, "html");
		$(".modalfiche").html(HTMLFiche);
		$(".modalfiche").fadeIn(400);
	});
	$(".bodylist").on("click", ".btnprint", function (e) {
		MODE_CONSULTATION = true;

		if ($(this).hasClass("inactif")) return;
		let ligCour = $(this).parent().parent();
		cleRech = ligCour.attr("data-code");
		let data = {
			fiche: "docfacture",
			table: "vue_facture",
			champcle:"numfacture",
			valeur: cleRech,
		};
		let HTMLPrint = postData("/printFac", data, "html");
		$(".modalprint .zonepreview").empty();
		$(".modalprint .zonepreview").append(HTMLPrint);
		$(".modalprint").fadeIn(400);
	});



	$(".bodylist").on("click", ".btnsupp", function (e) {
		let ligCour = $(this).parent().parent();
		cleRech = ajoutZero(ligCour.attr("data-code"), 3);
		libData = ligCour.find(".coldata").eq(1).text();
		let titreConfirm = "Confirmation de désactivation";
		let messageConfirm = `Confirmez-vous la désactivation (O/N) ?`;
		let dataconfirm = `${cleRech} - ${libData}`;
		MEFConfirm(titreConfirm, messageConfirm, dataconfirm);
	});
	$(".bodylist").on("click", ".btnvalider", function (e) {
		let ligCour = $(this).parent().parent();
		cleRech = ajoutZero(ligCour.attr("data-code"), 3);
		libData = ligCour.find(".coldata").eq(1).text();
		let titreConfirm = "Confirmation de validation";
		let messageConfirm = `Confirmez-vous la validation (O/N) ?, cette action est irrversible !`;
		let dataconfirm = `${cleRech} - ${libData}`;
		MEFConfirm(titreConfirm, messageConfirm, dataconfirm);
		ACTION = "VALIDATION";
	});
	$(".bodylist").on("click", ".btnbat", function (e) {
		let ligCour = $(this).parent().parent();
		cleRech = ajoutZero(ligCour.attr("data-code"), 3);
		libData = ligCour.find(".coldata").eq(1).text();
		let titreConfirm = "Confirmation de validation";
		let messageConfirm = `Confirmez-vous la clôture (O/N) ?, cette action est irrversible !`;
		let dataconfirm = `${cleRech} - ${libData}`;
		MEFConfirm(titreConfirm, messageConfirm, dataconfirm);
		ACTION = "CLOTURE";
	});
	$(".confirmation .btnappli").on("click", function () {
		if ($(this).hasClass("btnnon")) {
			$(".confirmation .btnclose").trigger("click");
			return;
		}
		if (ACTION == "VALIDATION") {
			let dataRec = {
				action: ACTION,
				numinventaire: +cleRech,
				statutinventaire: "1",
			};

			let resRec = postData("/recInventaire", dataRec);
			$(".confirmation .btnclose").trigger("click");
		} else {
			if (ACTION == "CLOTURE") {
				let dataRec = {
					action: ACTION,
					numinventaire: +cleRech,
					statutinventaire: "2",
				};

				let resRec = postData("/recInventaire", dataRec);
				$(".confirmation .btnclose").trigger("click");
			}
		}
	});
	$(".confirmation .btnclose").on("click", () => {
		$(".modalconfirmation").fadeOut(300);
	});
	$(".closeliste").on("click", () => {
		$(".zonelistedata").fadeOut(300, () => {
			$(".zonelistedata").empty();
			$(".menuitem").removeClass("selected");
			$(".module").removeClass("selected");
		});
	});
	$(".bodylist").on("dblclick", ".datarow", function () {
		let btnCons = $(this).find(".btnconsult");
		btnCons.trigger("click");
	});
	//#endregion

	//#region princ
	afficheListeData();
	if (dataListe) {
		MEFDataListe(dataListe, $(".bodylist"));
	}
	ficheMenu = dataMenu.fichemenu;
	vueliste = dataMenu.vueliste;
	tableLie = dataMenu.tablemenu;
	champCle = dataMenu.champcle;
	tabParam = [];
	if (tableLie == "t_module") {
		$("#bodylist").sortable({
			cursor: "move",
			start: function (event, ui) {},
			update: function (event, ui) {
				let ordre = 1;
				let tabOrdre = [];
				$(".bodylist .datarow").each((idx, el) => {
					$(el).find(".coldata").eq(2).text(ordre);
					let moduleCour = $(el).attr("data-code");
					tabOrdre.push({ codeModule: moduleCour, ordreModule: ordre });
					ordre++;
				});

				let tabModule = postData("/moduleOrdre", { tabOrdre });
				tabModule.sort((a, b) => {
					if (a.ordremodule >= b.ordremodule) return 1;
					if (a.ordremodule < b.ordremodule) return -1;
				});
				// afficheMenu(tabModule);
			},
		});
	}

	//#endregion
});
