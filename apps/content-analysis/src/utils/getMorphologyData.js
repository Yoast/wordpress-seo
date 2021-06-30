import { merge } from "lodash-es";
let morphologyData = null;

/**
 * Loads morphology data from disk, if available.
 * @returns {Object} The morphology data, or an empty object if not available.
 */
function loadLocalMorphologyData() {
	let data, dataDe, dataNL, dataES, dataFR, dataRU, dataIT, dataPT, dataID, dataPL, dataAR, dataSV, dataHE, dataHU,
		dataNB, dataTR, dataCS, dataSK = {};
	try {
		// Disabling global require to be able to fail.
		// eslint-disable-next-line global-require
		data = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-en-v4.json" );
		// eslint-disable-next-line global-require
		dataDe = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-de-v9.json" );
		// eslint-disable-next-line global-require
		dataNL = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-nl-v9.json" );
		// eslint-disable-next-line global-require
		dataES = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-es-v9.json" );
		// eslint-disable-next-line global-require
		dataFR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-fr-v9.json" );
		// eslint-disable-next-line global-require
		dataRU = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-ru-v9.json" );
		// eslint-disable-next-line global-require
		dataIT = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-it-v9.json" );
		// eslint-disable-next-line global-require
		dataPT = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-pt-v9.json" );
		// eslint-disable-next-line global-require
		dataID = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-id-v9.json" );
		// eslint-disable-next-line global-require
		dataPL = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-pl-v9.json" );
		// eslint-disable-next-line global-require
		dataAR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-ar-v9.json" );
		// eslint-disable-next-line global-require
		dataSV = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-sv-v1.json" );
		// eslint-disable-next-line global-require
		dataHE = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-he-v1.json" );
		// eslint-disable-next-line global-require
		dataHU = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-hu-v2.json" );
		// eslint-disable-next-line global-require
		dataNB = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-nb-v1.json" );
		// eslint-disable-next-line global-require
		dataTR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-tr-v1.json" );
		// eslint-disable-next-line global-require
		dataCS = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-cs-v1.json" );
		// eslint-disable-next-line global-require
		dataSK = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-sk-v1.json" );
	} catch ( error ) {
		// Falling back to empty data.
	}
	return merge( data, dataDe, dataNL, dataES, dataFR, dataRU, dataIT, dataPT, dataID, dataPL, dataAR, dataSV, dataHE, dataHU, dataNB, dataTR,
		dataCS, dataSK );
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
