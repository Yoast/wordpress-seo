/* eslint-disable max-statements,complexity */
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Marek Šuppa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Takes care of palatalisation.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}      The non-palatalised word or the original word if no such suffix is found.
 */
function palatalise( word, morphologyData ) {
	const palatalEndingsRegexes = morphologyData.externalStemmer.palatalEndingsRegexes;
	// Check if word ends in a palatal ending and return the regex if it does.
	const checkPalatalEnding = palatalEndingsRegexes.find( regex => new RegExp( regex[ 0 ] ).test( word ) );
	if ( checkPalatalEnding ) {
		return word.replace( new RegExp( checkPalatalEnding[ 0 ] ), checkPalatalEnding[ 1 ] );
	}
	return word.slice( 0, -1 );
}

/**
 * Removes case suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}     The word without case suffixes or the original word if no such suffix is found.
 */
function removeCases( word, morphologyData ) {
	const caseSuffix1 = "atoch";
	if ( word.length > 7 && word.endsWith( caseSuffix1 ) ) {
		// Return the word without the suffix
		word = word.slice( 0, -5 );
	}
	const caseSuffix2 = "aťom";
	if ( word.length > 6 && word.endsWith( caseSuffix2 ) ) {
		word = palatalise( word.slice( 0, -3 ), morphologyData );
	}

	if ( word.length > 5 ) {
		const caseSuffixes3 = [ "och", "ich", "ích", "ého", "eho", "ami", "emi", "ému",
			"ete", "eti", "iho", "ího", "ími", "imu", "aťa" ];
		const caseSuffixes4 = [ "ách", "ata", "aty", "ých", "ami",
			"ové", "ovi", "ými" ];
		if ( caseSuffixes3.includes( word.slice( -3 ) ) ) {
			word = palatalise( word.slice( 0, -2 ), morphologyData );
		} else if ( caseSuffixes4.includes( word.slice( -3 ) ) ) {
			word = word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		const caseSuffix5 = "om";
		const caseSuffixes6 = [ "es", "ém", "ím" ];
		const caseSuffixes7 = [ "úm", "at", "ám", "os", "us", "ým", "mi", "ou", "ej" ];

		if ( word.endsWith( caseSuffix5 ) ) {
			word = palatalise( word.slice( 0, -1 ), morphologyData );
		} else if ( caseSuffixes6.includes( word.slice( -2 ) ) ) {
			word = palatalise( word.slice( 0, -2 ), morphologyData );
		} else if ( caseSuffixes7.includes( word.slice( -2 ) ) ) {
			word = word.slice( 0, -2 );
		}
	}
	if ( word.length > 3 ) {
		const caseRegex1 = new RegExp( "[eií]$" );
		const caseRegex2 = new RegExp( "[úyaoáéý]$" );

		if ( caseRegex1.test( word ) ) {
			word =  palatalise( word, morphologyData );
		} else if ( caseRegex2.test( word ) ) {
			word = word.slice( 0, -1 );
		}
	}
	return word;
}

/**
 * Removes possessive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}     The word without possessive suffixes or the original word if no such suffix is found.
 */
function removePossessives( word, morphologyData ) {
	if ( word.length > 5 ) {
		const posSuffixOv = "ov";
		if ( word.endsWith( posSuffixOv ) ) {
			return word.slice( 0, -2 );
		}
		const posSuffixIn = "in";
		if ( word.endsWith( posSuffixIn ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		}
	}
	return word;
}

/**
 * Removes comparative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}     The word without comparative suffixes or the original word if no such suffix is found.
 */
function removeComparatives( word, morphologyData ) {
	if ( word.length > 5 ) {
		const comparativeSuffixes = [ "ejš", "ějš" ];
		if ( comparativeSuffixes.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -2 ), morphologyData );
		}
	}
	return word;
}

/**
 * Removes diminutive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}      The word without diminutive suffixes or the original word if no such suffix is found.
 */
function removeDiminutives( word, morphologyData ) {
	const diminutiveSuffix1 = "oušok";
	if ( word.length > 7 && word.endsWith( diminutiveSuffix1 ) ) {
		return word.slice( 0, -5 );
	}
	if ( word.length > 6 ) {
		const diminutiveSuffixes2 = [ "ečok", "éčok", "ičok", "íčok", "enok", "énok",
			"inok", "ínok" ];
		if ( diminutiveSuffixes2.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -3 ), morphologyData );
		}
		const diminutiveSuffixes3 = [ "áčok", "ačok", "očok", "učok", "anok", "onok",
			"unok", "ánok" ];
		if ( diminutiveSuffixes3.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -4 ), morphologyData );
		}
	}
	if ( word.length > 5 ) {
		const diminutiveSuffixes4 = [ "ečk", "éčk", "ičk", "íčk", "enk", "énk",
			"ink", "ínk" ];
		if ( diminutiveSuffixes4.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -3 ), morphologyData );
		}
		const diminutiveSuffixes5 = [ "áčk", "ačk", "očk", "učk", "ank", "onk",
			"unk", "átk", "ánk", "ušk" ];
		if ( diminutiveSuffixes5.includes( word.slice( -3 ) ) ) {
			return word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		const diminutiveSuffixes6 = [ "ek", "ék", "ík", "ik" ];
		if ( diminutiveSuffixes6.includes( word.slice( -2 ) ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		}
		const diminutiveSuffixes7 = [ "ák", "ak", "ok", "uk" ];
		if ( diminutiveSuffixes7.includes( word.slice( -2 ) ) ) {
			return word.slice( 0, -1 );
		}
	}
	if ( word.length > 3 && word.endsWith( "k" ) ) {
		return word.slice( 0, -1 );
	}
	return word;
}

/**
 * Removes augmentative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}      The word without augmentative suffixes or the original word if no such suffix is found.
 */
function removeAugmentatives( word, morphologyData ) {
	const augmentativeSuffix1 = "ajzn";
	if ( word.length > 6 && word.endsWith( augmentativeSuffix1 ) ) {
		return word.slice( 0, -4 );
	}
	const augmentativeSuffixes2 = [ "izn", "isk" ];
	if ( word.length > 5 && augmentativeSuffixes2.includes( word.slice( -3 ) ) ) {
		return palatalise( word.slice( 0, -2 ), morphologyData );
	}
	const augmentativeSuffix3 = "ák";
	if ( word.length > 4 && word.endsWith( augmentativeSuffix3 ) ) {
		return word.slice( 0, -2 );
	}
	return word;
}

/**
 * Removes derivational suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}       The word without derivational suffixes or the original word if no such suffix is found.
 */
function stemDerivational( word, morphologyData ) {
	const derivationalSuffix1 = "obinec";
	if ( word.length > 8 && word.endsWith( derivationalSuffix1 ) ) {
		return word.slice( 0, -6 );
	}
	if ( word.length > 7 ) {
		const derivationalSuffix2 = "ionár";
		if ( word.endsWith( derivationalSuffix2 ) ) {
			return palatalise( word.slice( 0, -4 ), morphologyData );
		}
		const derivationalSuffixes3 = [ "ovisk", "ovstv", "ovišt", "ovník" ];
		if ( derivationalSuffixes3.includes( word.slice( -5 ) ) ) {
			return word.slice( 0, -5 );
		}
	}
	if ( word.length > 6 ) {
		const derivationalSuffixes4 = [ "ások", "nosť", "teln", "ovec", "ovík",
			"ovtv", "ovin", "štin" ];
		if ( derivationalSuffixes4.includes( word.slice( -4 ) ) ) {
			return word.slice( 0, -4 );
		}
		const derivationalSuffixes5 = [ "enic", "inec", "itel" ];
		if ( derivationalSuffixes5.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -3 ), morphologyData );
		}
	}
	if ( word.length > 5 ) {
		const derivationalSuffix6 = "árn";
		if ( word.endsWith( derivationalSuffix6 ) ) {
			return word.slice( 0, -3 );
		}
		const derivationalSuffixes7 = [ "enk", "ián", "ist", "isk", "išt", "itb", "írn" ];
		if ( derivationalSuffixes7.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -2 ), morphologyData );
		}
		const derivationalSuffixes8 = [ "och", "ost", "ovn", "oun", "out", "ouš",
			"ušk", "kyn", "čan", "kář", "néř", "ník",
			"ctv", "stv" ];
		if ( derivationalSuffixes8.includes( word.slice( -3 ) ) ) {
			return word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		const derivationalSuffixes9 = [ "áč", "ač", "án", "an", "ár", "ar", "ás", "as", "ob", "ot", "ov", "oň", "ul", "yn", "čk", "čn",
			"dl", "nk", "tv", "tk", "vk" ];
		if ( derivationalSuffixes9.includes( word.slice( -2 ) ) ) {
			return word.slice( 0, -2 );
		}
		const derivationalSuffixes10 = [ "ec", "en", "ér", "ír", "ic", "in", "ín",
			"it", "iv" ];
		if ( derivationalSuffixes10.includes( word.slice( -2 ) ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		}
	}
	const derivationalRegex = new RegExp( "[cčklnt]$" );
	if ( word.length > 3 && derivationalRegex.test( word ) ) {
		return word.slice( 0, -1 );
	}
	return word;
}

/**
 * Stems Slovak words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}    The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Remove case
	word = removeCases( word, morphologyData );
	// Remove possessives
	word = removePossessives( word, morphologyData );
	// Remove comparative
	word = removeComparatives( word, morphologyData );
	// Remove diminutive
	word = removeDiminutives( word, morphologyData );
	// Remove augmentative
	word = removeAugmentatives( word, morphologyData );
	// Remove derivational
	word = stemDerivational( word, morphologyData );

	return word;
}
