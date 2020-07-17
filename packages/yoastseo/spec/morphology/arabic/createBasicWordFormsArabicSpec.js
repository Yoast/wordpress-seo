import { createBasicWordForms } from "../../../src/morphology/arabic/createBasicWordForms";

const wordsToStem = [
	// Creates prefixed forms based on an input word that starts with a valid prefix.
	/*
	 * Prefix ل "to, because"
	 * To ignore "لتجاهل"
	 * Ignore "تجاهل"
	 */
	{
		original: "لتجاهل",
		forms: [
			// Prefixed forms based on original:
			"للتجاهل",
			"بلتجاهل",
			"اللتجاهل",
			"كلتجاهل",
			"ولتجاهل",
			"فلتجاهل",
			// De-prefixed form:
			"تجاهل",
			// Other prefixed forms based on de-prefixed form:
			"لتجاهل",
			"بتجاهل",
			"التجاهل",
			"كتجاهل",
			"وتجاهل",
			"فتجاهل",
		],
	},
	/*
	 * Prefix ب "with, in, by"
	 * With happiness "بسعادة"
	 * Happiness "سعادة"
	 */
	{
		original: "بسعادة",
		forms: [
			// Prefixed forms based on original:
			"لبسعادة",
			"ببسعادة",
			"البسعادة",
			"كبسعادة",
			"وبسعادة",
			"فبسعادة",
			// De-prefixed form:
			"سعادة",
			// Other prefixed forms based on de-prefixed form:
			"لسعادة",
			"بسعادة",
			"السعادة",
			"كسعادة",
			"وسعادة",
			"فسعادة",
		],
	},
	/*
	 * Prefix ال "the"
	 * The lady "للسيدة"
	 * Lady "سيدة"
	 */
	{
		original: "للسيدة",
		forms: [
			// Prefixed forms based on original:
			"لللسيدة",
			"بللسيدة",
			"الللسيدة",
			"كللسيدة",
			"وللسيدة",
			"فللسيدة",
			// De-prefixed form:
			"سيدة",
			// Other prefixed forms based on de-prefixed form:
			"لسيدة",
			"بسيدة",
			"السيدة",
			"كسيدة",
			"وسيدة",
			"فسيدة",
		],
	},

	/*
	 * Prefix ك "like, as"
	 * Like a bird "كطائر"
	 * Bird "طائر"
	 */
	{
		original: "كطائر",
		forms: [
			// Prefixed forms based on original:
			"لكطائر",
			"بكطائر",
			"الكطائر",
			"ككطائر",
			"وكطائر",
			"فكطائر",
			// De-prefixed form:
			"طائر",
			// Other prefixed forms based on de-prefixed form:
			"لطائر",
			"بطائر",
			"الطائر",
			"كطائر",
			"وطائر",
			"فطائر",
		],
	},
	/*
	 * Prefix و "and"
	 * And key "ومفتاح"
	 * Key "مفتاح"
	 */
	{
		original: "ومفتاح",
		forms: [
			// Prefixed forms based on original:
			"لومفتاح",
			"بومفتاح",
			"الومفتاح",
			"كومفتاح",
			"ومفتاح",
			"وومفتاح",
			"فومفتاح",
			// De-prefixed form:
			"مفتاح",
			// Other prefixed forms based on de-prefixed form:
			"لمفتاح",
			"بمفتاح",
			"المفتاح",
			"كمفتاح",
			"ومفتاح",
			"فمفتاح",
		],
	},
	/*
     * Prefix ف "so, then"
     * So I answered you "فأجبتك"
     * I answered you "أجبتك"
     */
	{
		original: "فأجبتك",
		forms: [
			// Prefixed forms based on original:
			"لفأجبتك",
			"بفأجبتك",
			"الفأجبتك",
			"كفأجبتك",
			"وفأجبتك",
			"ففأجبتك",
			// De-prefixed form:
			"أجبتك",
			// Other prefixed forms based on de-prefixed form:
			"لأجبتك",
			"بأجبتك",
			"الأجبتك",
			"كأجبتك",
			"وأجبتك",
			"فأجبتك",
		],
	},
	// When a word doesn't start with one of the prefixes, the stemmer only creates prefixed words based on the original:
	{
		original: "قط",
		forms: [
			// Prefixed forms based on original:
			"لقط",
			"بقط",
			"القط",
			"كقط",
			"وقط",
			"فقط",
		],
	},
];

describe( "Test for creating basic word forms for Arabic words", () => {
	it( "creates basic word forms for an Arabic word", () => {
		wordsToStem.forEach( wordToStem => expect( createBasicWordForms( wordToStem.original ) ).toEqual( wordToStem.forms ) );
	} );
} );
