import { merge } from "lodash-es";
let morphologyData = null;

/**
 * Loads morphology data from disk, if available.
 * @returns {Object} The morphology data, or an empty object if not available.
 */
function loadLocalMorphologyData() {
	let data, dataDe, dataNL, dataES, dataFR, dataRU, dataIT = {};
	try {
		// Disabling global require to be able to fail.
		// eslint-disable-next-line global-require
		data = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-v3.json" );
		// eslint-disable-next-line global-require
		dataDe = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-de-v6.json" );
		// eslint-disable-next-line global-require
		dataNL = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-nl-v6.json" );
		// eslint-disable-next-line global-require
		dataES = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-es-v6.json" );
		// eslint-disable-next-line global-require
		dataFR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-fr-v6.json" );
		// eslint-disable-next-line global-require
		dataRU = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-ru-v6.json" );
		// eslint-disable-next-line global-require
		dataIT = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-it-v6.json" );
	} catch ( error ) {
		// Falling back to empty data.
	}

	return merge( data, dataDe, dataNL, dataES, dataFR, dataRU, dataIT );
}

/**
 * Get morphology data. To be used in the analysis to recognize different word forms.
 * @returns {Object} The morphology data.
 */
export default function getMorphologyData() {
	if ( morphologyData === null ) {
		morphologyData = loadLocalMorphologyData();
	}
	return morphologyData;
}
