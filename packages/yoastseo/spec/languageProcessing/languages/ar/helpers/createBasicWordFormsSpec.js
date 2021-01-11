import createBasicWordForms from "../../../../../src/languageProcessing/languages/ar/helpers/createBasicWordForms";

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
			"سلتجاهل",
			"ألتجاهل",
			// De-prefixed form:
			"تجاهل",
			// Other prefixed forms based on de-prefixed form:
			"لتجاهل",
			"بتجاهل",
			"التجاهل",
			"كتجاهل",
			"وتجاهل",
			"فتجاهل",
			"ستجاهل",
			"أتجاهل",
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
			"سبسعادة",
			"أبسعادة",
			// De-prefixed form:
			"سعادة",
			// Other prefixed forms based on de-prefixed form:
			"لسعادة",
			"بسعادة",
			"السعادة",
			"كسعادة",
			"وسعادة",
			"فسعادة",
			"سسعادة",
			"أسعادة",
		],
	},
	/*
	 * Prefix ال "the"
	 * The home "المنزل"
	 * Home "منزل"
	 */
	{
		original: "المنزل",
		forms: [
			// Prefixed forms based on original:
			"لالمنزل",
			"بالمنزل",
			"الالمنزل",
			"كالمنزل",
			"والمنزل",
			"فالمنزل",
			"سالمنزل",
			"أالمنزل",
			// De-prefixed form:
			"منزل",
			// Other prefixed forms based on de-prefixed form:
			"لمنزل",
			"بمنزل",
			"المنزل",
			"كمنزل",
			"ومنزل",
			"فمنزل",
			"سمنزل",
			"أمنزل",
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
			"سكطائر",
			"أكطائر",
			// De-prefixed form:
			"طائر",
			// Other prefixed forms based on de-prefixed form:
			"لطائر",
			"بطائر",
			"الطائر",
			"كطائر",
			"وطائر",
			"فطائر",
			"سطائر",
			"أطائر",
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
			"وومفتاح",
			"فومفتاح",
			"سومفتاح",
			"أومفتاح",
			// De-prefixed form:
			"مفتاح",
			// Other prefixed forms based on de-prefixed form:
			"لمفتاح",
			"بمفتاح",
			"المفتاح",
			"كمفتاح",
			"ومفتاح",
			"فمفتاح",
			"سمفتاح",
			"أمفتاح",
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
			"سفأجبتك",
			"أفأجبتك",
			// De-prefixed form:
			"أجبتك",
			// Other prefixed forms based on de-prefixed form:
			"لأجبتك",
			"بأجبتك",
			"الأجبتك",
			"كأجبتك",
			"وأجبتك",
			"فأجبتك",
			"سأجبتك",
			"أأجبتك",
		],
	},
	/*
     * Prefix س "will, being willing"
     * He will write "سيكتب"
     * He writes "يكتب"
     */
	{
		original: "سيكتب",
		forms: [
			// Prefixed forms based on original:
			"لسيكتب",
			"بسيكتب",
			"السيكتب",
			"كسيكتب",
			"وسيكتب",
			"فسيكتب",
			"سسيكتب",
			"أسيكتب",
			// De-prefixed form:
			"يكتب",
			// Other prefixed forms based on de-prefixed form:
			"ليكتب",
			"بيكتب",
			"اليكتب",
			"كيكتب",
			"ويكتب",
			"فيكتب",
			"سيكتب",
			"أيكتب",
		],
	},
	/*
     * Prefix أأكلت "Questioning prefix"
     * Did you eat? "أأكلت"
     * You ate "أكلت"
     */
	{
		original: "أأكلت",
		forms: [
			// Prefixed forms based on original:
			"لأأكلت",
			"بأأكلت",
			"الأأكلت",
			"كأأكلت",
			"وأأكلت",
			"فأأكلت",
			"سأأكلت",
			"أأأكلت",
			// De-prefixed form:
			"أكلت",
			// Other prefixed forms based on de-prefixed form:
			"لأكلت",
			"بأكلت",
			"الأكلت",
			"كأكلت",
			"وأكلت",
			"فأكلت",
			"سأكلت",
			"أأكلت",
		],
	},
	// A word with a beginning that looks like a valid prefix, e.g "فرقان" (differences)
	{
		original: "فرقان",
		forms: [
			// Prefixed forms based on original:
			"لفرقان",
			"بفرقان",
			"الفرقان",
			"كفرقان",
			"وفرقان",
			"ففرقان",
			"سفرقان",
			"أفرقان",
			// De-prefixed form:
			"رقان",
			// Other prefixed forms based on de-prefixed form:
			"لرقان",
			"برقان",
			"الرقان",
			"كرقان",
			"ورقان",
			"فرقان",
			"سرقان",
			"أرقان",
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
			"سقط",
			"أقط",
		],
	},
];

describe( "Test for creating basic word forms for Arabic words", () => {
	it( "creates basic word forms for an Arabic word", () => {
		wordsToStem.forEach( wordToStem => expect( createBasicWordForms( wordToStem.original ) ).toEqual( wordToStem.forms ) );
	} );
} );
