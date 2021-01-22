/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/id/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import sampleVocabulary from "./sampleVocabulary.json";

const sampleWords = sampleVocabulary.words;

const morphologyDataID = getMorphologyData( "id" ).id;

describe( "Generate stems for Indonesian words", () => {
	const corpusWithStems = sampleWords.map( word => [ word, stem( word, morphologyDataID ) ] );

	console.log( JSON.stringify( corpusWithStems ) );
} );
