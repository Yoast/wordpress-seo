import en from "../../premium-configuration/data/morphologyData-v3.json";
import de from "../../premium-configuration/data/morphologyData-de-v4.json";
import nl from "../../premium-configuration/data/morphologyData-nl-v4.json";
import es from "../../premium-configuration/data/morphologyData-es-v4.json";

const morphologyData = {
	en,
	de,
	nl,
	es,
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
