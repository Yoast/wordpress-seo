import stem from "../../../src/stringProcessing/languages/ar/morphology/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataAR = getMorphologyData( "ar" ).ar;

const wordsToStem = [
	// Words with a definite article and a suffix
	[ "الجدولين", "جدول" ],
	// Two letter word with a removed duplicate letter.
	[ "صف", "صفف" ],
	// Two letter word with the word-final letter (alif) removed.
	[ "عد", "عدا" ],
	// Two letter word with the word-initial letter (waw) removed.
	[ "بأ", "وبأ" ],
	// Two letter word with the middle letter (yah) removed.
	[ "غض", "غيض" ],
	// Three letter words which is in the list of threeLetterRoots
	[ "رحل", "رحل" ],
	[ "طمو", "طمو" ],
	// Three letter word with initial letter ا/ ؤ/ ئ (yeh_hamza/waw_hamza/alef), change the initial letter to أ (alef_hamza_above)
	[ "ؤكد", "أكد" ],
	[ "ازب", "أزب" ],
	// Three letter words ending in weak letter ي/ا/ى/ء (yeh_hamza/hamza/yeh_maksorah/alef/yeh/waw)
	// And the root is in the list of words with the last weak letter or hamza removed.
	[ "غبي", "غبي" ],
	[ "دعا", "دعا" ],
	[ "بدء", "بدأ" ],
	[ "كرى", "كرى" ],
	// Three letter words ending in weak letter و/ي/ا/ى/ء/ئ (yeh_hamza/hamza/yeh_maksorah/alef/yeh/waw)
	[ "باء", "باء" ],
	[ "غذى", "غذى" ],
	[ "رشا", "رشا" ],
	// Three letter words with و/ي (yeh/waw) as their second letter and the root is in the exception list after و/ي (yeh/waw) removal
	[ "أيد", "أيد" ],
	[ "أوز", "أوز" ],
	// Three letter words with و/ي/ا/ئ (yeh_hamza/alef/yeh/waw) as their second letter
	// And the root is NOT in the exception list after the deletion of و/ي/ا/ئ (yeh_hamza/alef/yeh/waw)
	[ "موظ", "موظ" ],
	[ "جيم", "جيم" ],
	[ "توت", "توت" ],
	// Three letter words with ئ/ؤ (yeh_hamza/waw_hamza) as their second letter and end in ر/ز/ن (noon/zai/reh),
	// Change ئ/ؤ (yeh_hamza/waw_hamza) to ا (alef), otherwise ئ/ؤ is changed to أ (alef_hamza_above)
	[ "مؤن", "مان" ],
	[ "فئة", "فأة" ],
	[ "بؤس", "بأس" ],
	[ "رؤي", "رأي" ],
	// Three letter words that ends in a shadda, duplicate the second character and the root is in threeLetterRoots list
	[ "ودّ", "ودد" ],
	[ "ألّ", "ألل" ],
	// Four letter word that is in the list of four-letter roots.
	[ "أبزم", "أبزم" ],
	// Words that start with أ/إ/آ (alef_madda/alef_hamza_above/alef_hamza_below), the أ/إ/آ is changed to ا
	[ "آلهات", "لهت" ],
	[ "أفطر", "فطر" ],
	[ "إنطباع", "طبع" ],
	// Words that match one of the patterns
	[ "تبادل", "بدل" ],
	// Words that match pattern افعلال
	[ "ابيضاض", "بيض" ],
	// Words with a definite article
	[ "بالضبط", "ضبط" ],
	[ "كالقمر", "قمر" ],
	[ "والشمس", "شمس" ],
	// Words with a definite article whose root matched one of the patterns
	[ "الضارب", "ضرب" ],
	// Words with a definite article and a suffix
	[ "الجدولين", "جدول" ],
	[ "الزينة", "زين" ],
	// Three letter words plus prefix waw
	[ "وكرو", "كرو" ],
	[ "وغبي", "غبي" ],
	// Four letter words plus prefix waw
	[ "وضفدع", "ضفدع" ],
	[ "وبعبع", "بعبع" ],
	// Words which match a pattern and have prefix waw
	[ "وتمثّل", "مثل" ],
	[ "وتشاور", "شور" ],
	// Word with a prefix which matches a pattern
	[ "للزهور", "زهر" ],
	// Words with suffix and prefix waw
	[ "وفتيات", "فتي" ],
	[ "ومنزلنا", "نزل" ],
	// Words with prefix and prefix waw
	[ "وتتلقّى", "لقي" ],
	[ "وكرجل", "رجل" ],
	// Words with suffix and the word matches one of the patterns
	[ "ملابسك", "لبس" ],
	// Words with suffix
	[ "بؤسهم", "بأس" ],
	// Three letter word with a suffix.
	[ "جمعكم", "جمع" ],
	// Words with prefix
	[ "ستنجب", "نجب" ],
	[ "فنجبت", "نجب" ],

	// Specs from the external stemmer
	[ "الرحمن", "رحم" ],
	[ "الرحيم", "رحم" ],
	[ "العالمين", "علم" ],
	[ "نعبد", "عبد" ],
	[ "صراط", "صرط" ],
	// This word أنعمت belongs to a group of verb that incorrectly matches انفعل even though it should not.
	// Somehow the external stemmer stems this word correctly but we are still not sure how.
	// This problem will be further investigated and later fixed.
	// [ "أنعمت", "نعم" ],
	[ "المؤمنين", "أمن" ],
	[ "الصالحات", "صلح" ],
	[ "الحديث", "حدث" ],
	// This word السماوات has a different output stem in this stemmer (سمو) as we check the longer suffix (ات) first before the shorter one (ت)
	// We think that our stem output makes more sense, thus we don't change any functionality to accommodate this difference.
	// [ "السماوات", "سمي" ],
	[ "بسلطان", "سلط" ],
	[ "تفلحوا", "فلح" ],
	[ "يتنازعون", "نزع" ],
	[ "الشراب", "شرب" ],
	[ "أغفلنا", "غفل" ],
	[ "خلالهما", "خلل" ],
	[ "منقلبا", "قلب" ],
	[ "خاوية", "خوي" ],
	[ "والباقيات", "بقي" ],
	[ "المجرمين", "جرم" ],
	[ "للظالمين", "ظلم" ],
	// This word لنتخذن is also commented out in the original external stemmer.
	// [ "لنتخذن", "أخذ" ],
	/*
	 * Specs that do not pass because of overlap issues (they match multiple conditions, and they get stemmed in another
	 * condition than where we would want it to). They are probably also a problem in the external stemmer; we may solve it
	 * at some point with exception lists.
	 */
	// The current stem is قا as قوا is matched by regexRemoveMiddleWeakLetterOrHamza instead of this regex regexRemoveLastWeakLetterOrHamza
	// [ "قوا", "قوا" ],
	// The current stem is وفي, as وف is also detected in wordsWithLastYahRemoved list. For words found in the list, ي (yeh) is added to the root
	// [ "وفى", "وف" ],
	// The current stem is برا, as بر is also detected in wordsWithLastAlifRemoved list. For words found in the list, ا (alef) is added to the root
	// [ "برئ", "بر" ],
	// The current stem is بلي, as بل is also detected in wordsWithLastYahRemoved list. For words found in the list, ي (yeh) is added to the root
	// [ "بلا", "بل" ],
	// The current stem is بور, as بر is also detected in wordsWithMiddleWawRemoved list. For words found in the list, و (waw) is added to the root.
	// [ "بار", "بر" ],
	// The current stem is ين, it is because يئن is matched first by this regex regexRemoveMiddleWeakLetterOrHamza.
	// [ "يئن", "يان" ],
	// The current stem is بور, as بر is also detected in wordsWithMiddleWawRemoved list. For words found in the list, و (waw) is added to the root.
	// [ "بئر", "بار" ],
];

const paradigms = [
	{
		// Complete paradigm of a verb.
		stem: "عود",
		forms: [
			"عاودت",
			"عاود",
			"عاودتما",
			"عاودا",
			"عاودتا",
			"عاودنا",
			"عاودتم",
			"عاودتن",
			"عاودوا",
			"عاودن",
			"أعاود",
			"تعاود",
			"تعاودين",
			"يعاود",
			"تعاودان",
			"يعاودان",
			"نعاود",
			"تعاودون",
			"تعاودن",
			"يعاودون",
			"يعاودن",
			"تعاودي",
			"يعاود",
			"تعاودا",
			"يعاودا",
			"تعاودوا",
			"يعاودوا",
			"عوودت",
			"عوود",
			"عوودتما",
			"عوودا",
			"عوودتا",
			"عوودنا",
			"عوودتم",
			"عوودتن",
			"عوودوا",
			"عوودن",
			"عاودا",
			"عاودي",
			"عاود",
			"عاودوا",
			"عاودا",
			"معاود",
			"معاودة",
		],
	},
];

describe( "Test for stemming Arabic words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataAR ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataAR ) ).toBe( paradigm.stem );
			} );
		}
	}
} );

