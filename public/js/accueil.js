$(async () => {
	await $.getScript("appliUtils.js");
	//#region events

	$(".zonemenu_vert").on("click", ".module", function () {
		var listeMenu = $(this).next(".listemenu");
		let isActif = $(this).hasClass("actif");
		$(".zonemenu_vert .module").removeClass("actif");
		$(".zonemenu_vert .listemenu").slideUp(500);
		if (!isActif) $(this).addClass("actif");
		if (listeMenu.is(":visible")) {
			listeMenu.slideUp(500);
		} else {
			listeMenu.slideDown(500);
		}
	});
	$(".zonemenu_vert, .zonemenu_horiz").on(
		"click",
		".listemenu .menuitem",
		function () {
			if ($(this).hasClass("selected")) return;
			$(".module").removeClass("selected");
			let module = $(this).parent().parent().find(".module");
			module.addClass("selected");
			$(".menuitem").removeClass("selected");
			$(this).addClass("selected");
			let codeMenu = $(this).attr("data-code");
			menuSelected = codeMenu;
			$(".zonelistedata").empty();
			if (codeMenu) {
				let listeData = postData("/execMenu", { codemenu: codeMenu }, "html");
				$(".zonelistedata").fadeOut(300, () => {
					$(".zonelistedata").append(listeData);
					setTimeout(() => {
						$(".zonelistedata").fadeIn(500);
					}, 100);
				});
			}
			$(".configtheme").removeClass("actif");
		},
	);

	$(".settings").on("click", (e) => {
		e.stopPropagation();
		$(".configtheme").toggleClass("actif");
	});
	$(".accueil").on("click", (e) => {
		$(".configtheme").removeClass("actif");
	});
	$(".closetheme").on("click", () => {
		$(".configtheme").removeClass("actif");
	});
	$(".btnham").on("click", (e) => {
		e.stopPropagation();
		$(".btnham, .zonemenu").toggleClass("actif");
	});
	$(".zonecompte").on("click", (e) => {
		$(".infocompte").toggleClass("actif");
		e.stopPropagation();
	});
	$(".infocompte").on("click", (e) => {
		e.stopPropagation();
	});

	$(document).on("click", () => {
		$(".infocompte").removeClass("actif");
		$(".btnham, .zonemenu").removeClass("actif");
	});

	$(".btntypeodp").on("click", function () {
		$(".btntypeodp").removeClass("actif");
		$(this).addClass("actif");
	});
	$(".toggleodp").on("click", () => {
		$(".zonemain, .toggleodp").toggleClass("grand");
	});
	//#endregion

	//#region

	const afficheDate = () => {
		let now = new Date();
		dateJour = now.toLocaleDateString();
		let numeroJour = now.getDay();
		let nomJour = JOUR_SEMAINE[numeroJour];
		heure = now.toLocaleTimeString();
		$(".footer .dateheure").text(`${nomJour} ${dateJour} ${heure}`);
	};
	setInterval(afficheDate, 1000);
	//#endregion

	//#region events

	//#endregion
	//#region
	loginCour = +infoUser.login;
	profilCour = +infoUser.profilAgent;
	afficheMenuVert(".accueil", infoMenuUser);
	afficheMenuHoriz(".accueil", infoMenuUser);
	// $(".zonemenu_vert").hide();

	//#endregion
});
