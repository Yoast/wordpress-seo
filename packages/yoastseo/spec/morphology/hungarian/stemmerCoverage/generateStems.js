/* eslint-disable no-console */
import stem from "../../../../src/morphology/hungarian/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "hu" );
const morphologyDataSV = getMorphologyData( "hu" ).hu;

describe( "Generate stems for Hungarian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataHU ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
