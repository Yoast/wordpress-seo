/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/fr/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "fr" );
const morphologyDataFR = getMorphologyData( "fr" ).fr;

describe( "Generate stems for French words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataFR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
