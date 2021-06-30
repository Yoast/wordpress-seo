import en from "../../premium-configuration/data/morphologyData-en-v4.json";
import de from "../../premium-configuration/data/morphologyData-de-v9.json";
import nl from "../../premium-configuration/data/morphologyData-nl-v9.json";
import es from "../../premium-configuration/data/morphologyData-es-v9.json";
import fr from "../../premium-configuration/data/morphologyData-fr-v9.json";
import ru from "../../premium-configuration/data/morphologyData-ru-v9.json";
import it from "../../premium-configuration/data/morphologyData-it-v9.json";
import pt from "../../premium-configuration/data/morphologyData-pt-v9.json";
import id from "../../premium-configuration/data/morphologyData-id-v9.json";
import pl from "../../premium-configuration/data/morphologyData-pl-v9.json";
import ar from "../../premium-configuration/data/morphologyData-ar-v9.json";
import sv from "../../premium-configuration/data/morphologyData-sv-v1.json";
import hu from "../../premium-configuration/data/morphologyData-hu-v2.json";
import he from "../../premium-configuration/data/morphologyData-he-v1.json";
import nb from "../../premium-configuration/data/morphologyData-nb-v1.json";
import tr from "../../premium-configuration/data/morphologyData-tr-v1.json";
import cs from "../../premium-configuration/data/morphologyData-cs-v1.json";
import sk from "../../premium-configuration/data/morphologyData-sk-v1.json";

const morphologyData = {
	en,
	de,
	nl,
	es,
	fr,
	ru,
	it,
	pt,
	id,
	pl,
	ar,
	sv,
	hu,
	he,
	nb,
	tr,
	cs,
	sk,
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
