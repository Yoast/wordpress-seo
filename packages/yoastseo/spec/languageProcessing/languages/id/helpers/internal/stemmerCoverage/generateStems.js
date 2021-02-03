/* eslint-disable no-console */
import filterFunctionWordsFromArray
	from "../../../../../../../src/languageProcessing/helpers/word/filterWordsFromArray";
import { all as functionWords } from "../../../../../../../src/languageProcessing/languages/id/config/functionWords";
import stem from "../../../../../../../src/languageProcessing/languages/id/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, functionWords );
const morphologyDataID = getMorphologyData( "id" ).id;

describe( "Generate stems for Indonesian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataID ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
