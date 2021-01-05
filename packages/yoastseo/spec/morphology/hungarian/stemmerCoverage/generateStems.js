/* eslint-disable no-console */
import stem from "../../../../src/morphology/hungarian/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "hu" );
const morphologyDataHU = getMorphologyData( "hu" ).hu;

describe( "Generate stems for Hungarian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataHU ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
