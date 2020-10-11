/* eslint-disable no-console */
import filterFunctionWordsFromArray from "../../../../src/languageProcessing/helpers/_todo/filterFunctionWordsFromArray";
import stem from "../../../../src/languageProcessing/languages/ar/morphology/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "ar" );

const morphologyDataAR = getMorphologyData( "ar" ).ar;

describe( "Generate stems for Arabic words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataAR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
