/* eslint-disable no-console */
import stem from "../../../../src/languages/legacy/morphology/russian/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../src/languages/legacy/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";
const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "ru" );
const morphologyDataRU = getMorphologyData( "ru" ).ru;
describe( "Generate stems for Russian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataRU ) ] );
	console.log( JSON.stringify( corpusWithStems ) );
} );
