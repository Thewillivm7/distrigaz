$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeMenu,
		libMenu,
		codeModule,
		titrePage,
		texteNew,
		tableMenu,
		vueListe,
		champCle,
		largeurPage,
		hauteurPage,
		listeAction,
		infoCol,
		iconeMenu,
		ficheMenu,
		typeMenu;

	//#region Les fonctions
	const listeFichiers = async () => {
		let listeTmp = await $.get("/fichiers", async (data) => {
			return await data[0];
		});
		let listeIcones = listeTmp.icones;
		let listeFiches = listeTmp.fiches.filter((fiche) => fiche.includes("_"));

		MEFSelect("listeicone", listeIcones);
		MEFSelect("listefiche", listeFiches);
	};
	const listedataDB = async () => {
		let listeTmp = await $.get("/dataDB", async (data) => {
			return await data[0];
		});
		// let listePages = listeTmp.pages;

		let listeModule = listeTmp.modules;
		let listeTable = listeTmp.tables;
		let listeVue = listeTmp.vues;
		MEFSelect("listemodule", listeModule);
		MEFSelect("listetable", listeTable);
		MEFSelect("listevue", listeVue);
	};

	const MEFListeChamp = (p_table) => {
		let tabCol = postData("/listecol", { table: p_table });
		champCle = tabCol[0]["Field"];
		$(".fichemenu #champcle").val(champCle);

		let tabColChoisi;
		if (infoCol && infoCol.length > 0)
			tabColChoisi = JSON.parse(JSON.stringify(infoCol));
		if (typeof tabColChoisi == "string")
			tabColChoisi = JSON.parse(tabColChoisi);
		let listeChTable = $(".zonetabchamp .detailtab");
		listeChTable.empty();
		let $i = 0;
		tabCol.forEach((el) => {
			let champCol = el.Field;
			let enteteCol = champCol == champCle ? "Code" : champCol;
			let largeurCol = champCol == champCle ? "100px" : "1fr";
			let alignementCol = "left";
			let statutChamp = "";
			if (tabColChoisi) {
				let detailCol = tabColChoisi.find((col) => col.champ === champCol);
				if (detailCol) {
					enteteCol = detailCol.entete;
					largeurCol = detailCol.largeur;
					alignementCol = detailCol.alignement;
					statutChamp = "checked";
				}
			}
			let strCh = `<section class="ligch ligch${$i}">
                                <div class="colch "><input class="chsel" type="checkbox" ${statutChamp}></div>    
                                <div class="colch champ">${champCol}</div>
                                <div class="colch">
                                   <input type="text" class="entete" value="${enteteCol}">
                                </div>
                                <div class="colch">
                                    <input type="text" class="largeur" value="${largeurCol}">
                                </div>
                                <div class="colch">
									 <select name="" id=""  class="alignement">
										<option value="left">Gauche</option>
										<option value="center">Centre</option>
										<option value="right">Droite</option>
									</select>
                                </div>
                            </section>
						`;
			listeChTable.append(strCh);
			$(".fichemenu .ligch" + $i)
				.find(".alignement")
				.val(alignementCol);
			$i++;
		});
	};

	const afficheDataFiche = async () => {
		await afficheAction();
		await listeFichiers();
		await listedataDB();
		let titreMenu = "Mise à jour du menu";

		if (!libMenu) {
			titreMenu = "Création de menu";
			$(".fichemenu #typeparam").prop("checked", true);
			$(".fichemenu #pageheight").val("auto");
			$(".fichemenu #listeaction").val("delete,edit");
			libMenu = "";
		} else {
			$(".fichemenu #codemenu").val(codeMenu);
			$(".fichemenu #libmenu").val(libMenu);
			$(".fichemenu #titrepage").val(titrePage);
			$(".fichemenu #textenew").val(texteNew);
			$(".fichemenu #pagewidth").val(largeurPage);
			$(".fichemenu #pageheight").val(hauteurPage);
			$(".fichemenu .actionliste").prop("checked", false);
			let tabActionMenu = listeAction.split(",");
			for (const action of tabActionMenu) {
				let btnAction = $(".zoneaction").find("#" + action);
				btnAction.prop("checked", true);
			}
			$(".fichemenu #champcle").val(champCle);
			$(".fichemenu #listetable").val(tableMenu);
			$(".fichemenu #listemodule").val(codeModule);
			$(".fichemenu #listefiche").val(ficheMenu);
			$(".fichemenu #listeicone").val(iconeMenu);
			if (+typeMenu === 0) {
				$(".fichemenu #typeparam").prop("checked", true);
				$(".fichemenu #listevue").val(vueListe);
				MEFListeChamp(vueListe);
			} else {
				$(".fichemenu #typeautre").prop("checked", true);
			}

			$(".fichemenu .zoneliste")
				.find("select, input")
				.prop("disabled", +typeMenu === 1);
		}
		$('.fichemenu input[name="typepage"]').trigger("change");
		$(".fichemenu .zonetitre .titrepage .titre").text(titreMenu);
		$(".fichemenu .zonetitre .titrepage .menucour").text(libMenu);
		$("#libmenu").focus();
	};

	const afficheAction = async () => {
		$(".fichemenu .zoneaction").empty();
		for (const action of TAB_ACTION) {
			let strAction = `
				<div class="action">
					<input type="checkbox" class="actionliste" id= "${action.id}">
					<img src="assets/icones/iconeaction/${action.icone}.png">
					<label>${action.action}</label>
				</div>`;
			$(".fichemenu .zoneaction").append(strAction);
		}
	};
	const ctrlSaisie = () => {
		codeMenu = $(".fichemenu #codemenu").val();
		libMenu = $.trim($(".fichemenu #libmenu").val());
		codeModule = $.trim($(".fichemenu #listemodule").val());
		texteNew = $.trim($(".fichemenu #textenew").val());
		titrePage = $.trim($(".fichemenu #titrepage").val());
		largeurPage = $.trim($(".fichemenu #pagewidth").val());
		hauteurPage = $.trim($(".fichemenu #pageheight").val());
		let tabAction = [];
		$(".fichemenu .actionliste").each((idx, el) => {
			if ($(el).is(":checked")) {
				tabAction.push($(el).prop("id"));
			}
		});
		listeAction = tabAction.join(",");
		ficheMenu = $(".fichemenu #listefiche").val();
		iconeMenu = $(".fichemenu #listeicone").val();
		tableMenu = $(".fichemenu #listetable").val();
		champCle = $.trim($(".fichemenu #champcle").val());
		tableMenu = $.trim($(".fichemenu #listetable").val());
		VueListe = "";
		if (typeMenu === 0) {
			vueListe = $(".fichemenu #listevue").val();
			infoCol = [];
			$(".fichemenu .ligch").each((idx, col) => {
				let isSelected = $(col).find(".chsel").prop("checked");
				if (isSelected) {
					let valChamp = $(col).find(".champ").text();
					let valEntete = $(col).find(".entete").val();
					let valLargeur = $(col).find(".largeur").val();
					let valAlignement = $(col).find(".alignement").val();
					let info = {
						champ: valChamp,
						entete: valEntete,
						largeur: valLargeur,
						alignement: valAlignement,
					};
					infoCol.push(info);
				}
			});
		}
		let errGeneral = libMenu == "" || titrePage == "" || ficheMenu == "";
		let errParam =
			+typeMenu === 1
				? false
				: vueListe == "" || champCle == "" || largeurPage == "";
		$(".fichemenu #btnenr").prop("disabled", errGeneral || errParam);
	};

	//#endregion

	//#region events
	$(".fichemenu #togglebtn").on("change", function () {
		let toggleBtnStatus = $("#togglebtn").prop("checked");
		$(".ligch").each((idx, lig) => {
			$(lig).find("input[type='checkbox']").prop("checked", toggleBtnStatus);
		});
	});
	$(".fichemenu #listevue").on("change", function () {
		vueListe = $(this).val();
		MEFListeChamp(vueListe);
	});
	$(".fichemenu #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});
	$('.fichemenu input[name="typepage"]').on("change", function () {
		let elSelected = $("input[name='typepage']:checked").val();
		$(".fichemenu .detailtab").show();
		typeMenu = +elSelected;
		$(".fichemenu .zoneliste").find("label").addClass("requis");
		if (+elSelected === 1) {
			$(".detailtab").hide();
			$(".zoneliste").find("label").removeClass("requis");
		}
		$(".fichemenu .zoneaction").find("label, #labelnew").removeClass("requis");
		$(".fichemenu .zoneliste")
			.find("input, select")
			.prop("disabled", typeMenu === 1);
		ctrlSaisie();
	});

	$(".fichemenu").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".fichemenu #btnenr").on("click", () => {
		actionDB = codeMenu == "" ? "CREATE" : "UPDATE";
		let tabCol = JSON.stringify(infoCol);
		let dataMenuRec = {
			action: actionDB,
			codeMenu,
			libMenu,
			codeModule,
			titrePage,
			texteNew,
			tableMenu,
			vueListe,
			champCle,
			largeurPage,
			hauteurPage,
			infoCol: tabCol,
			listeAction,
			iconeMenu,
			ficheMenu,
			typeMenu,
		};
		let resRec = postData("/recMenu", dataMenuRec);
		if (+resRec.result > 0) {
			let newMenuList = postData("/refresh");
			afficheMenuVert(".accueil", newMenuList);
			afficheMenuHoriz(".accueil", newMenuList);
		}
		refreshListe(+resRec.result);
	});
	//#endregion

	//#region events
	//#endregion

	//#region module
	let dataFiche = infoFiche[0];
	if (dataFiche) {
		codeMenu = dataFiche.codemenu;
		libMenu = dataFiche.libmenu;
		codeModule = dataFiche.codemodule;
		texteNew = dataFiche.textenew;
		titrePage = dataFiche.titrepage;
		vueListe = dataFiche.vueliste;
		tableMenu = dataFiche.tablemenu;
		champCle = dataFiche.champcle;
		largeurPage = dataFiche.largeurpage;
		hauteurPage = dataFiche.hauteurpage;
		infoCol = dataFiche.infocol;
		iconeMenu = dataFiche.iconemenu;
		ficheMenu = dataFiche.fichemenu;
		typeMenu = +dataFiche.typemenu;
		listeAction = dataFiche.listeaction;
	}
	afficheDataFiche();
	//#endregion
});
