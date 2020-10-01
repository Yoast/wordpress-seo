/* eslint-disable no-console */
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "he" );


describe( "Generate stems for Arabic words", () => {

	console.log( JSON.stringify( wordsToStemWithoutFunctionWords ) );
} );
