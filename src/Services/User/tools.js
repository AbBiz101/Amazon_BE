import fs from 'fs-extra';
import { promisify } from 'util';
import PdfPrinter from 'pdfmake';
import { pipeline } from 'stream';
import sgMail from '@sendgrid/mail';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const fonts = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique',
	},
};
const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (items) => {
	const total = items.reduce(
		(acc, item) => acc + parseFloat(item.productPrice),
		0,
	);
	console.log(total);
	const asyncPipeline = promisify(pipeline);

	const docDefinition = {
		defaultStyle: {
			font: 'Helvetica',
		},

		content: [
			items.map((item) => ({
				text: `Product Name - ${item.productName}		 
					   	Price - ${item.productPrice}.00 €`,
			})),
			{ text: `---------------------------------------` },
			{ text: `Total Price -${total}.00 €` },
			{ text: `___________________` },
			{ text: `___________________` },
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
		subject: 'Purchased items',
		text: `Dear customer thank you for shopping! Attached here you will find the bill for your Purchase.`,
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
