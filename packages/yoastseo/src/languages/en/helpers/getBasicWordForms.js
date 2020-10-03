import { createBasicWordForms as createBasicWordFormsHebrew } from "../morphology/he/createBasicWordForms";
import { createBasicWordForms as createBasicWordFormsArabic } from "../morphology/ar/createBasicWordForms";
import { createBasicWordForms as createBasicWordFormsFarsi } from "../morphology/fa/createBasicWordForms";

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
