import PdfPrinter from 'pdfmake';
import axios from 'axios'
const printer = new PdfPrinter(fonts);

const fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf',
	},
};

export const getPDFReadableStream = async (item) => {
	const response = await axios.get(item.productImg, {
		responseType: 'arraybuffer',
	});
	const itemImageURLParts = profile.item.split('/');
	const fileName = itemImageURLParts[itemImageURLParts.length - 1];
	const [id, extension] = fileName.split('.');
	const base64 = response.data.toString('base64');
	const base64Image = `data:image/${extension};base64,${base64}`;
	imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };

	const docDefinition = {
		content: [
			imagePart,
			{
				text: [item.productName],
				fontSize: 20,
				bold: true,
				margin: [0, 0, 0, 40],
			},
			{ text: item.productPrice, lineHeight: 2 },
			{ text: item.productCategory },
			{ text: item.productDescription },
		],
	};

	const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
	pdfReadableStream.end();
	return pdfReadableStream;
};
