/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/it/helpers/internal/stem";
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/it/config/functionWords";

const morphologyDataIT = getMorphologyData( "it" ).it;
const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );

describe( "Generate stems for Italian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataIT ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
