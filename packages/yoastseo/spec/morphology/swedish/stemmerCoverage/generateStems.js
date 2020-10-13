/* eslint-disable no-console */
import stem from "../../../../src/morphology/swedish/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "sv" );
const morphologyDataSV = getMorphologyData( "sv" ).sv;

describe( "Generate stems for Swedish words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataSV ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
