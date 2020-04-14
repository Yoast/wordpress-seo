/* eslint-disable no-console */
import stem from "../../../../src/morphology/polish/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "pl" );

describe( "Generate stems for Polish words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
