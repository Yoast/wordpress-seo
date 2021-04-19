/* eslint-disable no-console */
import filterFunctionWordsFromArray from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray";
import stem from "../../../../../../../src/languageProcessing/languages/ar/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/ar/config/functionWords";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );

const morphologyDataAR = getMorphologyData( "ar" ).ar;

describe( "Generate stems for Arabic words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataAR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
