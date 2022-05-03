import { isArray } from "lodash-es";
import { isObject } from "lodash-es";
import { mapValues } from "lodash-es";

import AssessmentResult from "../../values/AssessmentResult";
import Mark from "../../values/Mark";
import Paper from "../../values/Paper";
import Sentence from "../../languageProcessing/values/Sentence";
import Clause from "../../languageProcessing/values/Clause";
import ProminentWord from "../../languageProcessing/values/ProminentWord";

const PARSE_CLASSES = {
	AssessmentResult,
	Mark,
	Paper,
	Sentence,
	Clause,
	ProminentWord,
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
		return thing._parseClass === "Sentence" || thing._parseClass === "Clause"
			? PARSE_CLASSES[ thing._parseClass ].prototype.parse( thing )
			: PARSE_CLASSES[ thing._parseClass ].parse( thing );
	}

	if ( thingIsObject ) {
		return mapValues( thing, ( value ) => parse( value ) );
	}

	return thing;
}
