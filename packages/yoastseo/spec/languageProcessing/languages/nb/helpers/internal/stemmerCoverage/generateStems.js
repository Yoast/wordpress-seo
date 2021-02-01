/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/nb/helpers/internal/stem";
import filterFunctionWordsFromArray
	from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/nb/config/functionWords";

const morphologyDataNB = getMorphologyData( "nb" ).nb;
const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );

describe( "Generate stems for Norwegian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataNB ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
