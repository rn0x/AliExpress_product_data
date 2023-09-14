import { Rembg } from "rembg-node";
import sharp from "sharp";

/**
 * remove images background
 * by rn0x 
 * @param {Object} params
 * @param {String} params.filename مسار الصورة لحذف خلفيتها
 * @param {String} params.output مسار حفظ الصور بعد حذف خلفيتها
 * @returns {any}
 */

export default async function removeBg(params) {

	try {

		sharp.cache(false);
		const input = sharp(params?.filename);
		// optional arguments
		const rembg = new Rembg({
			logging: true,
		});

		const remove = await rembg?.remove(input);
		const output = await remove?.png()?.toFile(params?.output);

		return output

		// // # optionally you can use .trim() too!
		// await output?.trim()?.png()?.toFile("output-trimmed.png")

	} catch (error) {
		console.log(error);
	}
}