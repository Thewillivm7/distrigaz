$(async () => {
	let bddAppli;

	//#region
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

	const initPage = () => {
		$(".configappli").find("input, select").val("");
	};
	const listeFichiers = async () => {
		let listeTmp = await $.get("/fichiers", async (data) => {
			return await data[0];
		});
		// let listePages = listeTmp.pages;
		let listeImages = listeTmp.images;
		MEFSelect("listeicone", listeImages);
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

	//#endregion

	//#region events
	$("#btnenrconfig").on("click", () => {
		let titreAppli = $.trim($("#titreaplli").val());
		let IconeAppli = $("#listeicone").val();
		let bddAppli = $("#bddappli").val();
		let menuConfig = $("#menuConfig").val();

		let tableMenu = $("#tablemenu").text();
		let tableModule = $("#tablemodule").text();
		let vueMenu = $("#vuemenu").text();
		let vueModule = $("#vuemodule").text();

		let objConfig = {
			titreappli: titreAppli,
			iconeappli: IconeAppli,
			bddappli: bddAppli,
			menuconfig: menuConfig,
			tablemenu: tableMenu,
			tablemodule: tableModule,
			vuemenu: vueMenu,
			vuemodule: vueModule,
		};
		let resAction = postData("/recConfig", { data: objConfig });
		if (resAction === 200) {
			window.location.replace("/accueil");
		}
	});
	//#region events
	$("#btndata").on("click", () => {
		let bddAppli = $("#bddappli").val();
		let result = postData("/dataAppli", { bddappli: bddAppli });
		if (result.res === 405) {
			alert("Base de données inexistante");
		} else {
			$("#tablemenu").text(result.tablemenu);
			$("#tablemodule").text(result.tablemodule);
			$("#vuemenu").text(result.vuemenu);
			$("#vuemodule").text(result.vuemodule);
		}
	});
	$("#btnvue").on("click", () => {
		let result = postData("/allViews");
		alert(result.res);
	});

	$("#listeicone").on("change", function () {
		let IconeAppli = $(this).val();
		$("#iconeappli").attr("src", `images/${IconeAppli}`);
	});
	$("#bddappli").on("input", function () {
		bddAppli = $.trim($(this).val());
		$("#btndata").prop("disabled", bddAppli === "");
	});

	//#endregion
	//#region module

	// kecture du fichier de configuration de l'appli
	let infoAppli = postData("/configAppli").result;
	await listeFichiers();
	if (infoAppli !== 0) {
		$("#titreappli").val(infoAppli.titreappli);
		$("#listeicone").val(infoAppli.iconeappli);
		if (infoAppli.iconeappli !== "") {
			let IconeAppli = infoAppli.iconeappli;
			$("#iconeappli").attr("src", `images/${IconeAppli}`);
		}
		$("#bddappli").val(infoAppli.bddappli);

		$("#tablemenu").text(infoAppli.tablemenu);
		$("#tablemodule").text(infoAppli.tablemodule);
		$("#vuemenu").text(infoAppli.vuemenu);
		$("#vuemodule").text(infoAppli.vuemodule);
	}
	//#endregion
});
