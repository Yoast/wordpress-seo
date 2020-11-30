/* eslint-disable no-console */
import stem from "../../../../src/languageProcessing/languages/pt/helpers/internal/stem";
import filterFunctionWordsFromArray from "../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "pt" );

describe( "Generate stems for Portuguese words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
