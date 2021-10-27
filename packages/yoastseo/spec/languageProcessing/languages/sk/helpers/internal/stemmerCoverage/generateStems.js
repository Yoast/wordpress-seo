/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/sk/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";

const morphologyDataSK = getMorphologyData( "sk" ).sk;

describe( "Generate stems for Slovak words", () => {
	const corpusWithStems = sampleVocabulary.words.map( word => [ word, stem( word, morphologyDataSK ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
