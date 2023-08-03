import metaDescriptionKeyword from "../../../src/languageProcessing/researches/metaDescriptionKeyword";

import getMorphologyData from "../../specHelpers/getMorphologyData";

import Paper from "../../../src/values/Paper.js";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";

/**
 * Loops through an array of objects containing a meta description and keyword, and for each object console logs the
 * number of times the keyphrase is found in the meta description.
 *
 * @param testDataArray
 * @param {string} language	The language of the keyphrase and meta descriptions.
 */
export function testMetaDescriptionKeyphrase( testDataArray, language ) {
	testDataArray.forEach( ( testData ) => {
		const paper = new Paper( "", { keyword: testData.keyphrase, description: testData.description } );
		const researcher = new Researcher( paper );
		const morphologyData = getMorphologyData( language );
		researcher.addResearchData( "morphology", morphologyData );
		const result = metaDescriptionKeyword( paper, researcher );
		console.log( result );
	} );
}
