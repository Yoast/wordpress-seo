import { merge } from "lodash-es";
let morphologyData = null;

/**
 * Loads morphology data from disk, if available.
 * @returns {Object} The morphology data, or an empty object if not available.
 */
function loadLocalMorphologyData() {
	let data, dataDe = {};
	try {
		// Disabling global require to be able to fail.
		// eslint-disable-next-line global-require
		data = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData.json" );
		// eslint-disable-next-line global-require
		dataDe = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-de-v3.json" );
	} catch ( error ) {
		// Falling back to empty data.
	}
	return merge( data, dataDe );
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
