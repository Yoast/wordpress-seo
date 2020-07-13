import { createBasicStem } from "../../../src/morphology/hebrew/createBasicStem";

const wordsToStem = [
	/*
	 * To the land "לארץ"
	 * Land "ארץ"
	 */
	[ "לארץ", "ארץ" ],
	/*
	 * In the beginning "בראשית"
	 * Beginning "ראשית"
	 */
	[ "בראשית", "ראשית" ],
	/*
	 * The world "העולם"
	 * World "עולם"
	 */
	[ "העולם", "עולם" ],
	/*
	 * Which happened "שקרה"
	 * it happened "קרה"
	 */
	[ "שקרה", "קרה" ],
	/*
	 * From a king "ממלך"
	 * King "מלך"
	 */
	[ "ממלך", "מלך" ],
	/*
	 * As a king "כמלך"
	 * King "מלך"
	 */
	[ "כמלך", "מלך" ],
	/*
	 * And he והוא
	 * He הוא
	 */
	[ "והוא", "הוא" ],
];

describe( "Test for creating a basic stem for Hebrew words", () => {
	it( "creates a basic stem for a Hebrew word", () => {
		wordsToStem.forEach( wordToStem => expect( createBasicStem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
