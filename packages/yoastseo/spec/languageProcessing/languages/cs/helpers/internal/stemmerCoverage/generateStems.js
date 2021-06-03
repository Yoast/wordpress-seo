/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/cs/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";

const morphologyDataCS = getMorphologyData( "cs" ).cs;

describe( "Generate stems for Czech words", () => {
	const corpusWithStems = sampleVocabulary.words.map( word => [ word, stem( word, morphologyDataCS ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
