// Field names that do not require a new save.
const SKIP_FIELDS = [
	"yoast_wpseo_linkdex",
	"yoast_wpseo_content_score",
	"yoast_wpseo_inclusive_language_score",
	"yoast_wpseo_words_for_linking",
	"yoast_wpseo_estimated-reading-time-minutes",
];
const KEYPHRASE_FIELDS = [
	"yoast_wpseo_focuskeywords",
	"hidden_wpseo_focuskeywords",
];

/**
 * Detects if the keyphrase is not changed.
 *
 * @param {string} oldValue The old value.
 * @param {string} newValue The new value.
 *
 * @returns {boolean} True if the keyphrase is not changed.
 */
const isKeyphraseValueUnchanged = ( oldValue, newValue ) => {
	if ( newValue === oldValue ) {
		return true;
	}

	if ( newValue === "" || oldValue === "" ) {
		return false;
	}

	let newObject;
	let oldObject;
	try {
		newObject = JSON.parse( newValue );
		oldObject = JSON.parse( oldValue );
	} catch ( e ) {
		// If parsing fails, we can't compare. Let's report unchanged to skip faulty values.
		return true;
	}

	if ( newObject.length !== oldObject.length ) {
		return false;
	}

	// Check only keywords and skip scores.
	return newObject.every( ( v, index ) => v.keyword === oldObject[ index ].keyword );
};

/**
 * Checks if there is a relevant change.
 *
 * The skipped fields currently represent things that are calculated on the fly. Analysis scores and such.
 * Keyphrase fields are only relevant when the keyphrase is changed.
 *
 * @param {string} name The name.
 * @param {string} value The value.
 * @param {string} previousValue The previous value.
 *
 * @returns {boolean} True if a relevant change is detected.
 */
export const isRelevantChange = ( name, value, previousValue ) => {
	if ( SKIP_FIELDS.includes( name ) ) {
		return false;
	}

	if ( KEYPHRASE_FIELDS.includes( name ) && isKeyphraseValueUnchanged( previousValue, value ) ) {
		return false;
	}

	return value !== previousValue;
};
