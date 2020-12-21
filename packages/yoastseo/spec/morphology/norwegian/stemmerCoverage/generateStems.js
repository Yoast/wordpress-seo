/* eslint-disable no-console */
import stem from "../../../../src/morphology/norwegian/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataNB = getMorphologyData( "nb" ).nb;
const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "nb" );

describe( "Generate stems for Norwegian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataNB ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
