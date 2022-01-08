import sgMail from '@sendgrid/mail';
import PdfPrinter from 'pdfmake';
import axios from 'axios';
import { pipeline } from 'stream';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { promisify } from 'util';

const fonts = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique',
	},
};
const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (item) => {
	const asyncPipeline = promisify(pipeline);
	console.log(item.cart[0]);
	const docDefinition = {
		content: [
			{
				text: [item.cart[0].productName],
				fontSize: 20,
				bold: true,
				margin: [0, 0, 0, 40],
			},
			{ text: item.cart[0].productPrice, lineHeight: 2 },
			{ text: item.cart[0].productCategory },
		],
	};

	const pdfStream = printer.createPdfKitDocument(docDefinition);
	const path = join(dirname(fileURLToPath(import.meta.url)), `file.pdf`);
	pdfStream.end();
	await asyncPipeline(pdfStream, fs.createWriteStream(path));
	return path;
};

/* ----------------------------------- EMAIL ----------------------------------------- */

sgMail.setApiKey(process.env.SGEMAIL);

export const sendEmail = async (userEmail, pdf) => {
	const msg = {
		to: userEmail,
		from: process.env.SenderEmail,
		subject: 'Purchased items ',
		text: `Product `,
		html: '<strong>Dear customer thank you for shopping!</strong>',

		attachments: [
			{
				content: pdf,
				filename: `bill`,
				type: 'application/pdf',
				disposition: 'attachment',
			},
		],
	};
	await sgMail.send(msg);
};
