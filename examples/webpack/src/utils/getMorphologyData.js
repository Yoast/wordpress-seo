let morphologyData = null;

function loadLocalMorphologyData() {
	let data = {};
	try {
		// Disabling global require to be able to fail.
		// eslint-disable-next-line global-require
		data = require( "../../../../premium-configuration/data/morphologyData.json" );
	} catch ( error ) {
		// Falling back to empty data.
	}
	return data;
}


export default function getMorphologyData() {
	if ( morphologyData === null ) {
		morphologyData = loadLocalMorphologyData();
	}
	return morphologyData;
}
