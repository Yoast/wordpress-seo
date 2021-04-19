/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/pl/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/pl/config/functionWords";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );
const morphologyDataPL = getMorphologyData( "pl" ).pl;

describe( "Generate stems for Polish words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataPL ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
