/* eslint-disable no-console */
import stem from "../../../../src/morphology/norwegian/stem";
import filterFunctionWordsFromArray from "../../../../src/helpers/filterFunctionWordsFromArray.js";
import sampleVocabulary from "./sampleVocabulary.json";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataNN = getMorphologyData( "nn" ).nn;
const wordsToStemWithoutFunctionWords = filterFunctionWordsFromArray( sampleVocabulary.words, "nn" );

describe( "Generate stems for Norwegian words", () => {
	const corpusWithStems = wordsToStemWithoutFunctionWords.map( word => [ word, stem( word, morphologyDataNN ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
