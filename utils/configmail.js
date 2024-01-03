const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const MAIL_USER = "infos@rhplus-africa.com";
const MAIL_USERNAME = "RHPLUS";
const MAIL_HOST = "mail.rhplus-africa.com";
const MAIL_PWD = "38*O)43xUDYr";
const MAIL_PORT = "465";

// Configuration de votre transporteur SMTP personnalisé

async function envoiMail(p_dest, p_sujet, p_contenu) {
	var transporter = nodemailer.createTransport(
		smtpTransport({
			name: MAIL_HOST,
			pool: true,
			host: MAIL_HOST,
			port: MAIL_PORT,
			secure: true, // false pour les connexions non sécurisées (true pour SSL/TLS)
			auth: {
				user: MAIL_USER,
				pass: MAIL_PWD,
			},
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false,
			},
		}),
	);

	const mailOptions = {
		from: MAIL_USER,
		to: p_dest,
		subject: p_sujet,
		html: p_contenu,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("E-mail envoyé avec succès :", info.response);
		return 1; // Retourne 1 en cas de succès
	} catch (error) {
		console.log("Erreur lors de l'envoi de l'e-mail :", error);
		return 0; // Retourne 0 en cas d'échec
	}
}
module.exports = {
	envoiMail,
};
