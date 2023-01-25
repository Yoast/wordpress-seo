/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/ru/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import functionWords from "../../../../../../../src/languageProcessing/languages/ru/config/functionWords";

const morphologyDataRU = getMorphologyData( "ru" ).ru;
const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords.all );

describe( "Generate stems for Russian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataRU ) ] );
	console.log( JSON.stringify( corpusWithStems ) );
} );
