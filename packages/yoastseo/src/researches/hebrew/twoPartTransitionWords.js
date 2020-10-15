/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array}              The array filled with two-part transition words.
 */
export default function() {
	return [ [ "או", "או" ], [ "אין", "אלא" ], [ "לא", "אלא" ], [ "מצד אחד", "מצד אחר" ], [ "מחד גיסא", "מאידך גיסא" ],
		[ "ראשית", "שנית" ], [ "תחילה", "לבסוף" ], [ "משום ש", "מפני ש" ], [ "לכאורה", "אך" ] ];
}
