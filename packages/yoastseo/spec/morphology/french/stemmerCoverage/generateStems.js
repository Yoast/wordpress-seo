/* eslint-disable no-console */
import stem from "../../../../src/languages/legacy/morphology/french/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../src/languages/legacy/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "fr" );
const morphologyDataFR = getMorphologyData( "fr" ).fr;

describe( "Generate stems for French words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataFR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
