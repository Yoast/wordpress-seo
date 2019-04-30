import en from "../../premium-configuration/data/morphologyData.json";
import de from "../../premium-configuration/data/morphologyData-de-v2.json";


const morphologyData = {
	en,
	de,
};

/**
 * Requires morphology data. To be used in the analysis to recognize different word forms.
 *
 * @param {string} language The language for which to load the morphology data.
 *
 * @returns {Object} The morphology data.
 */
export default function getMorphologyData( language ) {
	if ( morphologyData[ language ] ) {
		return morphologyData[ language ];
	}

	return {};
}
