/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/pt/helpers/internal/stem";
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/pt/config/functionWords";

const morphologyData = getMorphologyData( "pt" ).pt;

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );

describe( "Generate stems for Portuguese words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyData ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
