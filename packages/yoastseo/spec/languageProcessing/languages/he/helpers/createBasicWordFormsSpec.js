import { createBasicWordForms } from "../../../../../src/languageProcessing/languages/he/helpers/createBasicWordForms";

const wordsToStem = [
	// Creates prefixed forms based on an input word that starts with a valid prefix.
	/*
	 * Prefix ל "to"
	 * To the land "לארץ"
	 * Land "ארץ"
	 */
	{
		original: "לארץ",
		forms: [
			// Prefixed forms based on original:
			"בלארץ",
			"הלארץ",
			"ולארץ",
			"כלארץ",
			"ללארץ",
			"מלארץ",
			"שלארץ",
			// De-prefixed form:
			"ארץ",
			// Other prefixed forms based on de-prefixed form:
			"בארץ",
			"הארץ",
			"וארץ",
			"כארץ",
			"לארץ",
			"מארץ",
			"שארץ",
		],
	},
	/*
	* Prefix ב "in"
	 * In the beginning "בראשית"
	 * Beginning "ראשית"
	 */
	{
		original: "בראשית",
		forms: [
			// Prefixed forms based on original:
			"בבראשית",
			"הבראשית",
			"ובראשית",
			"כבראשית",
			"לבראשית",
			"מבראשית",
			"שבראשית",
			// De-prefixed form:
			"ראשית",
			// Other prefixed forms based on de-prefixed form:
			"בראשית",
			"הראשית",
			"וראשית",
			"כראשית",
			"לראשית",
			"מראשית",
			"שראשית",
		],
	},
	/*
	 * Prefix ה "the"
	 * The world "העולם"
	 * World "עולם"
	 */
	{
		original: "העולם",
		forms: [
			// Prefixed forms based on original:
			"בהעולם",
			"ההעולם",
			"והעולם",
			"כהעולם",
			"להעולם",
			"מהעולם",
			"שהעולם",
			// De-prefixed form:
			"עולם",
			// Other prefixed forms based on de-prefixed form:
			"בעולם",
			"העולם",
			"ועולם",
			"כעולם",
			"לעולם",
			"מעולם",
			"שעולם",
		],
	},
	/*
	 * Prefix ש "which"
	 * Which happened "שקרה"
	 * it happened "קרה"
	 */
	{
		original: "שקרה",
		forms: [
			// Prefixed forms based on original:
			"בשקרה",
			"השקרה",
			"ושקרה",
			"כשקרה",
			"לשקרה",
			"משקרה",
			"ששקרה",
			// De-prefixed form:
			"קרה",
			// Other prefixed forms based on de-prefixed form:
			"בקרה",
			"הקרה",
			"וקרה",
			"כקרה",
			"לקרה",
			"מקרה",
			"שקרה",
		],
	},
	/*
	 * From a king "ממלך"
	 * King "מלך"
	 */
	{
		original: "ממלך",
		forms: [
			// Prefixed forms based on original:
			"בממלך",
			"הממלך",
			"וממלך",
			"כממלך",
			"לממלך",
			"מממלך",
			"שממלך",
			// De-prefixed form:
			"מלך",
			// Other prefixed forms based on de-prefixed form:
			"במלך",
			"המלך",
			"ומלך",
			"כמלך",
			"למלך",
			"ממלך",
			"שמלך",
		],
	},
	/*
	 * Prefix כ "as"
	 * As a king "כמלך"
	 * King "מלך"
	 */
	{
		original: "כמלך",
		forms: [
			// Prefixed forms based on original:
			"בכמלך",
			"הכמלך",
			"וכמלך",
			"ככמלך",
			"לכמלך",
			"מכמלך",
			"שכמלך",
			// De-prefixed form:
			"מלך",
			// Other prefixed forms based on de-prefixed form:
			"במלך",
			"המלך",
			"ומלך",
			"כמלך",
			"למלך",
			"ממלך",
			"שמלך",
		],
	},
	/*
	 * Prefix ו "and"
	 * And he "והוא"
	 * He "הוא"
	 */
	{
		original: "והוא",
		forms: [
			// Prefixed forms based on original:
			"בוהוא",
			"הוהוא",
			"ווהוא",
			"כוהוא",
			"לוהוא",
			"מוהוא",
			"שוהוא",
			// De-prefixed form:
			"הוא",
			// Other prefixed forms based on de-prefixed form:
			"בהוא",
			"ההוא",
			"והוא",
			"כהוא",
			"להוא",
			"מהוא",
			"שהוא",
		],
	},
	// When a word doesn't start with one of the prefixes, the stemmer only creates prefixed words based on the original:
	{
		original: "חתול",
		forms: [
			// Prefixed forms based on original:
			"בחתול",
			"החתול",
			"וחתול",
			"כחתול",
			"לחתול",
			"מחתול",
			"שחתול",
		],
	},
];

describe( "Test for creating basic word forms for Hebrew words", () => {
	it( "creates basic word forms for a Hebrew word", () => {
		wordsToStem.forEach( wordToStem => expect( createBasicWordForms( wordToStem.original ) ).toEqual( wordToStem.forms ) );
	} );
} );
