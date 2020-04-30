import en from "../../premium-configuration/data/morphologyData-v3.json";
import de from "../../premium-configuration/data/morphologyData-de-v5.json";
import nl from "../../premium-configuration/data/morphologyData-nl-v5.json";
import es from "../../premium-configuration/data/morphologyData-es-v5.json";
import fr from "../../premium-configuration/data/morphologyData-fr-v5.json";
import ru from "../../premium-configuration/data/morphologyData-ru-v6.json";


const morphologyData = {
	en,
	de,
	nl,
	es,
	fr,
	ru,
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
