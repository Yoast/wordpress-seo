/* eslint-disable no-console */
import filterFunctionWordsFromArray
	from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/el/config/functionWords";
import stem from "../../../../../../../src/languageProcessing/languages/el/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );
const morphologyDataEL = getMorphologyData( "el" ).el;

describe( "Generate stems for Greek words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataEL ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
