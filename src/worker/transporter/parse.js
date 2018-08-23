const isArray = require( "lodash/isArray" );
const isObject = require( "lodash/isObject" );
const mapValues = require( "lodash/mapValues" );

const AssessmentResult = require( "../../values/AssessmentResult" );
const Mark = require( "../../values/Mark" );
const Paper = require( "../../values/Paper" );
const Participle = require( "../../values/Participle" );
const Sentence = require( "../../values/Sentence" );
const SentencePart = require( "../../values/SentencePart" );
const WordCombination = require( "../../values/WordCombination" );

const PARSE_CLASSES = {
	AssessmentResult,
	Mark,
	Paper,
	Participle,
	Sentence,
	SentencePart,
	WordCombination,
};

/**
 * Parses a data structure that has previously been serialized.
 *
 * @param {*} thing The data structure to parse.
 *
 * @returns {*} The parsed data structure.
 */
export default function parse( thing ) {
	if ( isArray( thing ) ) {
		return thing.map( parse );
	}

	const thingIsObject = isObject( thing );

	if ( thingIsObject && thing._parseClass && PARSE_CLASSES[ thing._parseClass ] ) {
		return PARSE_CLASSES[ thing._parseClass ].parse( thing );
	}

	if ( thingIsObject ) {
		return mapValues( thing, ( value ) => parse( value ) );
	}

	return thing;
}
