let USER_THEME = "themeclair";

const JOUR_SEMAINE = [
	"Dimanche",
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
];
const TAB_ACTION = [
	{
		id: "btnconsult",
		action: "Consulter",
		icone: "consult",
	},
	{
		id: "btnedit",
		action: "Modifier",
		icone: "edit",
	},
	{
		id: "btnsupp",
		action: "Supprimer",
		icone: "supp",
	},
	{
		id: "btnprint",
		action: "Imprimer",
		icone: "print",
	},
	{
		id: "btnvalider",
		action: "Valider l'inventaire",
		icone: "cde",
	},
	{
		id: "btncloturer",
		action: "Cloturer l'inventaire",
		icone: "bat",
	},
];
let MODE_CONSULTATION = false;
let MENU_ACTIF = 0;
const TAUX_TVA = 18;

var menuSelected, loginCour, profilCour;
const Today = () => {
	let v_Date = new Date();
	let v_Annee = v_Date.getFullYear();
	let v_Mois = ajoutZero(v_Date.getMonth() + 1, 2);
	let v_Jour = ajoutZero(v_Date.getDate(), 2);
	let v_DateCour = `${v_Annee}-${v_Mois}-${v_Jour}`;
	return v_DateCour;
};

const UniqueEl = (p_Tableau, p_cle) => {
	return [
		...new Map(p_Tableau.map((obj) => [`${obj[p_cle]}`, obj[p_cle]])).values(),
	];
};
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
const MEFConfirm = (p_titre, p_message, p_data) => {
	$(".confirmation .titre").text(p_titre);
	$(".confirmation .messageconfirm").text(p_message);
	$(".confirmation .dataconfirm").text(p_data);
	$(".modalconfirmation").fadeIn(300);
};
const ajoutZero = (p_Nombre, p_NbCar) => {
	var v_NewStr = p_Nombre.toString().trim();
	while (v_NewStr.length < p_NbCar) {
		v_NewStr = "0" + v_NewStr;
	}
	return v_NewStr;
};
const MEFDataListe = (p_dataliste, p_zone) => {
	let nblig = p_dataliste.length;
	let NbCar = nblig.toString().length + 1;
	p_zone.find(".datarow").each((idx, row) => {
		let colCour = $(row).find(".coldata").eq(0);
		let code = colCour.text();
		if (!isNaN(+code)) {
			code = ajoutZero(code, NbCar);
			colCour.text(code);
		}
	});

	$(".listedata").css({
		width: dataMenu.pagewidth,
		height: dataMenu.pageheight,
	});
	let configList = "";
	let tabAlign = [];
	for (let col of dataMenu.tabcol) {
		configList += `${col.largeur} `;
		tabAlign.push(col.alignement);
	}
	let $i = 0;
	$(".headlist")
		.find(".colhead")
		.each((idx, col) => {
			$(col).css({ "text-align": tabAlign[$i] });
			$i++;
		});
	$(".bodylist")
		.find(".datarow")
		.each((idx, row) => {
			let $i = 0;
			$(row)
				.find(".coldata")
				.each((idx, col) => {
					if (!$(col).hasClass("colaction")) {
						$(col).css({ "text-align": tabAlign[$i] });
						$i++;
					}
				});
		});
};

const isValidDate = (dateString) => {
	var date = new Date(dateString);
	return !isNaN(date.getTime());
};
const millier = (p_nombre, p_nbcar = 3, p_sep = " ") => {
	if (p_nombre == undefined) return "";
	let v_Nombre = p_nombre.toString().trim().replace(" ", "");
	let v_NbCarTot = v_Nombre.length;
	if (v_NbCarTot <= p_nbcar) return p_nombre;
	let v_Reste = v_NbCarTot % p_nbcar;
	let v_Resultat = v_Reste > 0 ? v_Nombre.substr(0, v_Reste) + p_sep : "";
	let v_ChSuite = v_Nombre.substr(v_Reste);
	let v_NbGr = v_ChSuite.length / p_nbcar;
	for (let index = 1; index <= v_NbGr; index++) {
		let str =
			v_ChSuite.substr(p_nbcar * (index - 1), p_nbcar) +
			(index < v_NbGr ? p_sep : "");
		v_Resultat += str;
	}
	return v_Resultat;
};

const $Move = (p_selecteur, p_titre) => {
	obj = {
		activeMove: () => {
			let curX = 0;
			let curY = 0;
			let CurseurX = 0;
			let CurseurY = 0;
			let deplacement = false;
			let elCour;
			$(p_titre).on("mousedown", (e) => {
				curX = $(p_selecteur).position().left;
				curY = $(p_selecteur).position().top;
				CurseurX = e.clientX;
				CurseurY = e.clientY;
				deplacement = true;
				elCour = $(e.target);
			});
			$(p_selecteur).on("mousedown", (e) => {
				elCour = $(e.target);
			});
			$(p_titre).on("mouseup", (e) => {
				deplacement = false;
			});
			$(p_titre).on("mousemove", (e) => {
				$(p_titre).css("cursor", "move");
			});
			$(document).on("mousemove", (e) => {
				if (deplacement && elCour.hasClass("titre")) {
					let DeplX = e.clientX - CurseurX;
					let DeplY = e.clientY - CurseurY;
					let newCurX = curX + DeplX;
					let newCurY = curY + DeplY;
					if (deplacement) $(p_selecteur).css({ left: newCurX, top: newCurY });
				}
			});
		},
	};
	return obj;
};
const NombreEnLettre = (number) => {
	// tableau des noms de nombres pour les chiffres de 0 à 19
	const units = [
		"zero",
		"un",
		"deux",
		"trois",
		"quatre",
		"cinq",
		"six",
		"sept",
		"huit",
		"neuf",
		"dix",
		"onze",
		"douze",
		"treize",
		"quatorze",
		"quinze",
		"seize",
		"dix-sept",
		"dix-huit",
		"dix-neuf",
	];

	// tableau des noms de nombres pour les dizaines de 20 à 90
	const tens = [
		"",
		"",
		"vingt",
		"trente",
		"quarante",
		"cinquante",
		"soixante",
		"soixante-dix",
		"quatre-vingt",
		"quatre-vingt-dix",
	];

	// tableau des noms de nombres pour les centaines de 100 à 900
	const hundreds = [
		"",
		"cent",
		"deux-cent",
		"trois-cent",
		"quatre-cent",
		"cinq-cent",
		"six-cent",
		"sept-cent",
		"huit-cent",
		"neuf-cent",
	];

	// si le nombre est inférieur à 20, utilisez le tableau units
	if (number < 20) {
		return units[number];
	}

	// sinon, divisez le nombre par 10 et utilisez le tableau tens
	let words = "";
	if (number < 100) {
		let quotient = Math.floor(number / 10);
		if (quotient == 7) {
			words = tens[6];
			words += "-" + units[number - 60];
			return words;
		} else if (quotient == 9) {
			words = tens[8];
			words += "-" + units[number - 80];
			return words;
		}
		words = tens[Math.floor(number / 10)];
		if (number % 10 > 0) {
			words += "-" + units[number % 10];
		}
		return words;
	}
	// sinon, divisez le nombre par 100 et utilisez le tableau hundreds
	if (number < 1000) {
		words = hundreds[Math.floor(number / 100)];
		if (number % 100 > 0) {
			words += " " + NombreEnLettre(number % 100);
		}
		return words;
	}

	// sinon, divisez le nombre par 1000 et utilisez la fonction récursivement
	if (number < 1000000) {
		let quotient = Math.floor(number / 1000);

		words = (quotient == 1 ? "" : NombreEnLettre(quotient)) + " mille";
		if (number % 1000 > 0) {
			words += " " + NombreEnLettre(number % 1000);
		}

		return words;
	}

	// sinon, divisez le nombre par 1000000 et utilisez la fonction récursivement
	if (number < 1000000000) {
		words = NombreEnLettre(Math.floor(number / 1000000)) + " million";
		if (number % 1000000 > 0) {
			words += " " + NombreEnLettre(number % 1000000);
		}
		return words;
	}

	return "";
};
const firstLetter = (p_str) => {
	return `${p_str[0].toUpperCase()}${p_str.slice(1).toLowerCase()}`;
};
const capitalizeWord = (p_str) => {
	let v_Str = $.trim(p_str);
	let v_Tab = v_Str.split(" ");
	for (let index = 0; index < v_Tab.length; index++) {
		v_Tab[index] = firstLetter(v_Tab[index]);
	}
	return v_Tab.join(" ");
};
const Gauche = (p_texte, p_nbcar) => {
	let v_Texte = p_texte.trim();
	return v_Texte.substr(0, p_nbcar);
};
const Droite = (p_texte, p_nbcar) => {
	let v_Texte = p_texte.trim();
	let v_NbCar = v_Texte.length;
	return v_Texte.substr(v_NbCar - p_nbcar, p_nbcar);
};
const formatDateHeure = (p_date, p_format = "fr") => {
	let v_Date = $.trim(p_date);
	let v_PartDate = Gauche(v_Date, 10);
	let v_PartHeure = Droite(v_Date, 8);
	return `${formatDate(v_PartDate)} ${v_PartHeure}`;
};
const afficheMenuVert = (p_zonemenu = "accueil", p_tabliste) => {
	p_tabliste.sort((a, b) => {
		if (a.ordremodule >= b.ordremodule) return 1;
		if (a.ordremodule < b.ordremodule) return -1;
	});
	let zoneMenuVert = $(p_zonemenu).find(".zonemenu_vert");
	let tabModule = UniqueEl(p_tabliste, "codemodule");
	zoneMenuVert.empty();
	for (const module of tabModule) {
		let tabMenu = p_tabliste.filter((menu) => menu.codemodule === +module);
		let libModule = tabMenu[0].libmodule;
		let iconeModule = tabMenu[0].iconemodule;
		let listeMenu = "";
		for (const menu of tabMenu) {
			let strMenu = `
					<div class="menuitem" data-code="${menu.codemenu}">
						<span>&#10070;</span>
						<span>${menu.libmenu}</span>
					</div>`;
			listeMenu += strMenu;
		}

		let strModule = `
			<section class="grmodule grmodule${module}">
				<section class="module"data-code="mod${module}">
					<img  src='assets/icones/iconemenu/${iconeModule}' alt=''>
					<span>${libModule}</span>
				</section>
				<section class="listemenu listemenu${module}">
				${listeMenu}
				</section>
			</section>
			`;

		zoneMenuVert.append(strModule);
	}
	$(".grmodule").removeClass("actif");
};
const afficheMenuHoriz = (p_zonemenu = "accueil", p_tabliste) => {
	p_tabliste.sort((a, b) => {
		if (a.ordremodule >= b.ordremodule) return 1;
		if (a.ordremodule < b.ordremodule) return -1;
	});
	let zoneMenuHoriz = $(p_zonemenu).find(".zonemenu_horiz .zonemodule");
	let tabModule = UniqueEl(p_tabliste, "codemodule");
	zoneMenuHoriz.empty();
	for (const module of tabModule) {
		let tabMenu = p_tabliste.filter((menu) => menu.codemodule === +module);
		let libModule = tabMenu[0].libmodule;
		let listeMenu = "";
		for (const menu of tabMenu) {
			let strMenu = `
					<div class="menuitem" data-code="${menu.codemenu}">
						<span>&#1001070;</span>
						<span>${menu.libmenu}</span>
					</div>`;
			listeMenu += strMenu;
		}

		let strModule = `
			<section class="grmodule grmodule${module}">
				<section class="module"data-code="mod${module}">

					<span>${libModule}</span>
				</section>
				<section class="listemenu">
					${listeMenu}
				</section>
			</section>`;

		zoneMenuHoriz.append(strModule);
	}
	$(".zoneMenuHoriz").removeClass("actif");
};
const listeTable = (p_table) => {
	let table = `vue_${p_table}`;
	return postData("/listeTable", { table: table });
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
				valeur = ligne[chvaleur].toUpperCase();
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
const MEFSelSpec = (p_zone, p_liste, p_value, p_lib) => {
	let zoneSelect = $("#" + p_zone);
	if (p_liste) {
		for (const ligne of p_liste) {
			let valeur = ligne[p_value];
			let libelle = ligne[p_lib];
			let strOption = `<option value="${valeur}">${libelle}</option>`;
			zoneSelect.append(strOption);
		}
	}
};
const appliMode = () => {
	if (MODE_CONSULTATION) {
		$(".fiche .zonebtn").remove();
		$(".fiche").find("input, select, textearea").prop("disabled", true);
	}
};

const mySelectListe = (
	p_parent,
	p_element,
	p_table,
	p_cle,
	p_listeChamp,
	p_position = 0,
) => {
	$(".custom-select").remove();
	let $element = p_element;
	if ($element.hasClass("inactif")) return;
	// lecture des éléments de la table
	let param = { table: p_table, champcle: p_cle, listeChamp: p_listeChamp };
	let rowData = postData("/listeSelect", { param });
	let listeOption = "";
	for (let row of rowData) {
		let valCle = ajoutZero(row[p_cle], 3);
		let libelle = row["lib"].toUpperCase();
		let strOption = `
		<option class="cs-option" data-code ='${row[p_cle]}'>
			<span class ='cs-code' >${valCle}</span>
			<span class ='cs-lib'>${libelle}</span>
		</option>
		`;
		listeOption += strOption;
	}
	let customSelect = $(compoSelect);
	let idCS = "cs-parent_" + $element.prop("id");
	customSelect.prop("id", idCS);
	customSelect.find(".cs-liste").append(listeOption);
	$(".accueil").append(customSelect);

	customSelect.find(".cs-filtre").focus();
	let largeur = $element.outerWidth();
	let ecart = 5;
	if (p_position === 0) {
		let posX = $element.position().left + p_parent.position().left;
		let posYElement = $element.position().top + p_parent.position().top;
		let parentHeight = $(".accueil").height();
		let hauteurElement = $element.outerHeight();
		let hauteurListe = customSelect.outerHeight();
		let espace = $(".accueil").height() - (posYElement + 1.5 * ecart);
		console.log(espace, hauteurListe);
		if (espace >= hauteurListe) {
			customSelect.css({
				width: largeur,
				left: posX,
				top: posYElement + hauteurElement + ecart,
			});
		} else {
			let bottomListe = parentHeight - posYElement + 2 * ecart;
			customSelect.css({
				width: largeur,
				left: posX,
				bottom: bottomListe,
			});
		}
	} else {
		let posX = "50%";
		let posY = "25%";
		customSelect.css({
			left: posX,
			top: posY,
			transform: "translateX(-50%)",
			width: largeur,
		});
	}

	$(document).on("click", ".custom-select, .cs-filtre", function (e) {
		e.stopPropagation();
	});
	$(document).on("input paste", ".cs-filtre", function () {
		$(".cs-clearfiltre").hide();
		$(".cs-liste .cs-option").show();
		let filtre = $.trim($(this).val().toLowerCase());
		if (filtre === "") return;
		$(".cs-clearfiltre").show();
		$(".cs-liste .cs-option").each((idx, lig) => {
			let option = $(lig);
			if (!option.text().toLowerCase().includes(filtre)) {
				option.hide();
			}
		});
	});
	$(document).on("click", ".cs-clearfiltre", () => {
		$(".cs-liste .cs-option").show();
		$(".cs-filtre").val("");
		$(".cs-clearfiltre").hide();
	});

	$(document).on("click", (e) => {
		$(".custom-select").remove();
	});
	$(document).on("click", "#" + idCS + " .cs-option", function (e) {
		e.stopPropagation();
		let codeCle = $(this).attr("data-code");
		let code = $(this).find(".cs-code").text();
		let lib = $(this).find(".cs-lib").text();
		let valeur = `${code} - ${lib}`;
		$element.text(valeur).attr("data-code", codeCle);
		$element.trigger("change");
		$(".custom-select").remove();
	});
};

const ajoutArticle = (p_index) => {
	let strArt = ` <section class="datarow" data-index="${p_index}">
                    <div class="coldata colindice">${p_index}</div>
                    <div class="coldata">
                        <span class="article" id="article${p_index}"></span>
                    </div>
                    <div class="coldata">
                        <input type="text" class="qteart" value="0">
                    </div>
                    <div class="coldata">
                        <input type="text" class="puart" value="0">
                    </div>
                    <div class="coldata">
                        <span class="montantht"></span>
                    </div>
                    <div class="colaction coldata">
						<span class="btnsuppart">&#10008;</span>
                    </div>
                </section>  `;
	let article = $(strArt);
	return article;
};

const MEFFinanceClient = (p_client) => {
	let tabFacture = postData("/listeTable", { table: "table_facture" });
	let tabFinance = postData("/listeTable", { table: "table_financeclient" });
	let tabfactureClient = tabFacture.filter(
		(fact) => +fact.codeclient === +p_client,
	);
	let totalMontant = 0;
	for (let fact of tabfactureClient) {
		let detFacture = JSON.parse(fact.detfacture);
		let montantLig = 0;
		let tvaFacture = +fact.tvafacture;
		for (let det of detFacture) {
			let qteArt = +det.qteart;
			let puArt = +det.puart;
			montantLig += qteArt * puArt;
		}
		if (tvaFacture === 1) montantLig = montantLig * (1 + TAUX_TVA / 100);
		totalMontant += montantLig;
	}
	let tabFinClient = tabFinance.filter(
		(fact) => +fact.codeclient === +p_client,
	);
	let totalPaiement = 0;
	let soldeInitial = 0;
	let totalAvoir = 0;
	for (let fin of tabFinClient) {
		let montant = +fin.montant;
		let typeOp = fin.typeop;
		switch (typeOp) {
			case 1:
				totalPaiement += montant;
				break;
			case 2:
				totalAvoir += montant;
				break;
			case 3:
				soldeInitial += montant;
				break;
		}
	}
	let infoFin = { soldeInitial, totalMontant, totalPaiement, totalAvoir };
	return infoFin;
};

const refreshListe = (p_Res) => {
	let menuActif = MENU_ACTIF == 0 ? $(".zonemenu_vert") : $(".zonemenu_horiz");
	if (p_Res > 0) {
		$(".modalfiche").fadeOut(300, () => {
			let menu = menuActif.find(`.menuitem[data-code='${menuSelected}']`);
			menu.removeClass("selected");
			menu.trigger("click");
		});
	} else {
		alert(p_Res);
	}
};

const calculStok = () => {
	let tabFacture = postData("/listeTable", { table: "vue_facture" });
	let tabStock = postData("/listeTable", { table: "table_stock" });
	// Sortie pour facture
	let tabQteArt = [];
	for (const fact of tabFacture) {
		let detFacture = JSON.parse(fact.detfacture);
		let tabArtFacture = UniqueEl(detFacture, "codeart");
		for (const artfact of tabArtFacture) {
			let qteArt = 0;
			let listeArtFact = detFacture.filter((art) => +art.codeart === +artfact);
			for (const detart of listeArtFact) {
				qteArt += +detart.qteart;
			}
			tabQteArt.push({ codeart: artfact, qteart: qteArt });
		}
	}
	console.log(tabQteArt);
};
let compoSelect = `<section class="custom-select">
							<div class="cs-zonefiltre">
								<img src="assets/icones/iconepage/loupe.png">
								<input class="cs-filtre"></input>
								<span class="cs-clearfiltre">&#10005;</span>
							</div>
							<div class="cs-liste">
							</div>
					   </section>
						`;

$pageAccueil = $(".accueil");
let doc = $(document);
$.fn.cs_custom = function (
	p_parent,
	p_tabliste = [],
	estActif = true,
	avecFiltre = false,
) {
	$(this).addClass("cs-custom");
	let compoCS;
	thisElement = $(this);
	let indice = 0;
	$(".cs-custom").each(function () {
		indice++;
		thisElement.attr("data-cs-id", indice);
	});
	const creListe = () => {
		let keys = Object.keys(p_tabliste[0]);
		let code = keys[0];
		let lib = keys[1];
		let contenuListe = "";
		for (let row of p_tabliste) {
			let valCle = row[code];
			let newCode = ajoutZero(valCle, 3);
			let libelle = row[lib];
			let strOption = `
					<option class="cs-option"  data-code ='${valCle}'>
						<span class ='cs-code'>${newCode} - ${libelle}</span>
					</option>
					`;
			contenuListe += strOption;
		}
		return contenuListe;
	};
	const position = (p_element, p_customSel) => {
		let hauteurPage = $(window).outerHeight();
		let posXElement = p_element.position().left;
		let posYElement = p_element.position().top;
		let hauteurElement = p_element.outerHeight();
		let largeurElement = p_element.outerWidth();

		let ecart = 5;
		let hauteurListe = p_customSel.outerHeight();
		let posX = posXElement;
		let espacePrevu = hauteurPage - (posYElement + hauteurElement + 3 * ecart);
		if (espacePrevu > hauteurListe) {
			// on met en bas
			let posY = posYElement + hauteurElement + ecart;
			p_customSel.css({ width: largeurElement, left: posX, top: posY });
		} else {
			// on met en haut
			let posBottom = hauteurPage - (posYElement + 2 * ecart);
			p_customSel.css({
				width: largeurElement,
				left: posX,
				bottom: posBottom,
			});
		}
	};
	if (estActif) {
		thisElement.addClass("actif");
	}
	thisElement.on("click", (e) => {
		thisElement = $(e.target);
		e.stopPropagation();
		let idCS = thisElement.attr("data-cs-id");
		let customID = $(".custom-select").attr("data-select-id");
		$(".custom-select").remove();
		if (idCS === customID) return;
		if (!estActif) {
			return;
		}
		let customSelect = $(compoSelect).clone();
		if (!avecFiltre) {
			customSelect.find(".cs-zonefiltre").remove();
		} else {
			$(".cs-filtre").focus();
		}
		listeOption = creListe();
		let customListe = customSelect.find(".cs-liste");
		customListe.append(listeOption);
		p_parent.append(customSelect);
		customSelect.attr("data-select-id", thisElement.attr("data-cs-id"));
		$(".custom-select").removeClass("open");
		customSelect.addClass("open");
		position(thisElement, customSelect);
	});
	p_parent.on("click", ".custom-select", (e) => {
		e.stopPropagation();
	});
	p_parent.on("click", ".cs-option", function (e) {
		e.stopPropagation();
		let csValue = $(e.target).text();
		thisElement.text(csValue).attr("data-code", $(e.target).attr("data-code"));
		thisElement.trigger("change");
		$(".custom-select").remove();
	});
	$(document).on("input paste", ".cs-filtre", function () {
		$(".cs-clearfiltre").hide();
		$(".cs-liste .cs-option").show();
		let filtre = $.trim($(this).val().toLowerCase());
		if (filtre === "") return;
		$(".cs-clearfiltre").show();
		$(".cs-liste .cs-option").each((idx, lig) => {
			let option = $(lig);
			if (!option.text().toLowerCase().includes(filtre)) {
				option.hide();
			}
		});
	});
	$(document).on("click", ".cs-clearfiltre", (e) => {
		e.stopPropagation();

		$(".cs-liste .cs-option").show();
		$(".cs-filtre").val("");
		$(".cs-clearfiltre").hide();
	});
	$(document).on("click", (e) => {
		e.stopPropagation();

		$(".custom-select").remove();
	});
};
