var isUndefined = require( "lodash/isUndefined" );

/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
var getLanguage = function ( locale ) {
	return locale.split( "_" )[ 0 ];
};

var transliterations = {

	// Language: Spanish.
	// Source: https://en.wikipedia.org/wiki/Spanish_orthography
	es: [
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u00FA\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DA\u00DC]/g, alternative: "U" }
	],
	// Language: Polish.
	// Source: https://en.wikipedia.org/wiki/Polish_orthography
	pl: [
		{ letter: /[\u0105]/g, alternative: "a" },
		{ letter: /[\u0104]/g, alternative: "A" },
		{ letter: /[\u0107]/g, alternative: "c" },
		{ letter: /[\u0106]/g, alternative: "C" },
		{ letter: /[\u0119]/g, alternative: "e" },
		{ letter: /[\u0118]/g, alternative: "E" },
		{ letter: /[\u0142]/g, alternative: "l" },
		{ letter: /[\u0141]/g, alternative: "L" },
		{ letter: /[\u0144]/g, alternative: "n" },
		{ letter: /[\u0143]/g, alternative: "N" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u015B]/g, alternative: "s" },
		{ letter: /[\u015A]/g, alternative: "S" },
		{ letter: /[\u017A\u017C]/g, alternative: "z" },
		{ letter: /[\u0179\u017B]/g, alternative: "Z" }
	],
	// Language: German.
	// Source: https://en.wikipedia.org/wiki/German_orthography#Special_characters
	de: [
		{ letter: /[\u00E4]/g, alternative: "ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00FC]/g, alternative: "ue" },
		{ letter: /[\u00DC]/g, alternative: "Ue" },
		{ letter: /[\u00F6]/g, alternative: "oe" },
		{ letter: /[\u00D6]/g, alternative: "Oe" },
		{ letter: /[\u00DF]/g, alternative: "ss" },
		{ letter: /[\u1E9E]/g, alternative: "SS" }
	],
	// Language Bokmål
	// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
	// Language Nynorks
	// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
	// Bokmål and Nynorks use the same transliterations
	nbnn: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" },
		{ letter: /[\u00E9\u00E8\u00EA]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CA]/g, alternative: "E" },
		{ letter: /[\u00F3\u00F2\u00F4]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D2\u00D4]/g, alternative: "O" }
	],
	// Language: Swedish.
	// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
	// http://forum.wordreference.com/threads/swedish-%C3%A4-ae-%C3%B6-oe-acceptable.1451839/
	sv: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E4]/g, alternative: "ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F6]/g, alternative: "oe" },
		{ letter: /[\u00D6]/g, alternative: "Oe" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" }
	],
	// Language: Finnish.
	// Sources: https://www.cs.tut.fi/~jkorpela/lang/finnish-letters.html
	// https://en.wikipedia.org/wiki/Finnish_orthography
	fi: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" },
		{ letter: /[\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D6]/g, alternative: "O" },
		{ letter: /[\u017E]/g, alternative: "zh" },
		{ letter: /[\u017D]/g, alternative: "Zh" },
		{ letter: /[\u0161]/g, alternative: "sh" },
		{ letter: /[\u0160]/g, alternative: "Sh" }
	],
	// Language: Danish.
	// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
	// https://en.wikipedia.org/wiki/Danish_orthography
	da: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" }
	],
	// Language: Turkish.
	// Source: https://en.wikipedia.org/wiki/Turkish_alphabet
	// ‘İ’ is the capital dotted ‘i’. Its lowercase counterpart is the ‘regular’ ‘i’.
	tr: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u011F]/g, alternative: "g" },
		{ letter: /[\u011E]/g, alternative: "G" },
		{ letter: /[\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D6]/g, alternative: "O" },
		{ letter: /[\u015F]/g, alternative: "s" },
		{ letter: /[\u015E]/g, alternative: "S" },
		{ letter: /[\u00E2]/g, alternative: "a" },
		{ letter: /[\u00C2]/g, alternative: "A" },
		{ letter: /[\u0131\u00EE]/g, alternative: "i" },
		{ letter: /[\u0130\u00CE]/g, alternative: "I" },
		{ letter: /[\u00FC\u00FB]/g, alternative: "u" },
		{ letter: /[\u00DC\u00DB]/g, alternative: "U" }
	],
	// Language: Latvian.
	// Source: https://en.wikipedia.org/wiki/Latvian_orthography
	lv: [
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u010D]/g, alternative: "c" },
		{ letter: /[\u010C]/g, alternative: "C" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u0123]/g, alternative: "g" },
		{ letter: /[\u0122]/g, alternative: "G" },
		{ letter: /[\u012B]/g, alternative: "i" },
		{ letter: /[\u012A]/g, alternative: "I" },
		{ letter: /[\u0137]/g, alternative: "k" },
		{ letter: /[\u0136]/g, alternative: "K" },
		{ letter: /[\u013C]/g, alternative: "l" },
		{ letter: /[\u013B]/g, alternative: "L" },
		{ letter: /[\u0146]/g, alternative: "n" },
		{ letter: /[\u0145]/g, alternative: "N" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u016B]/g, alternative: "u" },
		{ letter: /[\u016A]/g, alternative: "U" },
		{ letter: /[\u017E]/g, alternative: "z" },
		{ letter: /[\u017D]/g, alternative: "Z" }
	],
	// Language: Icelandic.
	// Sources: https://en.wikipedia.org/wiki/Thorn_(letter),
	// https://en.wikipedia.org/wiki/Eth,  https://en.wikipedia.org/wiki/Icelandic_orthography
	is: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00F0]/g, alternative: "d" },
		{ letter: /[\u00D0]/g, alternative: "D" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00F3\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D6]/g, alternative: "O" },
		{ letter: /[\u00FA]/g, alternative: "u" },
		{ letter: /[\u00DA]/g, alternative: "U" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u00FE]/g, alternative: "th" },
		{ letter: /[\u00DE]/g, alternative: "Th" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" }
	],
	// Language: Faroese.
	// Source: https://www.facebook.com/groups/1557965757758234/permalink/1749847165236758/ (conversation in private Facebook Group ‘Faroese Language Learning Enthusiasts’)
	// depending on the word, ð can be d, g, j, v, ng or nothing. However, ‘d’ is most frequent.
	// when writing text messages or using a foreign keyboard, í is sometimes written as ij, ý as yj, ú as uv, ó as ov, ø as oe, and á as aa or oa.
	// However, in website URLs the alternatives mentioned below are by far the most common.
	fa: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00F0]/g, alternative: "d" },
		{ letter: /[\u00D0]/g, alternative: "D" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u00FA]/g, alternative: "u" },
		{ letter: /[\u00DA]/g, alternative: "U" },
		{ letter: /[\u00F3\u00F8]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D8]/g, alternative: "O" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" }
	],
	// Language: Czech.
	// Source: https://en.wikipedia.org/wiki/Czech_orthography
	cs: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u010D]/g, alternative: "c" },
		{ letter: /[\u010C]/g, alternative: "C" },
		{ letter: /[\u010F]/g, alternative: "d" },
		{ letter: /[\u010E]/g, alternative: "D" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u0148]/g, alternative: "n" },
		{ letter: /[\u0147]/g, alternative: "N" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u0159]/g, alternative: "r" },
		{ letter: /[\u0158]/g, alternative: "R" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u0165]/g, alternative: "t" },
		{ letter: /[\u0164]/g, alternative: "T" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u017E]/g, alternative: "z" },
		{ letter: /[\u017D]/g, alternative: "Z" },
		{ letter: /[\u00E9\u011B]/g, alternative: "e" },
		{ letter: /[\u00C9\u011A]/g, alternative: "E" },
		{ letter: /[\u00FA\u016F]/g, alternative: "u" },
		{ letter: /[\u00DA\u016E]/g, alternative: "U" }
	],
	// Language: Russian.
	// Source:  Machine Readable Travel Documents, Doc 9303, Part 1, Volume 1 (PDF) (Sixth ed.).
	// ICAO. 2006. p. IV-50—IV-52. http://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
	// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant.
	// In text it is transliterated to a character similar to an apostroph: ′.
	// I recommend omittance in slugs. (https://en.wikipedia.org/wiki/Romanization_of_Russian)
	ru: [
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "g" },
		{ letter: /[\u0413]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0438\u0439]/g, alternative: "i" },
		{ letter: /[\u0418\u0419]/g, alternative: "I" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u043D]/g, alternative: "n" },
		{ letter: /[\u041D]/g, alternative: "N" },
		{ letter: /[\u0070]/g, alternative: "r" },
		{ letter: /[\u0050]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "kh" },
		{ letter: /[\u0425]/g, alternative: "Kh" },
		{ letter: /[\u0446]/g, alternative: "ts" },
		{ letter: /[\u0426]/g, alternative: "Ts" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" },
		{ letter: /[\u0449]/g, alternative: "shch" },
		{ letter: /[\u0429]/g, alternative: "Shch" },
		{ letter: /[\u044A]/g, alternative: "ie" },
		{ letter: /[\u042A]/g, alternative: "Ie" },
		{ letter: /[\u044B]/g, alternative: "y" },
		{ letter: /[\u042B]/g, alternative: "Y" },
		{ letter: /[\u044C]/g, alternative: "" },
		{ letter: /[\u042C]/g, alternative: "" },
		{ letter: /[\u0451\u044D]/g, alternative: "e" },
		{ letter: /[\u0401\u042D]/g, alternative: "E" },
		{ letter: /[\u044E]/g, alternative: "iu" },
		{ letter: /[\u042E]/g, alternative: "Iu" },
		{ letter: /[\u044F]/g, alternative: "ia" },
		{ letter: /[\u042F]/g, alternative: "Ia" }
	],
	// Language: Esperanto.
	// Source: https://en.wikipedia.org/wiki/Esperanto#Writing_diacritics
	eo: [
		{ letter: /[\u0109]/g, alternative: "ch" },
		{ letter: /[\u0108]/g, alternative: "Ch" },
		{ letter: /[\u011d]/g, alternative: "gh" },
		{ letter: /[\u011c]/g, alternative: "Gh" },
		{ letter: /[\u0125]/g, alternative: "hx" },
		{ letter: /[\u0124]/g, alternative: "Hx" },
		{ letter: /[\u0135]/g, alternative: "jx" },
		{ letter: /[\u0134]/g, alternative: "Jx" },
		{ letter: /[\u015d]/g, alternative: "sx" },
		{ letter: /[\u015c]/g, alternative: "Sx" },
		{ letter: /[\u016d]/g, alternative: "ux" },
		{ letter: /[\u016c]/g, alternative: "Ux" }
	],
	// Language: Afrikaans.
	// Source: https://en.wikipedia.org/wiki/Afrikaans#Orthography
	af: [
		{ letter: /[\u00E8\u00EA\u00EB]/g, alternative: "e" },
		{ letter: /[\u00CB\u00C8\u00CA]/g, alternative: "E" },
		{ letter: /[\u00EE\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CE\u00CF]/g, alternative: "I" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00FB\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DB\u00DC]/g, alternative: "U" }
	],
	// Language: Catalan.
	// Source: https://en.wikipedia.org/wiki/Catalan_orthography
	ca: [
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" },
		{ letter: /[\u00E9|\u00E8]/g, alternative: "e" },
		{ letter: /[\u00C9|\u00C8]/g, alternative: "E" },
		{ letter: /[\u00ED|\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CD|\u00CF]/g, alternative: "I" },
		{ letter: /[\u00F3|\u00F2]/g, alternative: "o" },
		{ letter: /[\u00D3|\u00D2]/g, alternative: "O" },
		{ letter: /[\u00FA|\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DA|\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" }
	],
	// Language: Asturian.
	// Source: http://www.orbilat.com/Languages/Asturian/Grammar/Asturian-Alphabet.html
	ast: [
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: Aragonese.
	// Source: https://en.wikipedia.org/wiki/Aragonese_language#Orthography
	an: [
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00F1]/g, alternative: "ny" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00D1]/g, alternative: "Ny" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u00C1]/g, alternative: "A" }
	],
	// Language: Aymara.
	// Source: http://www.omniglot.com/writing/aymara.htm
	ay: [
		{ letter: /(([\u00EF])|([\u00ED]))/g, alternative: "i" },
		{ letter: /(([\u00CF])|([\u00CD]))/g, alternative: "I" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u0027]/g, alternative: "" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: English.
	// Sources: https://en.wikipedia.org/wiki/English_terms_with_diacritical_marks https://en.wikipedia.org/wiki/English_orthography
	en: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00EB\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	],
	// Language: French.
	// Sources: https://en.wikipedia.org/wiki/French_orthography#Ligatures https://en.wikipedia.org/wiki/French_orthography#Diacritics
	fr: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00E9\u00E8\u00EB\u00EA]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CB\u00CA]/g, alternative: "E" },
		{ letter: /[\u00E0\u00E2]/g, alternative: "a" },
		{ letter: /[\u00C0\u00C2]/g, alternative: "A" },
		{ letter: /[\u00EF\u00EE]/g, alternative: "i" },
		{ letter: /[\u00CF\u00CE]/g, alternative: "I" },
		{ letter: /[\u00F9\u00FB\u00FC]/g, alternative: "u" },
		{ letter: /[\u00D9\u00DB\u00DC]/g, alternative: "U" },
		{ letter: /[\u00F4]/g, alternative: "o" },
		{ letter: /[\u00D4]/g, alternative: "O" },
		{ letter: /[\u00FF]/g, alternative: "y" },
		{ letter: /[\u0178]/g, alternative: "Y" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: Italian.
	// Source: https://en.wikipedia.org/wiki/Italian_orthography
	it: [
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" },
		{ letter: /[\u00E9\u00E8]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8]/g, alternative: "E" },
		{ letter: /[\u00EC\u00ED\u00EE]/g, alternative: "i" },
		{ letter: /[\u00CC\u00CD\u00CE]/g, alternative: "I" },
		{ letter: /[\u00F3\u00F2]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D2]/g, alternative: "O" },
		{ letter: /[\u00F9\u00FA]/g, alternative: "u" },
		{ letter: /[\u00D9\u00DA]/g, alternative: "U" }
	],
	// Language: Dutch.
	// Sources: https://en.wikipedia.org/wiki/Dutch_orthography https://nl.wikipedia.org/wiki/Trema_in_de_Nederlandse_spelling
	nl: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00E9\u00E8\u00EA\u00EB]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CA\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	],
	// Language: Bambara.
	// Sources: http://www.omniglot.com/writing/bambara.htm https://en.wikipedia.org/wiki/Bambara_language
	bm: [
		{ letter: /[\u025B]/g, alternative: "e" },
		{ letter: /[\u0190]/g, alternative: "E" },
		{ letter: /[\u0272]/g, alternative: "ny" },
		{ letter: /[\u019D]/g, alternative: "Ny" },
		{ letter: /[\u014B]/g, alternative: "ng" },
		{ letter: /[\u014A]/g, alternative: "Ng" },
		{ letter: /[\u0254]/g, alternative: "o" },
		{ letter: /[\u0186]/g, alternative: "O" }
	],
	// Language: Ukrainian.
	// Source: Resolution no. 55 of the Cabinet of Ministers of Ukraine, January 27, 2010 http://zakon2.rada.gov.ua/laws/show/55-2010-%D0%BF
	// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant. In text it is sometimes transliterated
	// to a character similar to an apostroph: ′. Omittance is recommended in slugs (https://en.wikipedia.org/wiki/Romanization_of_Ukrainian).
	uk: [
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "h" },
		{ letter: /[\u0413]/g, alternative: "H" },
		{ letter: /[\u0491]/g, alternative: "g" },
		{ letter: /[\u0490]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u0070]/g, alternative: "r" },
		{ letter: /[\u0050]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "kh" },
		{ letter: /[\u0425]/g, alternative: "Kh" },
		{ letter: /[\u0446]/g, alternative: "ts" },
		{ letter: /[\u0426]/g, alternative: "Ts" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" },
		{ letter: /[\u0449]/g, alternative: "shch" },
		{ letter: /[\u0429]/g, alternative: "Shch" },
		{ letter: /[\u044C\u042C]/g, alternative: "" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0438]/g, alternative: "y" },
		{ letter: /[\u0418]/g, alternative: "Y" },
		{ letter: /^[\u0454]/g, alternative: "ye" },
		{ letter: /[\s][\u0454]/g, alternative: " ye" },
		{ letter: /[\u0454]/g, alternative: "ie" },
		{ letter: /^[\u0404]/g, alternative: "Ye" },
		{ letter: /[\s][\u0404]/g, alternative: " Ye" },
		{ letter: /[\u0404]/g, alternative: "IE" },
		{ letter: /^[\u0457]/g, alternative: "yi" },
		{ letter: /[\s][\u0457]/g, alternative: " yi" },
		{ letter: /[\u0457]/g, alternative: "i" },
		{ letter: /^[\u0407]/g, alternative: "Yi" },
		{ letter: /[\s][\u0407]/g, alternative: " Yi" },
		{ letter: /[\u0407]/g, alternative: "I" },
		{ letter: /^[\u0439]/g, alternative: "y" },
		{ letter: /[\s][\u0439]/g, alternative: " y" },
		{ letter: /[\u0439]/g, alternative: "i" },
		{ letter: /^[\u0419]/g, alternative: "Y" },
		{ letter: /[\s][\u0419]/g, alternative: " Y" },
		{ letter: /[\u0419]/g, alternative: "I" },
		{ letter: /^[\u044E]/g, alternative: "yu" },
		{ letter: /[\s][\u044E]/g, alternative: " yu" },
		{ letter: /[\u044E]/g, alternative: "iu" },
		{ letter: /^[\u042E]/g, alternative: "Yu" },
		{ letter: /[\s][\u042E]/g, alternative: " Yu" },
		{ letter: /[\u042E]/g, alternative: "IU" },
		{ letter: /^[\u044F]/g, alternative: "ya" },
		{ letter: /[\s][\u044F]/g, alternative: " ya" },
		{ letter: /[\u044F]/g, alternative: "ia" },
		{ letter: /^[\u042F]/g, alternative: "Ya" },
		{ letter: /[\s][\u042F]/g, alternative: " Ya" },
		{ letter: /[\u042F]/g, alternative: "IA" }
	],
	// Language: Breton
	// Source: http://www.omniglot.com/writing/breton.htm
	br: [
		{ letter: /\u0063\u0027\u0068/g, alternative: "ch" },
		{ letter: /\u0043\u0027\u0048/g, alternative: "CH" },
		{ letter: /[\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ea]/g, alternative: "e" },
		{ letter: /[\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fb\u00f9\u00fc]/g, alternative: "u" },
		{ letter: /[\u00db\u00d9\u00dc]/g, alternative: "U" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" }
	],
	// Language: Chamorro
	// Source: http://www.omniglot.com/writing/chamorro.htm
	ch: [
		{ letter: /[\u0027]/g, alternative: "" },
		{ letter: /[\u00e5]/g, alternative: "a" },
		{ letter: /[\u00c5]/g, alternative: "A" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" }
	],
	// Language: Corsican
	// Sources: http://www.omniglot.com/writing/corsican.htm https://en.wikipedia.org/wiki/Corsican_alphabet
	co: [
		{ letter: /[\u00e2\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c2\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e6\u04d5]/g, alternative: "ae" },
		{ letter: /[\u00c6\u04d4]/g, alternative: "Ae" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e9\u00ea\u00e8\u00eb]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca\u00c8\u00cb]/g, alternative: "E" },
		{ letter: /[\u00ec\u00ee\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cc\u00ce\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" },
		{ letter: /[\u00f4\u00f2]/g, alternative: "o" },
		{ letter: /[\u00d4\u00d2]/g, alternative: "O" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]]/g, alternative: "Oe" },
		{ letter: /[\u00f9\u00fc]/g, alternative: "u" },
		{ letter: /[\u00d9\u00dc]/g, alternative: "U" },
		{ letter: /[\u00ff]/g, alternative: "y" },
		{ letter: /[\u0178]/g, alternative: "Y" }
	],
	// Language: Kashubian
	// Sources: http://www.omniglot.com/writing/kashubian.htm https://en.wikipedia.org/wiki/Kashubian_language
	csb: [
		{ letter: /[\u0105\u00e3]/g, alternative: "a" },
		{ letter: /[\u0104\u00c3]/g, alternative: "A" },
		{ letter: /[\u00e9\u00eb]/g, alternative: "e" },
		{ letter: /[\u00c9\u00cb]/g, alternative: "E" },
		{ letter: /[\u0142]/g, alternative: "l" },
		{ letter: /[\u0141]/g, alternative: "L" },
		{ letter: /[\u0144]/g, alternative: "n" },
		{ letter: /[\u0143]/g, alternative: "N" },
		{ letter: /[\u00f2\u00f3\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d3\u00d4]/g, alternative: "O" },
		{ letter: /[\u00f9]/g, alternative: "u" },
		{ letter: /[\u00d9]/g, alternative: "U" },
		{ letter: /[\u017c]/g, alternative: "z" },
		{ letter: /[\u017b]/g, alternative: "Z" }
	],
	// Language: Welsh
	// Sources: http://www.omniglot.com/writing/welsh.htm https://en.wikipedia.org/wiki/Welsh_orthography#Diacritics
	cy: [
		{ letter: /[\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ea]/g, alternative: "e" },
		{ letter: /[\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fb]/g, alternative: "u" },
		{ letter: /[\u00db]/g, alternative: "U" },
		{ letter: /[\u0175]/g, alternative: "w" },
		{ letter: /[\u0174]/g, alternative: "W" },
		{ letter: /[\u0177]/g, alternative: "y" },
		{ letter: /[\u0176]/g, alternative: "Y" }
	],
	// Language: Ewe
	// Sources: http://www.omniglot.com/writing/ewe.htm https://en.wikipedia.org/wiki/Ewe_language#Writing_system
	ee: [
		{ letter: /[\u0256]/g, alternative: "d" },
		{ letter: /[\u0189]/g, alternative: "D" },
		{ letter: /[\u025b]/g, alternative: "e" },
		{ letter: /[\u0190]/g, alternative: "E" },
		{ letter: /[\u0192]/g, alternative: "f" },
		{ letter: /[\u0191]/g, alternative: "F" },
		{ letter: /[\u0263]/g, alternative: "g" },
		{ letter: /[\u0194]/g, alternative: "G" },
		{ letter: /[\u014b]/g, alternative: "ng" },
		{ letter: /[\u014a]/g, alternative: "Ng" },
		{ letter: /[\u0254]/g, alternative: "o" },
		{ letter: /[\u0186]/g, alternative: "O" },
		{ letter: /[\u028b]/g, alternative: "??" },
		{ letter: /[\u01b2]/g, alternative: "??" },
		{ letter: /\u0061\u0303/g, alternative: "a" },
		{ letter: /[\u00e1\u00e0\u01ce\u00e2\u00e3]/g, alternative: "a" },
		{ letter: /\u0041\u0303/g, alternative: "A" },
		{ letter: /[\u00c1\u00c0\u01cd\u00c2\u00c3]/g, alternative: "A" },
		{ letter: /[\u00e9\u00e8\u011b\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00c8\u011a\u00ca]/g, alternative: "E" },
		{ letter: /[\u00f3\u00f2\u01d2\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d2\u01d1\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fa\u00f9\u01d4\u00fb]/g, alternative: "u" },
		{ letter: /[\u00da\u00d9\u01d3\u00db]/g, alternative: "U" },
		{ letter: /[\u00ed\u00ec\u01d0\u00ee]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cc\u01cf\u00ce]/g, alternative: "I" }
	],
	// Language: Estonian
	// Sources: http://www.omniglot.com/writing/estonian.htm https://en.wikipedia.org/wiki/Estonian_orthography https://en.wikipedia.org/wiki/%C5%BD https://en.wikipedia.org/wiki/%C5%A0
	et: [
		{ letter: /[\u0161]/g, alternative: "sh" },
		{ letter: /[\u0160]/g, alternative: "Sh" },
		{ letter: /[\u017e]/g, alternative: "zh" },
		{ letter: /[\u017d]/g, alternative: "Zh" },
		{ letter: /[\u00f5\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d6\u00d5]/g, alternative: "O" },
		{ letter: /[\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c4]/g, alternative: "A" },
		{ letter: /[\u00fc]/g, alternative: "u" },
		{ letter: /[\u00dc]/g, alternative: "U" }
		],
	// Language: Basque
	// Sources: http://www.omniglot.com/writing/basque.htm https://en.wikipedia.org/wiki/Basque_language#Writing_system https://en	.wikipedia.org/wiki/Basque_alphabet
	eu: [
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00fc]/g, alternative: "u" },
		{ letter: /[\u00dc]/g, alternative: "U" }
	],
	// Language: Fulah
	// Sources: http://www.omniglot.com/writing/fula.htm https://en.wikipedia.org/wiki/Fula_language#Writing_systems
	fuc: [
		{ letter: /[\u0253]/g, alternative: "b" },
		{ letter: /[\u0181]/g, alternative: "B" },
		{ letter: /[\u0257]/g, alternative: "d" },
		{ letter: /[\u018a]/g, alternative: "D" },
		{ letter: /[\u014b]/g, alternative: "ng" },
		{ letter: /[\u014a]/g, alternative: "Ng" },
		{ letter: /[\u0272\u00f1]/g, alternative: "ny" },
		{ letter: /[\u019d\u00d1]/g, alternative: "Ny" },
		{ letter: /[\u01b4]/g, alternative: "y" },
		{ letter: /[\u01b3]/g, alternative: "Y" },
		{ letter: /[\u0260]/g, alternative: "g" },
		{ letter: /[\u0193]/g, alternative: "G" }
	],
	// Language: Fijian
	// Source: http://www.omniglot.com/writing/fijian.htm
	fj: [
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u012b]/g, alternative: "i" },
		{ letter: /[\u012a]/g, alternative: "I" },
		{ letter: /[\u016b]/g, alternative: "u" },
		{ letter: /[\u016a]/g, alternative: "U" },
		{ letter: /[\u014d]/g, alternative: "o" },
		{ letter: /[\u014c]/g, alternative: "O" }
	],
	// Language: Arpitan (Franco-Provençal language)
	// Source: http://www.omniglot.com/writing/francoprovencal.htm
	frp: [
		{ letter: /[\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ea\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00ca\u00c8\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00fb\u00fc]/g, alternative: "u" },
		{ letter: /[\u00db\u00dc]/g, alternative: "U" },
		{ letter: /[\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d4]/g, alternative: "O" }
	],
	// Language: Friulian
	// Sources: https://en.wikipedia.org/wiki/Friulian_language https://en.wikipedia.org/wiki/Faggin-Nazzi_alphabet http://www.omniglot.com/writing/friulian.htm
	fur: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00e0\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c2]/g, alternative: "A" },
		{ letter: /[\u00e8\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c8\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ec\u00ee]/g, alternative: "i" },
		{ letter: /[\u00cc\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f2\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d4]/g, alternative: "O" },
		{ letter: /[\u00f9\u00fb]/g, alternative: "u" },
		{ letter: /[\u00d9\u00db]/g, alternative: "U" },
		{ letter: /[\u010d]/g, alternative: "c" },
		{ letter: /[\u010c]/g, alternative: "C" },
		{ letter: /[\u011f]/g, alternative: "g" },
		{ letter: /[\u011e]/g, alternative: "G" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" }
	],
	// Language: Frisian
	// Sources: https://en.wikipedia.org/wiki/West_Frisian_alphabet http://www.omniglot.com/writing/frisian.htm
	fy: [
		{ letter: /[\u00e2\u0101\u00e4\u00e5]/g, alternative: "a" },
		{ letter: /[\u00c2\u0100\u00c4\u00c5]/g, alternative: "A" },
		{ letter: /[\u00ea\u00e9\u0113]/g, alternative: "e" },
		{ letter: /[\u00ca\u00c9\u0112]/g, alternative: "E" },
		{ letter: /[\u00f4\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d4\u00d6]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fb\u00fc]/g, alternative: "u" },
		{ letter: /[\u00da\u00db\u00dc]/g, alternative: "U" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u0111\u00f0]/g, alternative: "d" },
		{ letter: /[\u0110\u00d0]/g, alternative: "D" }
	],
	// Language: Irish
	// Source: https://en.wikipedia.org/wiki/Irish_orthography
	ga: [
		{ letter: /[\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c9]/g, alternative: "E" },
		{ letter: /[\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" }
	],
	// Language: Scottish Gaelic
	// Sources: https://en.wikipedia.org/wiki/Scottish_Gaelic_orthography http://www.omniglot.com/writing/gaelic.htm
	gd: [
		{ letter: /[\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e8]/g, alternative: "e" },
		{ letter: /[\u00c8]/g, alternative: "E" },
		{ letter: /[\u00f2]/g, alternative: "o" },
		{ letter: /[\u00d2]/g, alternative: "O" },
		{ letter: /[\u00f9]/g, alternative: "u" },
		{ letter: /[\u00d9]/g, alternative: "U" },
		{ letter: /[\u00ec]/g, alternative: "i" },
		{ letter: /[\u00cc]/g, alternative: "I" }
	],
	// Language: Galician
	// Sources: https://en.wikipedia.org/wiki/Diacritic https://en.wikipedia.org/wiki/Galician_Alphabet
	gl: [
		{ letter: /[\u00e1\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e9\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fc]/g, alternative: "u" },
		{ letter: /[\u00da\u00dc]/g, alternative: "U" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" }
	],
	// Language: Guarani
	// Sources: https://en.wikipedia.org/wiki/Guarani_alphabet http://www.omniglot.com/writing/guarani.htm
	gn: [
		{ letter: /[\u2019]/g, alternative: "" },
		{ letter: /\u0067\u0303/g, alternative: "g" },
		{ letter: /\u0047\u0303/g, alternative: "G" },
		{ letter: /[\u00e3]/g, alternative: "a" },
		{ letter: /[\u00c3]/g, alternative: "A" },
		{ letter: /[\u1ebd]/g, alternative: "e" },
		{ letter: /[\u1ebc]/g, alternative: "E" },
		{ letter: /[\u0129]/g, alternative: "i" },
		{ letter: /[\u0128]/g, alternative: "I" },
		{ letter: /[\u00f5]/g, alternative: "o" },
		{ letter: /[\u00d5]/g, alternative: "O" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" },
		{ letter: /[\u0169]/g, alternative: "u" },
		{ letter: /[\u0168]/g, alternative: "U" },
		{ letter: /[\u1ef9]/g, alternative: "y" },
		{ letter: /[\u1ef8]/g, alternative: "Y" }
	],
	// Language: Swiss German
	// Source: http://www.omniglot.com/writing/swissgerman.htm
	gsw: [
		{ letter: /[\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c4]/g, alternative: "A" },
		{ letter: /[\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d6]/g, alternative: "O" },
		{ letter: /[\u00fc]/g, alternative: "u" },
		{ letter: /[\u00dc]/g, alternative: "U" }
	],
	// Language: Haitian Creole
	// Sources: https://en.wikipedia.org/wiki/Haitian_Creole http://www.omniglot.com/writing/haitiancreole.htm
	hat: [
		{ letter: /[\u00e8]/g, alternative: "e" },
		{ letter: /[\u00c8]/g, alternative: "E" },
		{ letter: /[\u00f2]/g, alternative: "o" },
		{ letter: /[\u00d2]/g, alternative: "O" }
	],
	// Language: Hawaiian
	// Sources: https://en.wikipedia.org/wiki/Hawaiian_language#Macron http://www.omniglot.com/writing/hawaiian.htm
	haw: [
		{ letter: /[\u02bb\u0027\u2019]/g, alternative: "" },
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u012b]/g, alternative: "i" },
		{ letter: /[\u014d]/g, alternative: "o" },
		{ letter: /[\u016b]/g, alternative: "u" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u012a]/g, alternative: "I" },
		{ letter: /[\u014c]/g, alternative: "O" },
		{ letter: /[\u016a]/g, alternative: "U" }
	],
	// Language: Croatian
	// Sources: https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet https://en.wikipedia.org/wiki/D_with_stroke
	// http://www.omniglot.com/writing/croatian.htm
	hr: [
		{ letter: /[\u010d\u0107]/g, alternative: "c" },
		{ letter: /[\u010c\u0106]/g, alternative: "C" },
		{ letter: /[\u0111]/g, alternative: "dj" },
		{ letter: /[\u0110]/g, alternative: "Dj" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u017e]/g, alternative: "z" },
		{ letter: /[\u017d]/g, alternative: "Z" }
	],
	// Language: Georgian
	// The Georgian language does not use capital letters.
	// Sources: https://en.wikipedia.org/wiki/Romanization_of_Georgian (national system)
	ka: [
		{ letter: /[\u10d0]/g, alternative: "a" },
		{ letter: /[\u10d1]/g, alternative: "b" },
		{ letter: /[\u10d2]/g, alternative: "g" },
		{ letter: /[\u10d3]/g, alternative: "d" },
		{ letter: /[\u10d4]/g, alternative: "e" },
		{ letter: /[\u10d5]/g, alternative: "v" },
		{ letter: /[\u10d6]/g, alternative: "z" },
		{ letter: /[\u10d7]/g, alternative: "t" },
		{ letter: /[\u10d8]/g, alternative: "i" },
		{ letter: /[\u10d9]/g, alternative: "k" },
		{ letter: /[\u10da]/g, alternative: "l" },
		{ letter: /[\u10db]/g, alternative: "m" },
		{ letter: /[\u10dc]/g, alternative: "n" },
		{ letter: /[\u10dd]/g, alternative: "o" },
		{ letter: /[\u10de]/g, alternative: "p" },
		{ letter: /[\u10df]/g, alternative: "zh" },
		{ letter: /[\u10e0]/g, alternative: "r" },
		{ letter: /[\u10e1]/g, alternative: "s" },
		{ letter: /[\u10e2]/g, alternative: "t" },
		{ letter: /[\u10e3]/g, alternative: "u" },
		{ letter: /[\u10e4]/g, alternative: "p" },
		{ letter: /[\u10e5]/g, alternative: "k" },
		{ letter: /[\u10e6]/g, alternative: "gh" },
		{ letter: /[\u10e7]/g, alternative: "q" },
		{ letter: /[\u10e8]/g, alternative: "sh" },
		{ letter: /[\u10e9]/g, alternative: "ch" },
		{ letter: /[\u10ea]/g, alternative: "ts" },
		{ letter: /[\u10eb]/g, alternative: "dz" },
		{ letter: /[\u10ec]/g, alternative: "ts" },
		{ letter: /[\u10ed]/g, alternative: "ch" },
		{ letter: /[\u10ee]/g, alternative: "kh" },
		{ letter: /[\u10ef]/g, alternative: "j" },
		{ letter: /[\u10f0]/g, alternative: "h" }
	],
	// Language: Greenlandic.
	// Source: https://en.wikipedia.org/wiki/Greenlandic_language#Orthography
	kal: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" }
		],
	// Language: Kinyarwanda.
	// Source: https://en.wikipedia.org/wiki/Kinyarwanda
	kin: [
		{ letter: /[\u2019\u0027]/g, alternative: "" }
	],
	// Language: Luxembourgish.
	// Source: http://www.omniglot.com/writing/luxembourgish.htm
	lb: [
		{ letter: /[\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c4]/g, alternative: "A" },
		{ letter: /[\u00eb\u00e9]/g, alternative: "e" },
		{ letter: /[\u00cb\u00c9]/g, alternative: "E" }
	],
	// Language: Limburgish.
	// Source: http://www.omniglot.com/writing/limburgish.htm
	li: [
		{ letter: /[\u00e1\u00e2\u00e0\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c2\u00c0\u00c4]/g, alternative: "A" },
		{ letter: /[\u00eb\u00e8\u00ea]/g, alternative: "e" },
		{ letter: /[\u00cb\u00c8\u00ca]/g, alternative: "E" },
		{ letter: /[\u00f6\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d6\u00d3]/g, alternative: "O" }
	],
	// Language: Lingala.
	// Sources: https://en.wikipedia.org/wiki/Lingala#Writing_system http://www.omniglot.com/writing/lingala.htm
	lin: [
		{ letter: /[\u00e1\u00e2\u01ce]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c2\u01cd]/g, alternative: "A" },
		{ letter: /\u025b\u0301/g, alternative: "e" },
		{ letter: /\u025b\u0302/g, alternative: "e" },
		{ letter: /\u025b\u030c/g, alternative: "e" },
		{ letter: /[\u00e9\u00ea\u011b\u025b]/g, alternative: "e" },
		{ letter: /\u0190\u0301/g, alternative: "E" },
		{ letter: /\u0190\u0302/g, alternative: "E" },
		{ letter: /\u0190\u030c/g, alternative: "E" },
		{ letter: /[\u00c9\u00ca\u011a\u0190]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ee\u01d0]/g, alternative: "i" },
		{ letter: /[\u00cd\u00ce\u01cf]/g, alternative: "I" },
		{ letter: /\u0254\u0301/g, alternative: "o" },
		{ letter: /\u0254\u0302/g, alternative: "o" },
		{ letter: /\u0254\u030c/g, alternative: "o" },
		{ letter: /[\u00f3\u00f4\u01d2\u0254]/g, alternative: "o" },
		{ letter: /\u0186\u0301/g, alternative: "O" },
		{ letter: /\u0186\u0302/g, alternative: "O" },
		{ letter: /\u0186\u030c/g, alternative: "O" },
		{ letter: /[\u00d3\u00d4\u01d1\u0186]/g, alternative: "O" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" }
	],
	// Language: Lithuanian.
	// Sources: https://en.wikipedia.org/wiki/Lithuanian_orthography http://www.omniglot.com/writing/lithuanian.htm
	lt: [
		{ letter: /[\u0105]/g, alternative: "a" },
		{ letter: /[\u0104]/g, alternative: "A" },
		{ letter: /[\u010d]/g, alternative: "c" },
		{ letter: /[\u010c]/g, alternative: "C" },
		{ letter: /[\u0119\u0117]/g, alternative: "e" },
		{ letter: /[\u0118\u0116]/g, alternative: "E" },
		{ letter: /[\u012f]/g, alternative: "i" },
		{ letter: /[\u012e]/g, alternative: "I" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u0173\u016b]/g, alternative: "u" },
		{ letter: /[\u0172\u016a]/g, alternative: "U" },
		{ letter: /[\u017e]/g, alternative: "z" },
		{ letter: /[\u017d]/g, alternative: "Z" }
	],
	// Language: Malagasy.
	// Source: http://www.omniglot.com/writing/malagasy.htm
	mg: [
		{ letter: /[\u00f4]/g, alternative: "ao" },
		{ letter: /[\u00d4]/g, alternative: "Ao" }
	],
	// Language: Macedonian.
	// Source: http://www.omniglot.com/writing/macedonian.htm
	mk: [
		{ letter: /[\u0430]/g, alternative: "a" },
		{ letter: /[\u0410]/g, alternative: "A" },
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "g" },
		{ letter: /[\u0413]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u0453]/g, alternative: "gj" },
		{ letter: /[\u0403]/g, alternative: "Gj" },
		{ letter: /[\u0435]/g, alternative: "e" },
		{ letter: /[\u0415]/g, alternative: "E" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0455]/g, alternative: "dz" },
		{ letter: /[\u0405]/g, alternative: "Dz" },
		{ letter: /[\u0438]/g, alternative: "i" },
		{ letter: /[\u0418]/g, alternative: "I" },
		{ letter: /[\u0458]/g, alternative: "j" },
		{ letter: /[\u0408]/g, alternative: "J" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u0459]/g, alternative: "lj" },
		{ letter: /[\u0409]/g, alternative: "Lj" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u043D]/g, alternative: "n" },
		{ letter: /[\u041D]/g, alternative: "N" },
		{ letter: /[\u045A]/g, alternative: "nj" },
		{ letter: /[\u040A]/g, alternative: "Nj" },
		{ letter: /[\u043E]/g, alternative: "o" },
		{ letter: /[\u041E]/g, alternative: "O" },
		{ letter: /[\u0440]/g, alternative: "r" },
		{ letter: /[\u0420]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u045C]/g, alternative: "kj" },
		{ letter: /[\u040C]/g, alternative: "Kj" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "h" },
		{ letter: /[\u0425]/g, alternative: "H" },
		{ letter: /[\u0446]/g, alternative: "c" },
		{ letter: /[\u0426]/g, alternative: "C" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u045F]/g, alternative: "dj" },
		{ letter: /[\u040F]/g, alternative: "Dj" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" }
	],
	// Language: Maori.
	// Source: http://www.omniglot.com/writing/maori.htm
	mri: [
		{ letter: /[\u0101]/g, alternative: "aa" },
		{ letter: /[\u0100]/g, alternative: "Aa" },
		{ letter: /[\u0113]/g, alternative: "ee" },
		{ letter: /[\u0112]/g, alternative: "Ee" },
		{ letter: /[\u012b]/g, alternative: "ii" },
		{ letter: /[\u012a]/g, alternative: "Ii" },
		{ letter: /[\u014d]/g, alternative: "oo" },
		{ letter: /[\u014c]/g, alternative: "Oo" },
		{ letter: /[\u016b]/g, alternative: "uu" },
		{ letter: /[\u016a]/g, alternative: "Uu" }
	],
	// Language: Mirandese.
	// Source: http://www.omniglot.com/writing/mirandese.htm
	mwl: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e9\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u00f3\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fa\u0169]/g, alternative: "u" },
		{ letter: /[\u00da\u0168]/g, alternative: "U" }
	],
	// Language: Occitan.
	// Sources: http://www.omniglot.com/writing/oromo.htm https://en.wikipedia.org/wiki/Occitan_alphabet
	oci: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e0\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c8\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f2\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fc]/g, alternative: "u" },
		{ letter: /[\u00da\u00dc]/g, alternative: "U" },
		{ letter: /[\u00b7]/g, alternative: "" }
	],
	// Language: Oromo.
	// Source: http://www.omniglot.com/writing/occitan.htm
	orm: [
		{ letter: /[\u0027]/g, alternative: "" }
	],
	// Language: Portuguese.
	// Source: https://en.wikipedia.org/wiki/Portuguese_orthography http://www.omniglot.com/writing/portuguese.htm
	pt: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e1\u00e2\u00e3\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c2\u00c3\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e9\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u00f3\u00f4\u00f5]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d4\u00d5]/g, alternative: "O" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" }
	],
	// Language: Romansh Vallader.
	// Source: https://en.wikipedia.org/wiki/Romansh_language#Orthography http://www.omniglot.com/writing/romansh.htm
	roh: [
		{ letter: /[\u00e9\u00e8\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00c8\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f6]/g, alternative: "oe" },
		{ letter: /[\u00d6]/g, alternative: "Oe" },
		{ letter: /[\u00fc]/g, alternative: "ue" },
		{ letter: /[\u00dc]/g, alternative: "Ue" },
		{ letter: /[\u00e4]/g, alternative: "ae" },
		{ letter: /[\u00c4]/g, alternative: "Ae" }
	],
	// Language: Aromanian.
	// Source: https://en.wikipedia.org/wiki/Aromanian_alphabet http://www.omniglot.com/writing/aromanian.htm
	rup: [
		{ letter: /[\u00e3]/g, alternative: "a" },
		{ letter: /[\u00c3]/g, alternative: "A" }
	],

};

/**
 * The function returning an array containing transliteration objects, based on the given locale.
 *
 * @param {string} locale The locale.
 * @returns {Array} An array containing transliteration objects.
 */
module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		return [];
	}
	switch( getLanguage( locale ) ) {
		case "es":
			return transliterations.es;
		case "pl":
			return transliterations.pl;
		case "de":
			return transliterations.de;
		case "nb":
		case "nn":
			return transliterations.nbnn;
		case "sv":
			return transliterations.sv;
		case "fi":
			return transliterations.fi;
		case "da":
			return transliterations.da;
		case "tr":
			return transliterations.tr;
		case "lv":
			return transliterations.lv;
		case "is":
			return transliterations.is;
		case "fa":
			return transliterations.fa;
		case "cs":
			return transliterations.cs;
		case "ru":
			return transliterations.ru;
		case "eo":
			return transliterations.eo;
		case "af":
			return transliterations.af;
		case "bal":
		case "ca":
			return transliterations.ca;
		case "ast":
			return transliterations.ast;
		case "an":
			return transliterations.an;
		case "ay":
			return transliterations.ay;
		case "en":
			return transliterations.en;
		case "fr":
			return transliterations.fr;
		case "it":
			return transliterations.it;
		case "nl":
			return transliterations.nl;
		case "bm":
			return transliterations.bm;
		case "uk":
			return transliterations.uk;
		case "br":
			return transliterations.br;
		case "ch":
			return transliterations.ch;
		case "csb":
			return transliterations.csb;
		case "cy":
			return transliterations.cy;
		case "ee":
			return transliterations.ee;
		case "et":
			return transliterations.et;
		case "eu":
			return transliterations.eu;
		case "fuc":
			return transliterations.fuc;
		case "fj":
			return transliterations.fj;
		case "frp":
			return transliterations.frp;
		case "fur":
			return transliterations.fur;
		case "fy":
			return transliterations.fy;
		case "ga":
			return transliterations.ga;
		case "gd":
			return transliterations.gd;
		case "gl":
			return transliterations.gl;
		case "gn":
			return transliterations.gn;
		case "gsw":
			return transliterations.gsw;
		case "hat":
			return transliterations.hat;
		case "haw":
			return transliterations.haw;
		case "hr":
			return transliterations.hr;
		case "ka":
			return transliterations.ka;
		case "kal":
			return transliterations.kal;
		case "kin":
			return transliterations.kin;
		case "lb":
			return transliterations.lb;
		case "li":
			return transliterations.li;
		case "lin":
			return transliterations.lin;
		case "lt":
			return transliterations.lt;
		case "mg":
			return transliterations.mg;
		case "mk":
			return transliterations.mk;
		case "mri":
			return transliterations.mri;
		case "mwl":
			return transliterations.mwl;
		case "oci":
			return transliterations.oci;
		case "orm":
			return transliterations.orm;
		case "pt":
			return transliterations.pt;
		case "roh":
			return transliterations.roh;
		case "rup":
			return transliterations.rup;
		default:
			return [];
	}
};
