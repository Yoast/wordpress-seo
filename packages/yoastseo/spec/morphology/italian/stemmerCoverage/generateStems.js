/* eslint-disable no-console */
import stem from "../../../../src/morphology/italian/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "it" );

describe( "Generate stems for Italian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
