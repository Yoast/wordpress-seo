/* eslint-disable no-console */
import stem from "../../../../src/morphology/turkish/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sampleVocabulary from "../stemmerCoverage/sampleVocabulary.json";

const sampleWords = sampleVocabulary.words;

const morphologyDataTR = getMorphologyData( "tr" ).id;

describe( "Generate stems for Turkish words", () => {
	const corpusWithStems = sampleWords.map( word => [ word, stem( word, morphologyDataTR ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
