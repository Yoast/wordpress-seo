/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/cz/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";

const morphologyDataCZ = getMorphologyData( "cz" ).cz;

describe( "Generate stems for Czech words", () => {
	const corpusWithStems = sampleVocabulary.words.map( word => [ word, stem( word, morphologyDataCZ ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
