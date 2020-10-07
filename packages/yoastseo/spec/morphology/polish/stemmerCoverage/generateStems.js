/* eslint-disable no-console */
import stem from "../../../../src/languageProcessing/languages/pl/morphology/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../src/helpers/_todo/filterFunctionWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "pl" );
const morphologyDataPL = getMorphologyData( "pl" ).pl;

describe( "Generate stems for Polish words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataPL ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
