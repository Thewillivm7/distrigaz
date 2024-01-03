$(() => {
	//#region Le svariables
	let actionDB = "";
	let codeProfil,
		libProfil,
		tabMenuSel = [],
		v_ListeMenuDispo = $(".ficheprofil .listemenudispo"),
		v_ListeMenuProfil = $(".ficheprofil .listemenuprofil");

	//#region Les fonctions

	const afficheDataFiche = async () => {
		appliMode();
		let dataFiche = infoFiche[0];
		let titreProfil = "Mise à jour du profil ";
		if (dataFiche) {
			titreProfil = "Création d'un profil";
			codeProfil = ajoutZero(dataFiche.codeprofil, 2);
			libProfil = dataFiche.libprofil;
			$("#codeprofil").val(codeProfil);
			$("#libprofil").val(libProfil);
			let listeMenu = [];
			if (dataFiche.listemenu) listeMenu = dataFiche.listemenu.split(",");
			tabMenuSel = listeMenu;
			for (let index = 0; index < tabMenuSel.length; index++) {
				tabMenuSel[index] = ajoutZero(tabMenuSel[index], 3);
			}
		}
		$(".ficheprofil .zonetitre .titrepage .titre").text(titreProfil);
		$(".ficheprofil .zonetitre .titrepage .elcour").text(libProfil);
		$("#libprofil").focus();
	};

	const afficheListe = (p_tabliste, p_zone, p_icone, p_class) => {
		p_zone.empty();
		if (p_tabliste.length == 0) return;
		p_tabliste.sort((a, b) => a.codemenu - b.codemenu);
		p_tabliste.forEach((menu) => {
			let codeMenu = ajoutZero(menu.codemenu, 3);
			let indexSel = tabMenuSel.findIndex((menu) => menu === codeMenu);
			let statutMenu = indexSel >= 0 ? "selected" : "";
			let libMenu = menu.libmenu;
			let Str = `
                    <section class="xligmenu ${statutMenu}" data-code ="${menu.codemenu}">
                        <div class="coldata">${codeMenu} </div>
                        <div class="coldata">${libMenu}</div>
						<div class="${p_class}">${p_icone}</div>
                    </section>`;
			p_zone.append(Str);
		});
	};

	const ConfigListeMenuProfil = () => {
		let listeMenu = postData("/menuProfil");
		afficheListe(listeMenu, v_ListeMenuDispo, "&#10010;", "btnplus");
		afficheListe(listeMenu, v_ListeMenuProfil, "&#10005;", "btndel");
	};
	const ctrlSaisie = () => {
		codeProfil = +$("#codeprofil").val();
		libProfil = $.trim($("#libprofil").val()).toUpperCase();
		let errGeneral = libProfil == "";
		$("#btnenr").prop("disabled", errGeneral);
	};

	//#endregion

	//#region events
	$(".ficheprofil #btnannul, .closefiche").on("click", () => {
		$(".modalfiche").fadeOut(300);
	});

	$(".ficheprofil").on("input", "input, select", () => {
		ctrlSaisie();
	});

	$(".ficheprofil #btnenr").on("click", () => {
		tabMenuSel = [];
		$(".listemenuprofil")
			.find(".selected")
			.each((idx, el) => {
				tabMenuSel.push($(el).attr("data-code"));
			});
		listeMenu = tabMenuSel.join(",");
		actionDB = codeProfil == "" ? "CREATE" : "UPDATE";
		let dataProfil = {
			action: actionDB,
			codeProfil,
			libProfil,
			listeMenu: listeMenu,
		};
		let resRec = postData("/recProfil", dataProfil);
		refreshListe(+resRec.result);
	});

	$(".xlistemenu").on("click", ".btnplus", function () {
		let ligMenu = $(this).parent();
		let codeMenu = ligMenu.attr("data-code");
		$(".xlistemenu")
			.find(`.xligmenu[data-code='${codeMenu}']`)
			.addClass("selected");
		ctrlSaisie();
	});
	$(".xlistemenu").on("click", ".btndel", function () {
		let ligMenu = $(this).parent();
		let codeMenu = ligMenu.attr("data-code");
		$(".xlistemenu")
			.find(`.xligmenu[data-code='${codeMenu}']`)
			.removeClass("selected");
		ctrlSaisie();
	});
	$("#ajouttout").on("click", () => {
		$(".xligmenu").addClass("selected");
	});
	$("#supptout").on("click", () => {
		$(".xligmenu").removeClass("selected");
	});
	//#endregion

	//#region profil

	afficheDataFiche();
	ConfigListeMenuProfil();

	//#endregion
});
