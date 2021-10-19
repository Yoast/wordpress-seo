/* eslint-disable global-require */
// Disabling global require to be able to fail.

import { merge } from "lodash-es";
let morphologyData = null;

/**
 * Loads morphology data from disk, if available.
 * @returns {Object} The morphology data, or an empty object if not available.
 */
function loadLocalMorphologyData() {
	let data, dataDe, dataNL, dataES, dataFR, dataRU, dataIT, dataPT, dataID, dataPL, dataAR, dataSV, dataHE, dataHU,
		dataNB, dataTR, dataCS, dataSK, dataEL, dataJA = {};
	try {
		data = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-en-v4.json" );
		dataDe = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-de-v9.json" );
		dataNL = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-nl-v9.json" );
		dataES = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-es-v9.json" );
		dataFR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-fr-v9.json" );
		dataRU = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-ru-v10.json" );
		dataIT = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-it-v10.json" );
		dataPT = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-pt-v9.json" );
		dataID = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-id-v9.json" );
		dataPL = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-pl-v9.json" );
		dataAR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-ar-v9.json" );
		dataSV = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-sv-v1.json" );
		dataHE = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-he-v1.json" );
		dataHU = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-hu-v2.json" );
		dataNB = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-nb-v1.json" );
		dataTR = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-tr-v1.json" );
		dataCS = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-cs-v1.json" );
		dataSK = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-sk-v1.json" );
		dataEL = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-el-v1.json" );
		dataJA = require( "../../../../packages/yoastseo/premium-configuration/data/morphologyData-ja-v1.json" );
	} catch ( error ) {
		// Falling back to empty data.
	}
	return merge( data, dataDe, dataNL, dataES, dataFR, dataRU, dataIT, dataPT, dataID, dataPL, dataAR, dataSV, dataHE, dataHU, dataNB, dataTR,
		dataCS, dataSK, dataEL, dataJA );
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
