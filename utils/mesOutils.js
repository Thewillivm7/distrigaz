function NombreEnLettre(number) {
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
}

function clearURLParameters() {
	// Remplace l'URL actuelle sans les paramètres
	history.replaceState({}, document.title, window.location.pathname);
}

function obtenirParametreUrl(nomParametre) {
	var url = new URL(window.location.href);
	var parametre = url.searchParams.get(nomParametre);
	return parametre;
}

function téléchargerFichier(url) {
	// Créer une requête XMLHttpRequest
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// Le fichier existe, déclencher le téléchargement
				window.location.href = url;
			} else {
				// Le fichier n'existe pas, gérer l'exception ici
				alert("Fichier introuvable, contacter l'administrateur");
			}
		}
	};

	// Envoyer la requête HEAD pour obtenir les informations sur le fichier
	xhr.send();
}
function téléchargerFichierPDF(url, p_nomfichier) {
	fetch(url, { method: "HEAD" })
		.then((response) => {
			if (response.ok) {
				// Le fichier existe, télécharger
				return fetch(url);
			} else {
				// Le fichier n'existe pas, gérer l'exception ici
				alert("Fichier non trouvé !");
				throw new Error("Le fichier n'existe pas !");
			}
		})
		.then((response) => response.blob())
		.then((blob) => {
			// Créer un lien temporaire
			const lienTéléchargement = document.createElement("a");
			lienTéléchargement.href = URL.createObjectURL(blob);
			lienTéléchargement.download = p_nomfichier;

			// Ajouter le lien au document
			document.body.appendChild(lienTéléchargement);

			// Simuler un clic sur le lien pour déclencher le téléchargement
			lienTéléchargement.click();

			// Nettoyer
			document.body.removeChild(lienTéléchargement);
			URL.revokeObjectURL(lienTéléchargement.href);
		})
		.catch((error) => {
			console.error("Erreur lors du téléchargement du fichier :", error);
		});
}

function FileExists(p_file) {
	$.ajax({
		url: p_file,
		type: "HEAD",
		success: function () {
			// Le fichier existe
			return true;
		},
		error: function () {
			// Le fichier n'existe pas
			return false;
		},
	});
}
function getDays(year, month) {
	return new Date(year, month, 0).getDate();
}

function weekNumber(date = new Date()) {
	var firstJanuary = new Date(date.getFullYear(), 0, 1);
	var dayNr = Math.ceil((date - firstJanuary) / (24 * 60 * 60 * 1000));
	var weekNr = Math.ceil((dayNr + firstJanuary.getDay()) / 7);
	return weekNr;
}

function getDateOfISOWeek(w, y) {
	var simple = new Date(y, 0, 1 + (w - 1) * 7);
	var dow = simple.getDay();
	var ISOweekStart = simple;
	if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
	else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
	return ISOweekStart;
}

mobileCheck = function () {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a,
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4),
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};
function EnvoiData(p_url, p_data) {
	var theResponse = "";
	$.ajax({
		url: p_url,
		type: "POST",
		data: p_data,
		dataType: "json",
		async: false,
		success: function (result) {
			theResponse = result;
		},
	});
	return theResponse;
}
function ajoutZero(p_Nombre, p_NbCar) {
	var v_NewStr = p_Nombre.toString().trim();
	while (v_NewStr.length < p_NbCar) {
		v_NewStr = "0" + v_NewStr;
	}
	return v_NewStr;
}
function MEFListe(p_Zone, p_table, p_champCle, p_ChampTexte, p_nomste) {
	var v_Url = "php/MEFListe.php";
	var v_Data = {
		action: "list",
		zone: p_Zone,
		tablename: p_table,
		champcle: p_champCle,
		champtexte: p_ChampTexte,
		nomste: p_nomste,
	};
	var v_TabRes = EnvoiData(v_Url, v_Data);
	$(p_Zone).empty();
	if (v_TabRes.length == 0) return;
	v_TabRes.forEach((element) => {
		let v_Valeur = element[p_ChampTexte].toUpperCase();
		let str = `<option value="${element[p_champCle]}">${v_Valeur}</option>`;
		$(p_Zone).append(str);
	});
}
function $Move(p_selecteur, p_titre) {
	obj = {
		activeMove: () => {
			let curX = 0;
			let curY = 0;
			let CurseurX = 0;
			let CurseurY = 0;
			let deplacement = false;
			$(p_titre).on("mousedown", (e) => {
				curX = $(p_selecteur).position().left;
				curY = $(p_selecteur).position().top;
				CurseurX = e.clientX;
				CurseurY = e.clientY;
				deplacement = true;
				e.stopPropagation();
			});
			$(p_titre).on("mouseup", () => {
				deplacement = false;
			});
			$(p_titre).on("mousemove", () => {
				$(p_titre).css("cursor", "move");
			});
			$(document).on("mousemove", (e) => {
				if (deplacement) {
					let DeplX = e.clientX - CurseurX;
					let DeplY = e.clientY - CurseurY;
					let newCurX = curX + DeplX;
					let newCurY = curY + DeplY;
					let v_Position = Math.round(newCurX + $(p_selecteur).width()) + 10;
					let v_LargeEcran = Math.round($(this).width());

					if (deplacement) $(p_selecteur).css({ left: newCurX, top: newCurY });
				}
			});
		},
	};
	return obj;
}
function firstLetter_anc(p_str) {
	return p_str.replace(/^\w/, (c) => c.toUpperCase());
}
function firstLetter(p_str) {
	return `${p_str[0].toUpperCase()}${p_str.slice(1).toLowerCase()}`;
}
function capitalizeWord(p_str) {
	let v_Str = $.trim(p_str);
	let v_Tab = v_Str.split(" ");
	for (let index = 0; index < v_Tab.length; index++) {
		v_Tab[index] = firstLetter(v_Tab[index]);
	}
	return v_Tab.join(" ");
}
function UniqueEl(p_Tableau, p_cle) {
	return [
		...new Map(p_Tableau.map((obj) => [`${obj[p_cle]}`, obj[p_cle]])).values(),
	];
}
function UniqueAnne(p_Tableau) {
	return [
		...new Map(p_Tableau.map((obj) => [`${obj.anpaie}`, obj.anpaie])).values(),
	];
}
function UniqueMois(p_Tableau, p_Anne) {
	var v_TabResult = p_Tableau.filter((Periode) => Periode.anpaie == p_Anne);
	return [
		...new Map(
			v_TabResult.map((obj) => [`${obj.moispaie}`, obj.moispaie]),
		).values(),
	];
}
function UniqueFichier(p_Tableau, p_Anne, p_Mois) {
	var v_TabResult = p_Tableau.filter(
		(Periode) => Periode.anpaie == p_Anne && Periode.moispaie == p_Mois,
	);
	return v_TabResult;
}

function isValidDate(dateString) {
	var date = new Date(dateString);
	return !isNaN(date.getTime());
}
function ContextMenu(p_caller, p_optionlist) {
	$(".contextmenu").remove();
	$(".contextmenu").removeClass("actif");

	let v_ListeOption = "";
	p_optionlist.forEach((option) => {
		let str = `<option class="${option.code}" value="${option.code}">${option.lib}</option>`;
		v_ListeOption += str;
	});
	let v_ContextMenu = `<section class="contextmenu">
                               ${v_ListeOption}
                            </section>
                            `;

	p_caller.append(v_ContextMenu);
	v_Large = $(".contextmenu").outerWidth();
	$(".contextmenu").css({
		right: 5,
		position: "absolute",
		top: p_caller.height(),
	});
	$(".contextmenu").addClass("actif");
}
function showDialog(p_data) {
	return new Promise((resolve, reject) => {
		$(".index").append(v_ModalConfirm);
		$(".modalconfirm .titreconfirm").addClass("confirmation");
		let v_Titre = p_data.titre;
		let v_Message = p_data.message;
		let v_Data = p_data.data;
		$(".modalconfirm .titre").text(v_Titre);
		$(".modalconfirm .message").text(v_Message);
		$(".modalconfirm .data").text(v_Data);
		$(".modalconfirm").fadeIn(200, () => {
			$(".modalconfirm .cadreconfirm").slideDown(300);
		});
		$Move($(".cadreconfirm"), $(".titreconfirm")).activeMove();

		const yesButton = $(".modalconfirm #btnoui");
		const noButton = $(".modalconfirm #btnnon");
		const closeButton = $(".modalconfirm .btnclose");
		yesButton.on("click", () => {
			resolve(true);
			$(".modalconfirm").fadeOut(200, () => {
				$(".modalconfirm").remove();
			});
		});
		noButton.on("click", () => {
			resolve(false);
			$(".modalconfirm").fadeOut(200, () => {
				$(".modalconfirm").remove();
			});
		});
		closeButton.on("click", () => {
			resolve(false);
			$(".modalconfirm").fadeOut(200, () => {
				$(".modalconfirm").remove();
			});
		});
	});
}
function Gauche(p_texte, p_nbcar) {
	let v_Texte = p_texte.trim();
	return v_Texte.substr(0, p_nbcar);
}
function Droite(p_texte, p_nbcar) {
	let v_Texte = p_texte.trim();
	let v_NbCar = v_Texte.length;
	return v_Texte.substr(v_NbCar - p_nbcar, p_nbcar);
}

async function Confirmation(p_Info) {
	const result = await showDialog(p_Info);
	return result;
}

function creWindow(p_titre, p_module, p_parent, p_type = "menu") {
	// alert(p_parent.attr("class"));
	let v_WindID = `wind${p_module}`;
	let v_WinTitreId = `titre${p_module}`;
	let v_WinCorpsID = `corps${p_module}`;
	const majZIndex = () => {
		let z_index = 1000;
		$(".window").each((idx, el) => {
			z_index++;
			$(el).css("z-index", z_index);
		});
		return z_index;
	};
	function activeWindow() {
		let v_lastZIndex = majZIndex();
		let v_Selecteur = p_parent.find("#" + v_WindID);
		v_Selecteur.css({ "z-index": v_lastZIndex + 1 });
		$(".movable").removeClass("actif");
		v_Selecteur.addClass("actif");
	}

	let configWindow = `
	        <section class="window movable" id="${v_WindID}">
				<section class="wintitre" id="${v_WinTitreId}">
					<div class="titre">${p_titre}</div>
					<div class="btnclose">&#10006;</div>
				</section>
				<section class="wincorps" id="${v_WinCorpsID}"></section>
	        </section>
			`;

	p_parent.append(configWindow);
	let v_elWindow = $("#" + v_WindID);

	activeWindow();
	v_elWindow.on("click", function () {
		activeWindow();
	});
	let v_btnClose = v_elWindow.find(".btnclose");
	v_btnClose.on("click", () => {
		if (p_type == "menu") {
			let v_menu = $(".zonemenu #" + p_module);
			v_menu.removeClass("actif");
			$(`.zonemenu [data-lien='${p_module}']`).removeClass("actif");
		} else {
			$(".index .modalfiche").remove();
		}
		v_elWindow.remove();
	});

	majZIndex();

	MoveWindow();
	function MoveWindow() {
		let curX = 0;
		let curY = 0;
		let CurseurX = 0;
		let CurseurY = 0;
		let deplacement = false;
		let v_Titre = $(".movable .wintitre");
		let v_Selecteur;

		$(v_Titre).on("mousedown", function (e) {
			v_Selecteur = $(this).parent();

			curX = $(v_Selecteur).position().left;
			curY = $(v_Selecteur).position().top;
			CurseurX = e.clientX;
			CurseurY = e.clientY;
			// if (v_Titre.prop("id") == $(this).prop("id")) deplacement = true;
			deplacement = true;
			e.stopPropagation();
		});

		$(v_Titre).css("cursor", "move");
		$(document).on("mouseup", () => {
			deplacement = false;
		});
		// $(v_Titre).on("mousemove", () => {

		// });
		$(document).on("mousemove", (e) => {
			if (deplacement) {
				let DeplX = e.clientX - CurseurX;
				let DeplY = e.clientY - CurseurY;
				let newCurX = curX + DeplX;
				let newCurY = curY + DeplY;
				let v_Position = Math.round(newCurX + $(v_Selecteur).width()) + 10;
				let v_LargeEcran = Math.round($(this).width());
				$(v_Selecteur).css({ left: newCurX, top: newCurY });
			}
		});
	}
}

function millier(p_nombre, p_nbcar = 3, p_sep = " ") {
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
}
//Formatage de la date en fonction du format
function formatDate(p_date, p_format = "fr", p_separateur = "/") {
	var v_ListeFormat = "fr-en";
	if (typeof p_format == "undefined") {
		p_format = "fr";
	}
	if (typeof p_separateur == "undefined") {
		p_separateur = "/";
	}
	var v_Format = p_format.toLowerCase();
	if (v_ListeFormat.indexOf(v_Format) < 0) {
		alert("format de la date inconnue");
		return p_date;
	}
	// longueur de la date
	var v_Date = p_date.toString().trim();
	var v_LongDate = v_Date.length;
	switch (v_LongDate) {
		case 8: // la date sous forme aaaammjj ou jjmmaaaa;
			var v_4Prem = Gauche(p_date, 4); // On prend les 4 caractères de gauche
			var v_4Dern = Droite(p_date, 4); // On prend les 4 caractères de droite
			if (Gauche(v_4Prem, 2) == "20") {
				// c'est aaaammjj
				if (Gauche(v_4Dern, 2) == "20") {
					return "Date incorrecte";
				}
				var v_Annee = v_4Prem;
				var v_Mois = Gauche(v_4Dern, 2);
				var v_Jour = Droite(v_4Dern, 2);
				if (v_Mois > "12") {
					return "Date incorrecte";
				}
				if (p_format == "fr") {
					return `${v_Jour}${p_separateur}${v_Mois}${p_separateur}${v_Annee}`;
				} else {
					return `${v_Annee}${p_separateur}${v_Mois}${p_separateur}${v_Jour}`;
				}
			} else {
				// c'est jjmmaaaa
				if (Gauche(v_4Dern, 2) == "20") {
					var v_Annee = v_4Dern;
					var v_Mois = Droite(v_4Prem, 2);
					var v_Jour = Gauche(v_4Prem, 2);
					if (p_format == "fr") {
						return `${v_Jour}${p_separateur}${v_Mois}${p_separateur}${v_Annee}`;
					} else {
						return `${v_Annee}${p_separateur}${v_Mois}${p_separateur}${v_Jour}`;
					}
				}
			}
			break;
		case 10:
			var v_sep1 = v_Date.substr(2, 1);
			if (v_sep1 >= "0" && v_sep1 <= "9") {
				var v_sep1 = v_Date.substr(4, 1);
				var v_sep2 = v_Date.substr(7, 1);
				if (v_sep1 == v_sep2) {
					var tabDate = v_Date.split(v_sep1);
					v_Jour = tabDate[2];
					v_Mois = tabDate[1];
					v_Annee = tabDate[0];
					var DaysInMonth = new Date(parseInt(v_Annee), parseInt(v_Mois), 0)
						.getDate()
						.toString();
					if (v_Mois > DaysInMonth) {
						return "Date incorrecte";
					} else {
						if (v_Jour > DaysInMonth) {
							return "Date incorrecte";
						}
					}
					return `${tabDate[2]}${p_separateur}${tabDate[1]}${p_separateur}${tabDate[0]}`;
				}
			} else {
				var v_sep2 = v_Date.substr(5, 1);
				if (v_sep1 == v_sep2) {
					var tabDate = v_Date.split(v_sep1);
					return `${tabDate[0]}${p_separateur}${tabDate[1]}${p_separateur}${tabDate[2]}`;
				} else {
					return "Date incorrecte";
				}
			}
			break;
		default:
			return "Date incorrecte";
	}
}
function formatDateHeure(p_date, p_format = "fr") {
	let v_Date = $.trim(p_date);
	let v_PartDate = Gauche(v_Date, 10);
	let v_PartHeure = Droite(v_Date, 8);
	return `${formatDate(v_PartDate)} ${v_PartHeure}`;
}
// Renvoie la date du jour en format AAAA-MM-JJ
function Today() {
	let v_Date = new Date();
	let v_Annee = v_Date.getFullYear();
	let v_Mois = ajoutZero(v_Date.getMonth() + 1, 2);
	let v_Jour = ajoutZero(v_Date.getDate(), 2);
	let v_DateCour = `${v_Annee}-${v_Mois}-${v_Jour}`;
	return v_DateCour;
}

function PreviewDoc() {
	let str = `<section class="modal modpreview"></section>`;
	$("body").append(str);
	$(".modpreview").hide(0);
	$(".modpreview").load("preview.html", () => {
		$(".modpreview").fadeIn(500);
	});
	$(".modpreview ");
}
function PrintDoc(p_id) {
	const content = document.getElementById(p_id).innerHTML;
	const newWindow = window.open("about:blank", "_bank");
	newWindow.document.write(content);
	setTimeout(() => {
		newWindow.print();
		newWindow.document.close();
		newWindow.close();
	}, 20);
	// iframe = newWindow.document.getElementById("iframe");
	// iframe.contentWindow.document.body.innerHTML = content;
}

function getInfo(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function userMessage(p_message, p_type = "") {
	if (p_type != "") {
		$("#index .usermessage").css("background-color", "lightblue");
	} else {
		$("#index .usermessage").css("background-color", "");
	}
	$("#index .usermessage #msgalert").text(p_message);
	// $("#index .usermessage").addClass("actif");
	$("#index .usermessage").slideDown(500);
	setTimeout(() => {
		$("#index .usermessage").slideUp(500);
		// $("#index .usermessage").removeClass("actif");
	}, 4000);
}

function afficherApercu(document, type) {
	const modalAperçu = $(".modalapercu");
	modalAperçu.fadeOut(300);
	const zoneApercu = $(".zoneapercu");
	const previewContainer = $("#apercudoc");
	previewContainer.empty(); // Efface tout contenu précédent

	if (type === "pdf") {
		// Chargement d'un PDF dans un iframe
		const iframe = $("<iframe>");
		zoneApercu.css("height", "95vh");

		iframe.attr("src", document);
		previewContainer.append(iframe);
	} else if (type === "img") {
		// Affichage d'une image
		const image = $("<img>");
		zoneApercu.css("height", "auto");
		image.attr("src", document);
		previewContainer.append(image);
	} else {
		previewContainer.text("Type de document non pris en charge.");
	}
	modalAperçu.fadeIn(500);
}
function ExportVersExcel(p_data, p_nomFichier, p_NomFeuille) {
	var jsonDataObject = eval(p_data);

	var myWorkSheet = XLSX.utils.json_to_sheet(jsonDataObject);
	var myWorkBook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, p_NomFeuille);
	XLSX.writeFile(myWorkBook, p_nomFichier);
}
$.fn.customSelect = function (p_dataliste, p_Cle, p_Texte) {
	return this.each(function () {
		var $this = $(this);
		$this.append(`<div class="ms_val"></div>`);
		MEFListeInt();
		var $zoneVal = $this.find(".ms_val");
		var $zoneContenu = $this.find(".ms_contenu");
		var $zoneFiltre = $this.find(".ms_zonefiltre");
		var $optionList = $this.find(".ms_listeoption");
		$this.addClass("ms_select");
		$this.css("width", $zoneContenu.outerWidth() + 20);

		// Function to filter results based on input value
		function MEFListeInt() {
			let v_ListeOption = "";
			p_dataliste.forEach((el) => {
				let v_Valeur = el[p_Cle];
				let v_Texte = el[p_Texte];
				let strOption = `<option value ="${v_Valeur}">${v_Texte}</option>`;
				v_ListeOption += strOption;
			});
			let v_Contenu = `<section class="ms_contenu">
									<div class="ms_zonefiltre">
									<input type="text" name="" id="" autofocus>
									</div>
									<div class="ms_listeoption">${v_ListeOption}</div>
                                </section>`;
			$this.append(v_Contenu);
		}
		function filterResults(inputValue) {
			$optionList.each((idx, el) => {});
		}

		// Event listener for input changes
		$(window).on("click", (e) => {
			$(".ms_select .ms_contenu").removeClass("actif");
			e.stopPropagation();
		});

		$this.on("input", ".ms_filtre input", function () {
			var inputValue = $.trim($(this).val());
			filterResults(inputValue);
		});
		$zoneFiltre.on("click", "input", (e) => {
			e.stopPropagation();
		});
		$this.on("click", (e) => {
			if ($this.hasClass("inactif")) return;

			let v_Ouvert = $zoneContenu.hasClass("actif");
			$zoneContenu.removeClass("actif");
			if (!v_Ouvert) {
				$zoneContenu.addClass("actif");
			}
			e.stopPropagation();
			$zoneFiltre.find("input").val("");
			$zoneFiltre.trigger("input");
			// $optionList.find("option").show();
		});
		// Event listener for item selection
		$optionList.on("click", "option", function (e) {
			var selectedText = $(this).text();
			e.stopPropagation();
			$zoneVal.text(selectedText);
			$(".ms_select .ms_contenu").removeClass("actif");
			$this.attr("data-value", $(this).val());
			$this.trigger("change");
			// Add logic here to handle selected item as needed
		});
		$zoneFiltre.on("input", "input", function () {
			let v_Filtre = $(this).val().toLowerCase();
			$optionList.find("option").show();
			$optionList.find("option").each((idx, element) => {
				if (!$(element).text().toLowerCase().includes(v_Filtre)) {
					$(element).hide();
				}
			});
		});
	});
};
