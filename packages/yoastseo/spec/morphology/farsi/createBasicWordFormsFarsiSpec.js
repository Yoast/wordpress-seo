import { createBasicWordForms } from "../../../src/languages/legacy/morphology/farsi/createBasicWordForms";

const wordsToStem = [
	// Creates affixed forms based on an input word that starts with a valid prefix.
	/*
	 * Prefix ن "negation"
	 * Don't love "ندارم"
	 * love "دارم"
	 */
	{
		original: "ندارم",
		forms: [
			// Affixed forms based on original:
			"نندارم",
			"ندارممان",
			"ندارمشان",
			"ندارمتان",
			"ندارمش",
			"ندارمت",
			"ندارمم",
			"ندارمی",
			// De-affixed form:
			"دارم",
			// Other affixed forms based on de-prefixed form:
			"ندارم",
			"دارممان",
			"دارمشان",
			"دارمتان",
			"دارمش",
			"دارمت",
			"دارمم",
			"دارمی",
		],
	},
	/*
	 * Possessive pronoun suffix ش
	 * His/her book "کتابش"
	 * Book "کتاب"
	 */
	{
		original: "کتابش",
		forms: [
			// Affixed forms based on original:
			"نکتابش",
			"کتابشمان",
			"کتابششان",
			"کتابشتان",
			"کتابشش",
			"کتابشت",
			"کتابشم",
			"کتابشی",
			// De-affixed form:
			"کتاب",
			// Other affixed forms based on de-affixed form:
			"نکتاب",
			"کتابمان",
			"کتابشان",
			"کتابتان",
			"کتابش",
			"کتابت",
			"کتابم",
			"کتابی",
		],
	},
	/*
	 * Possessive pronoun suffix ‌اش
	 * His/her house "خانه‌اش"
	 * House "خانه" (word that ends in silent ه )
	 */
	{
		original: "خانه‌اش",
		forms: [
			// Affixed forms based on original:
			"نخانه‌اش",
			"خانه‌اشمان",
			"خانه‌اششان",
			"خانه‌اشتان",
			"خانه‌اشش",
			"خانه‌اشت",
			"خانه‌اشم",
			"خانه‌اشی",
			// De-affixed form:
			"خانه",
			// Other affixed forms based on de-affixed form:
			"نخانه",
			"خانه‌ای",
			"خانه‌یی",
			"خانه‌ام",
			"خانه‌ات",
			"خانه‌اش",
		],
	},
	/*
	 * Possessive pronoun suffix یش
	 * His/her leg "پایش"
	 * leg "پا" (word ends in ا )
	 */
	{
		original: "پایش",
		forms: [
			// Affixed forms based on original:
			"نپایش",
			"پایشمان",
			"پایششان",
			"پایشتان",
			"پایشش",
			"پایشت",
			"پایشم",
			"پایشی",
			// De-affixed form:
			"پا",
			// Other affixed forms based on de-affixed form:
			"نپا",
			"پایی",
			"پایم",
			"پایت",
			"پایش",
		],
	},
	/*
	 * A word with an ending that looks like a valid ending ی (indefinite suffix)
	 */
	{
		original: "باری",
		forms: [
			// Affixed forms based on original:
			"نباری",
			"باری‌ای",
			"باریمان",
			"باریشان",
			"باریتان",
			"باریش",
			"باریت",
			"باریم",
			"باریی",
			// De-affixed form:
			"بار",
			// Other affixed forms based on de-affixed form:
			"نبار",
			"بارمان",
			"بارشان",
			"بارتان",
			"بارش",
			"بارت",
			"بارم",
			"باری",
		],
	},
	// A word with an ending that looks like a valid suffix ش, e.g "ارزش" (value)
	{
		original: "ارزش",
		forms: [
			// Affixed forms based on original:
			"نارزش",
			"ارزشمان",
			"ارزششان",
			"ارزشتان",
			"ارزشش",
			"ارزشت",
			"ارزشم",
			"ارزشی",
			// De-affixed form:
			"ارز",
			// Other affixed forms based on de-affixed form:
			"نارز",
			"ارزمان",
			"ارزشان",
			"ارزتان",
			"ارزش",
			"ارزت",
			"ارزم",
			"ارزی",
		],
	},
	// When a word doesn't start with one of the prefixes, the stemmer only creates affixed words based on the original:
	{
		original: "ماهر",
		forms: [
			// Affixed forms based on original:
			"نماهر",
			"ماهرمان",
			"ماهرشان",
			"ماهرتان",
			"ماهرش",
			"ماهرت",
			"ماهرم",
			"ماهری",
		],
	},
];

describe( "Test for creating basic word forms for Farsi words", () => {
	it( "creates basic word forms for an Farsi word", () => {
		wordsToStem.forEach( wordToStem => expect( createBasicWordForms( wordToStem.original ) ).toEqual( wordToStem.forms ) );
	} );
} );
