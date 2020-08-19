/* eslint-disable no-console */
import stem from "../../../../src/morphology/arabic/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const sampleWords = sampleVocabulary.words;

const morphologyDataAR = getMorphologyData( "ar" ).ar;

describe( "Generate stems for Arabic words", () => {
	const corpusWithStems = sampleWords.map( word => [ word, stem( word, morphologyDataAR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
