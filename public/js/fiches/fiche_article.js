$(() => {
	$(() => {
		//#region Le svariables
		let actionDB = "";
		let codeArt,
			libArt = "",
			puAchart = 0,
			puVentart = 0,
			imgArt = "";
		//#endregion
		//#region Les fonctions

		const afficheDataFiche = async () => {
			appliMode();
			let dataFiche = infoFiche[0];
			let titreArticle = "Création d'un article";
			if (dataFiche) {
				titreArticle = "Mise à jour de l'article ";
				codeArt = ajoutZero(dataFiche.codeart, 2);
				libArt = firstLetter(dataFiche.libart);
				puAchart = dataFiche.puachart;
				puVentart = dataFiche.puventart;
				imgArt = dataFiche.image;
				$(".fichearticle #codeart").val(codeArt);
				$(".fichearticle #libart").val(libArt);
				$(".fichearticle #puachart").val(puAchart);
				$(".fichearticle #puventart").val(puVentart);
				if (imgArt != "") {
					try {
						let image = `assets/images/${imgArt}`;
						$(".fichearticle #imgart").attr("src", image);
					} catch {}
				}
			}
			$(".fichearticle .zonetitre .titrepage .titre").text(titreArticle);
			$(".fichearticle .zonetitre .titrepage .elcour").text(libArt);
			$("#libart").focus();
		};

		const ctrlSaisie = () => {
			codeArt = +$(".fichearticle #codeart").val();
			libArt = $.trim($(".fichearticle #libart").val());
			puAchart = $(".fichearticle #puachart").val();
			puVentart = $(".fichearticle #puventart").val();
			let errGeneral = libArt === "" || puAchart == 0 || puVentart == 0;
			$("#btnenr").prop("disabled", errGeneral);
		};

		const EnrData = () => {
			actionDB = codeArt == "" ? "CREATE" : "UPDATE";
			let dataArticle = {
				action: actionDB,
				codeArt,
				libArt,
				puAchart,
				puVentart,
				imgArt,
			};
			let resRec = postData("/recArticle", dataArticle);
			refreshListe(+resRec.result);
			dataArticle = null;
		};

		//#endregion

		//#region events
		$(".fichearticle #btnannul, .closefiche").on("click", () => {
			$(".modalfiche").fadeOut(300);
		});

		$(".fichearticle").on("input", "input, select", () => {
			ctrlSaisie();
		});

		$(".fichearticle #btnenr").on("click", () => {
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
