/* eslint-disable no-console */
import stem from "../../../../src/stringProcessing/languages/fr/morphology/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../src/helpers/_todo/filterFunctionWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "fr" );
const morphologyDataFR = getMorphologyData( "fr" ).fr;

describe( "Generate stems for French words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataFR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
