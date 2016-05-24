var getLanguage = function ( locale ) {
	return locale.split( "_" )[ 0 ];
};

module.exports = function( locale ) {
		switch( getLanguage( locale ) ) {
			case "es":
				// Source: https://en.wikipedia.org/wiki/Spanish_orthography
				return [
					{letter: /[\u00F1]/g, alternative: "n"},
					{letter: /[\u00D1]/g, alternative: "N"},
					{letter: /[\u00E1]/g, alternative: "a"},
					{letter: /[\u00C1]/g, alternative: "A"},
					{letter: /[\u00E9]/g, alternative: "e"},
					{letter: /[\u00C9]/g, alternative: "E"},
					{letter: /[\u00ED]/g, alternative: "i"},
					{letter: /[\u00CD]/g, alternative: "I"},
					{letter: /[\u00F3]/g, alternative: "o"},
					{letter: /[\u00D3]/g, alternative: "O"},
					{
						letter: /[\u00FA\u00FC]/g,
						alternative: "u"
					},
					{
						letter: /[\u00DA\u00DC]/g,
						alternative: "U"
					}
				];
				break;
			case "pl":
				// Source: https://en.wikipedia.org/wiki/Polish_orthography
				return [
					{letter: /[\u0105]/g, alternative: "a"},
					{letter: /[\u0104]/g, alternative: "A"},
					{letter: /[\u0107]/g, alternative: "c"},
					{letter: /[\u0106]/g, alternative: "C"},
					{letter: /[\u0119]/g, alternative: "e"},
					{letter: /[\u0118]/g, alternative: "E"},
					{letter: /[\u0142]/g, alternative: "l"},
					{letter: /[\u0141]/g, alternative: "L"},
					{letter: /[\u0144]/g, alternative: "n"},
					{letter: /[\u0143]/g, alternative: "N"},
					{letter: /[\u00F3]/g, alternative: "o"},
					{letter: /[\u00D3]/g, alternative: "O"},
					{letter: /[\u015B]/g, alternative: "s"},
					{letter: /[\u015A]/g, alternative: "S"},
					{
						letter: /[\u017A\u017C]/g,
						alternative: "z"
					},
					{
						letter: /[\u0179\u017B]/g,
						alternative: "Z"
					}
				];
				break;
			case "de":
				// Source: https://en.wikipedia.org/wiki/German_orthography#Special_characters
				return [
					{letter: /[\u00E4]/g, alternative: "ae"},
					{letter: /[\u00C4]/g, alternative: "Ae"},
					{letter: /[\u00FC]/g, alternative: "ue"},
					{letter: /[\u00DC]/g, alternative: "Ue"},
					{letter: /[\u00F6]/g, alternative: "oe"},
					{letter: /[\u00D6]/g, alternative: "Oe"},
					{letter: /[\u00DF]/g, alternative: "ss"},
					{letter: /[\u1E9E]/g, alternative: "SS"}
				];
				break;
			case "nb":
			case "nn":
				// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
				return [
					{
						letter: /[\u00E6\u04D5]/g,
						alternative: "ae"
					},
					{
						letter: /[\u00C6\u04D4]/g,
						alternative: "Ae"
					},
					{letter: /[\u00E5]/g, alternative: "aa"},
					{letter: /[\u00C5]/g, alternative: "Aa"},
					{letter: /[\u00F8]/g, alternative: "oe"},
					{letter: /[\u00D8]/g, alternative: "Oe"},
					{
						letter: /[\u00E9\u00E8\u00EA]/g,
						alternative: "e"
					},
					{
						letter: /[\u00C9\u00C8\u00CA]/g,
						alternative: "E"
					},
					{
						letter: /[\u00F3\u00F2\u00F4]/g,
						alternative: "o"
					},
					{
						letter: /[\u00D3\u00D2\u00D4]/g,
						alternative: "O"
					}
				];
				break;
			case "sv":
				// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
				// http://forum.wordreference.com/threads/swedish-%C3%A4-ae-%C3%B6-oe-acceptable.1451839/

				return [
					{letter: /[\u00E5]/g, alternative: "aa"},
					{letter: /[\u00C5]/g, alternative: "Aa"},
					{letter: /[\u00E4]/g, alternative: "ae"},
					{letter: /[\u00C4]/g, alternative: "Ae"},
					{letter: /[\u00F6]/g, alternative: "oe"},
					{letter: /[\u00D6]/g, alternative: "Oe"},
					{letter: /[\u00E9]/g, alternative: "e"},
					{letter: /[\u00C9]/g, alternative: "E"},
					{letter: /[\u00E0]/g, alternative: "a"},
					{letter: /[\u00C0]/g, alternative: "A"}
				];
				break;
			case "fi":
				// Sources: https://www.cs.tut.fi/~jkorpela/lang/finnish-letters.html
				// https://en.wikipedia.org/wiki/Finnish_orthography
				return [
					{letter: /[\u00E5]/g, alternative: "aa"},
					{letter: /[\u00C5]/g, alternative: "Aa"},
					{letter: /[\u00E4]/g, alternative: "a"},
					{letter: /[\u00C4]/g, alternative: "A"},
					{letter: /[\u00F6]/g, alternative: "o"},
					{letter: /[\u00D6]/g, alternative: "O"},
					{letter: /[\u017E]/g, alternative: "zh"},
					{letter: /[\u017D]/g, alternative: "Zh"},
					{letter: /[\u0161]/g, alternative: "sh"},
					{letter: /[\u0160]/g, alternative: "Sh"}
				];
				break;
			case "da":
				// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
				// https://en.wikipedia.org/wiki/Danish_orthography
				return [
					{letter: /[\u00E5]/g, alternative: "aa"},
					{letter: /[\u00C5]/g, alternative: "Aa"},
					{
						letter: /[\u00E6\u04D5]/g,
						alternative: "ae"
					},
					{
						letter: /[\u00C6\u04D4]/g,
						alternative: "Ae"
					},
					{letter: /[\u00C4]/g, alternative: "Ae"},
					{letter: /[\u00F8]/g, alternative: "oe"},
					{letter: /[\u00D8]/g, alternative: "Oe"},
					{letter: /[\u00E9]/g, alternative: "e"},
					{letter: /[\u00C9]/g, alternative: "E"}
				];
				break;
			case "tr":
				// Source: https://en.wikipedia.org/wiki/Turkish_alphabet
				// ‘İ’ is the capital dotted ‘i’. Its lowercase counterpart is the ‘regular’ ‘i’.
				return [
					{letter: /[\u00E7]/g, alternative: "c"},
					{letter: /[\u00C7]/g, alternative: "C"},
					{letter: /[\u011F]/g, alternative: "g"},
					{letter: /[\u011E]/g, alternative: "G"},
					{letter: /[\u00F6]/g, alternative: "o"},
					{letter: /[\u00D6]/g, alternative: "O"},
					{letter: /[\u015F]/g, alternative: "s"},
					{letter: /[\u015E]/g, alternative: "S"},
					{letter: /[\u00E2]/g, alternative: "a"},
					{letter: /[\u00C2]/g, alternative: "A"},
					{
						letter: /[\u0131\u00EE]/g,
						alternative: "i"
					},
					{
						letter: /[\u0130\u00CE]/g,
						alternative: "I"
					},
					{
						letter: /[\u00FC\u00FB]/g,
						alternative: "u"
					},
					{
						letter: /[\u00DC\u00DB]/g,
						alternative: "U"
					}
				];
				break;
			case "lv":
				// Source: https://en.wikipedia.org/wiki/Latvian_orthography
				return [
					{letter: /[\u0101]/g, alternative: "a"},
					{letter: /[\u0100]/g, alternative: "A"},
					{letter: /[\u010D]/g, alternative: "c"},
					{letter: /[\u010C]/g, alternative: "C"},
					{letter: /[\u0113]/g, alternative: "e"},
					{letter: /[\u0112]/g, alternative: "E"},
					{letter: /[\u0123]/g, alternative: "g"},
					{letter: /[\u0122]/g, alternative: "G"},
					{letter: /[\u012B]/g, alternative: "i"},
					{letter: /[\u012A]/g, alternative: "I"},
					{letter: /[\u0137]/g, alternative: "k"},
					{letter: /[\u0136]/g, alternative: "K"},
					{letter: /[\u013C]/g, alternative: "l"},
					{letter: /[\u013B]/g, alternative: "L"},
					{letter: /[\u0146]/g, alternative: "n"},
					{letter: /[\u0145]/g, alternative: "N"},
					{letter: /[\u0161]/g, alternative: "s"},
					{letter: /[\u0160]/g, alternative: "S"},
					{letter: /[\u016B]/g, alternative: "u"},
					{letter: /[\u016A]/g, alternative: "U"},
					{letter: /[\u017E]/g, alternative: "z"},
					{letter: /[\u017D]/g, alternative: "Z"}
				];
				break;
			case "is":
				// Source: https://en.wikipedia.org/wiki/Latvian_orthography
				return [
					{letter: /[\u00E1]/g, alternative: "a"},
					{letter: /[\u00C1]/g, alternative: "A"},
					{letter: /[\u00F0]/g, alternative: "d"},
					{letter: /[\u00D0]/g, alternative: "D"},
					{letter: /[\u00E9]/g, alternative: "e"},
					{letter: /[\u00C9]/g, alternative: "E"},
					{letter: /[\u00ED]/g, alternative: "i"},
					{letter: /[\u00CD]/g, alternative: "I"},
					{
						letter: /[\u00F3\u00F6]/g,
						alternative: "o"
					},
					{
						letter: /[\u00D3\u00D6]/g,
						alternative: "O"
					},
					{letter: /[\u00FA]/g, alternative: "u"},
					{letter: /[\u00DA]/g, alternative: "U"},
					{letter: /[\u00FD]/g, alternative: "y"},
					{letter: /[\u00DD]/g, alternative: "Y"},
					{letter: /[\u00FE]/g, alternative: "th"},
					{letter: /[\u00DE]/g, alternative: "Th"},
					{
						letter: /[\u00E6\u04D5]/g,
						alternative: "ae"
					},
					{
						letter: /[\u00C6\u04D4]/g,
						alternative: "Ae"
					}
				];
				break;
			case "fa":
				// Source: https://www.facebook.com/groups/1557965757758234/permalink/1749847165236758/ (conversation in private Facebook Group ‘Faroese Language Learning Enthusiasts’)
				// depending on the word, ð can be d, g, j, v, ng or nothing. However, ‘d’ is most frequent.
				// when writing text messages or using a foreign keyboard, í is sometimes written as ij, ý as yj, ú as uv, ó as ov, ø as oe, and á as aa or oa.
				// However, in website URLs the alternatives mentioned below are by far the most common.
				return [
					{letter: /[\u00E1]/g, alternative: "a"},
					{letter: /[\u00C1]/g, alternative: "A"},
					{letter: /[\u00F0]/g, alternative: "d"},
					{letter: /[\u00D0]/g, alternative: "D"},
					{letter: /[\u00ED]/g, alternative: "i"},
					{letter: /[\u00CD]/g, alternative: "I"},
					{letter: /[\u00FD]/g, alternative: "y"},
					{letter: /[\u00DD]/g, alternative: "Y"},
					{letter: /[\u00FA]/g, alternative: "u"},
					{letter: /[\u00DA]/g, alternative: "U"},
					{
						letter: /[\u00F3\u00F8]/g,
						alternative: "o"
					},
					{
						letter: /[\u00D3\u00D8]/g,
						alternative: "O"
					},
					{
						letter: /[\u00E6\u04D5]/g,
						alternative: "ae"
					},
					{
						letter: /[\u00C6\u04D4]/g,
						alternative: "Ae"
					}
				];
				break;
			case "cz":
				// Source: https://en.wikipedia.org/wiki/Czech_orthography
				return [
					{letter: /[\u00E1]/g, alternative: "a"},
					{letter: /[\u00C1]/g, alternative: "A"},
					{letter: /[\u010D]/g, alternative: "c"},
					{letter: /[\u010C]/g, alternative: "C"},
					{letter: /[\u010F]/g, alternative: "d"},
					{letter: /[\u010E]/g, alternative: "D"},
					{letter: /[\u00ED]/g, alternative: "i"},
					{letter: /[\u00CD]/g, alternative: "I"},
					{letter: /[\u0148]/g, alternative: "n"},
					{letter: /[\u0147]/g, alternative: "N"},
					{letter: /[\u00F3]/g, alternative: "o"},
					{letter: /[\u00D3]/g, alternative: "O"},
					{letter: /[\u0159]/g, alternative: "r"},
					{letter: /[\u0158]/g, alternative: "R"},
					{letter: /[\u0161]/g, alternative: "s"},
					{letter: /[\u0160]/g, alternative: "S"},
					{letter: /[\u0165]/g, alternative: "t"},
					{letter: /[\u0164]/g, alternative: "T"},
					{letter: /[\u00FD]/g, alternative: "y"},
					{letter: /[\u00DD]/g, alternative: "Y"},
					{letter: /[\u017E]/g, alternative: "z"},
					{letter: /[\u017D]/g, alternative: "Z"},
					{
						letter: /[\u00E9\u011B]/g,
						alternative: "e"
					},
					{
						letter: /[\u00C9\u011A]/g,
						alternative: "E"
					},
					{
						letter: /[\u00FA\u016F]/g,
						alternative: "u"
					},
					{
						letter: /[\u00DA\u016E]/g,
						alternative: "U"
					}
				];
				break;
			case "ru":
				// Source:  Machine Readable Travel Documents, Doc 9303, Part 1, Volume 1 (PDF) (Sixth ed.).
				// ICAO. 2006. p. IV-50—IV-52. http://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
				// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant.
				// In text it is transliterated to a character similar to an apostroph: ′.
				// I recommend omittance in slugs. (https://en.wikipedia.org/wiki/Romanization_of_Russian)
				return [

					{letter: /[\u0431]/g, alternative: "b"},
					{letter: /[\u0411]/g, alternative: "B"},
					{letter: /[\u0432]/g, alternative: "v"},
					{letter: /[\u0412]/g, alternative: "V"},
					{letter: /[\u0433]/g, alternative: "g"},
					{letter: /[\u0413]/g, alternative: "G"},
					{letter: /[\u0434]/g, alternative: "d"},
					{letter: /[\u0414]/g, alternative: "D"},
					{letter: /[\u0436]/g, alternative: "zh"},
					{letter: /[\u0416]/g, alternative: "Zh"},
					{letter: /[\u0437]/g, alternative: "z"},
					{letter: /[\u0417]/g, alternative: "Z"},
					{
						letter: /[\u0438\u0439]/g,
						alternative: "i"
					},
					{
						letter: /[\u0418\u0419]/g,
						alternative: "I"
					},
					{letter: /[\u043A]/g, alternative: "k"},
					{letter: /[\u041A]/g, alternative: "K"},
					{letter: /[\u043B]/g, alternative: "l"},
					{letter: /[\u041B]/g, alternative: "L"},
					{letter: /[\u043C]/g, alternative: "m"},
					{letter: /[\u041C]/g, alternative: "M"},
					{letter: /[\u043D]/g, alternative: "n"},
					{letter: /[\u041D]/g, alternative: "N"},
					{letter: /[\u0070]/g, alternative: "r"},
					{letter: /[\u0050]/g, alternative: "R"},
					{letter: /[\u043F]/g, alternative: "p"},
					{letter: /[\u041F]/g, alternative: "P"},
					{letter: /[\u0441]/g, alternative: "s"},
					{letter: /[\u0421]/g, alternative: "S"},
					{letter: /[\u0442]/g, alternative: "t"},
					{letter: /[\u0422]/g, alternative: "T"},
					{letter: /[\u0443]/g, alternative: "u"},
					{letter: /[\u0423]/g, alternative: "U"},
					{letter: /[\u0444]/g, alternative: "f"},
					{letter: /[\u0424]/g, alternative: "F"},
					{letter: /[\u0445]/g, alternative: "kh"},
					{letter: /[\u0425]/g, alternative: "Kh"},
					{letter: /[\u0446]/g, alternative: "ts"},
					{letter: /[\u0426]/g, alternative: "Ts"},
					{letter: /[\u0447]/g, alternative: "ch"},
					{letter: /[\u0427]/g, alternative: "Ch"},
					{letter: /[\u0448]/g, alternative: "sh"},
					{letter: /[\u0428]/g, alternative: "Sh"},
					{letter: /[\u0449]/g, alternative: "shch"},
					{letter: /[\u0429]/g, alternative: "Shch"},
					{letter: /[\u044A]/g, alternative: "ie"},
					{letter: /[\u042A]/g, alternative: "Ie"},
					{letter: /[\u044B]/g, alternative: "y"},
					{letter: /[\u042B]/g, alternative: "Y"},
					{letter: /[\u044C]/g, alternative: ""},
					{letter: /[\u042C]/g, alternative: ""},
					{
						letter: /[\u0451\u044D]/g,
						alternative: "e"
					},
					{
						letter: /[\u0401\u042D]/g,
						alternative: "E"
					},
					{letter: /[\u044E]/g, alternative: "iu"},
					{letter: /[\u042E]/g, alternative: "Iu"},
					{letter: /[\u044F]/g, alternative: "ia"},
					{letter: /[\u042F]/g, alternative: "Ia"}

				];
				break;
			case "eo":
				// Source: https://en.wikipedia.org/wiki/Esperanto#Writing_diacritics
				return [
					{letter: /[\u0109]/g, alternative: "ch"},
					{letter: /[\u0108]/g, alternative: "Ch"},
					{letter: /[\u011d]/g, alternative: "gh"},
					{letter: /[\u011c]/g, alternative: "Gh"},
					{letter: /[\u0125]/g, alternative: "hx"},
					{letter: /[\u0124]/g, alternative: "Hx"},
					{letter: /[\u0135]/g, alternative: "jx"},
					{letter: /[\u0134]/g, alternative: "Jx"},
					{letter: /[\u015d]/g, alternative: "sx"},
					{letter: /[\u015c]/g, alternative: "Sx"},
					{letter: /[\u016d]/g, alternative: "ux"},
					{letter: /[\u016c]/g, alternative: "Ux"}
				];
				break;
			case "af":
				// Source: https://en.wikipedia.org/wiki/Afrikaans#Orthography
				return [
					{
						letter: /[\u00E8\u00EA\u00EB]/g,
						alternative: "e"
					},
					{
						letter: /[\u00CB\u00C8\u00CA]/g,
						alternative: "E"
					},
					{
						letter: /[\u00EE\u00EF]/g,
						alternative: "i"
					},
					{
						letter: /[\u00CE\u00CF]/g,
						alternative: "I"
					},
					{
						letter: /[\u00F4\u00F6]/g,
						alternative: "o"
					},
					{
						letter: /[\u00D4\u00D6]/g,
						alternative: "O"
					},
					{
						letter: /[\u00FB\u00FC]/g,
						alternative: "u"
					},
					{
						letter: /[\u00DB\u00DC]/g,
						alternative: "U"
					}
				];
				break;
		}
};

