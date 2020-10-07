import { createBasicWordForms as createBasicWordFormsHebrew } from "../../languageProcessing/languages/he/morphology/createBasicWordForms";
import { createBasicWordForms as createBasicWordFormsArabic } from "../../languageProcessing/languages/ar/morphology/createBasicWordForms";
import { createBasicWordForms as createBasicWordFormsFarsi } from "../../languageProcessing/languages/fa/morphology/createBasicWordForms";

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
