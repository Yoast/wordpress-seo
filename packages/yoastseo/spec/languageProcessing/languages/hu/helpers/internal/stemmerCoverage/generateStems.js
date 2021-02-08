/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/hu/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import functionWords from "../../../../../../../src/languageProcessing/languages/hu/config/functionWords";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );
const morphologyDataHU = getMorphologyData( "hu" ).hu;

describe( "Generate stems for Hungarian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataHU ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
