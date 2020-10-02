/* eslint-disable no-console */
import stem from "../../../../src/languages/legacy/morphology/polish/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../src/languages/legacy/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "pl" );
const morphologyDataPL = getMorphologyData( "pl" ).pl;

describe( "Generate stems for Polish words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataPL ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
