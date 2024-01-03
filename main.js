$(() => {
	$.fn.cs_custom = function (p_color = "red", actif = false) {
		// Code de votre nouvelle méthode
		// this fait référence à l'objet jQuery sur lequel la méthode est appelée
		return this.each(() => {
			// Code à exécuter pour chaque élément dans la sélection
			if (actif) $(this).css("background-color", p_color);
			$(this).on("click", () => {
				alert(p_color);
			});
		});
	};

	$(".listeclient").cs_custom("green", true);
	$(".listearticle").cs_custom("purple", true);
});
