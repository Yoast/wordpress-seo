/* eslint-disable no-console */
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray";
import stem from "../../../../src/morphology/arabic/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "ar" );

const morphologyDataAR = getMorphologyData( "ar" ).ar;

describe( "Generate stems for Arabic words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataAR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
