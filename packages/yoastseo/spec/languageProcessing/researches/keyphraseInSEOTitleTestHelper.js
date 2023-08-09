import KeyphraseInSEOTitleAssessment from "../../../src/scoring/assessments/seo/KeyphraseInSEOTitleAssessment";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import Paper from "../../../src/values/Paper.js";

// Researchers.
import en from "../../../src/languageProcessing/languages/en/Researcher";
import nl from "../../../src/languageProcessing/languages/nl/Researcher";
import pl from "../../../src/languageProcessing/languages/pl/Researcher";

const researchers = {
	en,
	nl,
	pl,
};
/**
 * Loops through an array of objects containing an SEO title and keyword, and for each object console logs the
 * score that the title gets on the keyphrase in SEO title assessment.
 *
 * @param {Object[]} testDataArray	The array with objects containing the keyphrase and SEO title.
 * @param {string} language	The language of the keyphrase and SEO title.
 *
 * @returns {void}
 */
export function testKeyphraseinSEOTitle( testDataArray, language ) {
	testDataArray.forEach( ( testData ) => {
		const paper = new Paper( "", { keyword: testData.keyphrase, title: testData.title } );

		// Use language-specific researcher and morphology data.
		const researcherName = researchers[ language ];
		// eslint-disable-next-line new-cap
		const researcher = new researcherName( paper );
		const morphologyData = getMorphologyData( language );
		researcher.addResearchData( "morphology", morphologyData );

		const assessment = new KeyphraseInSEOTitleAssessment().getResult( paper, researcher );
		const score = assessment.getScore();
		// eslint-disable-next-line no-console
		console.log( score );
	} );
}
