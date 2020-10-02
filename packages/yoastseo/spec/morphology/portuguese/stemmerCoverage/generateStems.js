/* eslint-disable no-console */
import stem from "../../../../src/languages/legacy/morphology/portuguese/stem";
import filterFunctionWordsFromArray from "../../../../src/languages/legacy/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "pt" );

describe( "Generate stems for Portuguese words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
