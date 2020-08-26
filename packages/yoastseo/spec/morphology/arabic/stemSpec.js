import stem from "../../../src/morphology/arabic/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataAR = getMorphologyData( "ar" ).ar;

const wordsToStem = [
	// Three-letter word with prefix waw (The prefix waw is not removed because the word is matched as a pattern.)
	// [ "وموظ", "موظ" ],
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
	// And the root is in the list of word with the last weak letter or hamza removed.
	// The current stem is قا as قوا is matched by regexRemoveMiddleWeakLetterOrHamza instead of this regex regexRemoveLastWeakLetterOrHamza
	// [ "قوا", "قوا" ],
	[ "غبي", "غبي" ],
	[ "دعا", "دعا" ],
	[ "بدء", "بدأ" ],
	[ "كرى", "كرى" ],
	// Three letter words ending in weak letter و/ي/ا/ى/ء/ئ (yeh_hamza/hamza/yeh_maksorah/alef/yeh/waw)
	// And the root is NOT in the list of word with the last weak letter or hamza removed.
	// The current stem is وفي, as وف is also detected in wordsWithLastYahRemoved list. For words found in the list, ي (yeh) is added to the root
	// [ "وفى", "وف" ],
	// The current stem is صدأ, as صد is also matched in wordsWithLastHamzaRemoved.
	// For words found in the list, أ (alef_hamza_above) is added to the root
	// [ "صدئ", "صد" ],
	[ "باء", "باء" ],
	[ "غذى", "غذى" ],
	[ "رشا", "رشا" ],
	// The current stem is برا, as بر is also detected in wordsWithLastAlifRemoved list. For words found in the list, ا (alef) is added to the root
	// [ "برئ", "بر" ],
	// The current stem is بلي, as بل is also detected in wordsWithLastYahRemoved list. For words found in the list, ي (yeh) is added to the root
	// [ "بلا", "بل" ],
	// Three letter words with و/ي (yeh/waw) as their second letter and the root is in the exception list after و/ي (yeh/waw) removal
	[ "أيد", "أيد" ],
	[ "أوز", "أوز" ],
	// Three letter words with و/ي/ا/ئ (yeh_hamza/alef/yeh/waw) as their second letter
	// And the root is NOT in the exception list after the deletion of و/ي/ا/ئ (yeh_hamza/alef/yeh/waw)
	[ "موظ", "موظ" ],
	[ "جيم", "جيم" ],
	[ "توت", "توت" ],
	// The current stem is بور, as بر is also detected in wordsWithMiddleWawRemoved list. For words found in the list, و (waw) is added to the root.
	// [ "بار", "بر" ],
	// Three letter words with ئ/ؤ (yeh_hamza/waw_hamza) as their second letter and end in ر/ز/ن (noon/zai/reh),
	// Change ئ/ؤ (yeh_hamza/waw_hamza) to ا (alef), otherwise ئ/ؤ is changed to أ (alef_hamza_above)
	// The current stem is ين, it is because يئن is matched first by this regex regexRemoveMiddleWeakLetterOrHamza.
	// [ "يئن", "يان" ],
	// The current stem is بور, as بر is also detected in wordsWithMiddleWawRemoved list. For words found in the list, و (waw) is added to the root.
	// [ "بئر", "بار" ],
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
	// Not sure what should happen to three letter roots starting with alef that are not found anywhere on lists of roots.
	// [ "آفة", "افة" ],
	[ "آلهات", "لهت" ],
	[ "أفطر", "فطر" ],
	[ "إنطباع", "طبع" ],
	// Words that match one of the patterns
	[ "تبادل", "بدل" ],
	// Words that match pattern ÇÝÚáÇ or افعلال
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
	// Words with suffix and the word matches one of the pattern
	[ "ملابسك", "لبس" ],
	// Words with suffix
	[ "بؤسهم", "بأس" ],
	// Three letter words with a suffix.
	// This word matches a pattern, even though it shouldn't.
	// [ "توته", "توت" ],
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
	// This word أنعمت follows pattern افعل. The 5-letter conjugation of this verb which has ن (noon) as its second letter,
	// Will be incorrectly matched by this pattern انفعل. Thus, this verb form will be stemmed based on pattern انفعل.
	// [ "أنعمت", "نعم" ],
	[ "المؤمنين", "أمن" ],
	[ "الصالحات", "صلح" ],
	[ "الحديث", "حدث" ],
	// This word السماوات has a different output stem based on this stemmer (سمو) as we check the longer suffix (ات) first before the shorter one (ت)
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

	// Complete paradigm of a verb
	[ "عاودت", "عود" ],
	[ "عاود", "عود" ],
	[ "عاودتما", "عود" ],
	[ "عاودا", "عود" ],
	[ "عاودتا", "عود" ],
	[ "عاودنا", "عود" ],
	[ "عاودتم", "عود" ],
	[ "عاودتن", "عود" ],
	[ "عاودوا", "عود" ],
	[ "عاودن", "عود" ],
	[ "أعاود", "عود" ],
	[ "تعاود", "عود" ],
	[ "تعاودين", "عود" ],
	[ "يعاود", "عود" ],
	[ "تعاودان", "عود" ],
	[ "يعاودان", "عود" ],
	[ "نعاود", "عود" ],
	[ "تعاودون", "عود" ],
	[ "تعاودن", "عود" ],
	[ "يعاودون", "عود" ],
	[ "يعاودن", "عود" ],
	[ "تعاودي", "عود" ],
	[ "يعاود", "عود" ],
	[ "تعاودا", "عود" ],
	[ "يعاودا", "عود" ],
	[ "تعاودوا", "عود" ],
	[ "يعاودوا", "عود" ],
	[ "عوودت", "عود" ],
	[ "عوود", "عود" ],
	[ "عوودتما", "عود" ],
	[ "عوودا", "عود" ],
	[ "عوودتا", "عود" ],
	[ "عوودنا", "عود" ],
	[ "عوودتم", "عود" ],
	[ "عوودتن", "عود" ],
	[ "عوودوا", "عود" ],
	[ "عوودن", "عود" ],
	[ "عاودا", "عود" ],
	[ "عاودي", "عود" ],
	[ "عاود", "عود" ],
	[ "عاودوا", "عود" ],
	[ "عاودا", "عود" ],
	[ "معاود", "عود" ],
	[ "معاودة", "عود" ],
];

describe( "Test for stemming Arabic words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataAR ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );
