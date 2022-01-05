import sgMail from '@sendgrid/mail';
import PdfPrinter from 'pdfmake';
import axios from 'axios';

const fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf',
	},
};
const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (items) => {
	// const response = await axios.get(items.productImg, {
	// 	responseType: 'arraybuffer',
	// });
	// const itemImageURLParts = profile.item.split('/');
	// const fileName = itemImageURLParts[itemImageURLParts.length - 1];
	// const [id, extension] = fileName.split('.');
	// const base64 = response.data.toString('base64');
	// const base64Image = `data:image/${extension};base64,${base64}`;
	// const imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };

	const docDefinition = {
		content: items.map((item) => [
			{
				text: [item.productName],
				fontSize: 20,
				bold: true,
				margin: [0, 0, 0, 40],
			},
			{ text: item.productPrice, lineHeight: 2 },
			{ text: item.productCategory },
		]),
	};

	const pdfStream = printer.createPdfKitDocument(docDefinition, option);
	pipeline(pdfStream, fs.createEmailStream('bill.pdf'));
	pdfStream.end();
	return pdfStream;
};

/* ----------------------------------- EMAIL ----------------------------------------- */

sgMail.setApiKey(process.env.SGEMAIL);

export const sendEmail = async (userEmail, pdf) => {
	const msg = {
		to: userEmail,
		from: process.env.SenderEmail,
		subject: 'Purchased items ',
		// text: `Product Name-${data}\nProduct Price- ${data1}\nproduct Image-${data2}`,
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
