import { createBasicWordForms as createBasicWordFormsHebrew } from "../morphology/hebrew/createBasicWordForms";
import { createBasicWordForms as createBasicWordFormsArabic } from "../morphology/arabic/createBasicWordForms";
import { createBasicWordForms as createBasicWordFormsFarsi } from "../morphology/farsi/createBasicWordForms";

/**
 * Collects functions for creating basic word forms for different languages.
 *
 * @returns {Object} An object with basic word form creation functions for multiple languages.
 */
export default function() {
	return {
		he: createBasicWordFormsHebrew,
		ar: createBasicWordFormsArabic,
		fa: createBasicWordFormsFarsi,
	};
}
