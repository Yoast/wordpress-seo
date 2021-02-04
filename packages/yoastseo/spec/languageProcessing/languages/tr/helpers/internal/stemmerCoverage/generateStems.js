/* eslint-disable no-console */
import filterFunctionWordsFromArray
	from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray";
import stem from "../../../../../../../src/languageProcessing/languages/tr/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";
import functionWords from "../../../../../../../src/languageProcessing/languages/tr/config/functionWords";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );
const morphologyDataTR = getMorphologyData( "tr" ).tr;

describe( "Generate stems for Turkish words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataTR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
