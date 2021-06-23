/* eslint-disable max-statements */

/**
 *
 * @param word
 * @returns {string|*}
 */
function palatalise( word ) {
	const palatalEndings1 = [ "ci", "ce", "či", "če" ];
	if ( palatalEndings1.includes( word.slice( -2 ) ) ) {
		return word.slice( 0, -2 ) + "k";
	}
	const palatalEndings2 = [ "zi", "ze", "ži", "že" ];
	if ( palatalEndings2.includes( word.slice( -2 ) ) ) {
		return word.slice( 0, -2 ) + "h";
	}
	const palatalEndings3 = [ "čte", "čti", "čtí" ];
	if ( palatalEndings3.includes( word.slice( -3 ) ) ) {
		return word.slice( 0, -3 ) + "ck";
	}
	const palatalEndings4 = [ "šte", "šti", "ští" ];
	if ( palatalEndings4.includes( word.slice( -3 ) ) ) {
		return word.slice( 0, -3 ) + "sk";
	}
	return word.slice( 0, -1 );
}

/**
 *
 * @param word
 * @returns {string|*}
 */
function removeCases( word ) {
	const caseSuffix1 = "atoch";
	if ( word.length > 7 && word.endsWith( caseSuffix1 ) ) {
		// Return the word without the suffix
		word = word.slice( 0, -5 );
	}
	const caseSuffix2 = "aťom";
	if ( word.length > 6 && word.endsWith( caseSuffix2 ) ) {
		word = palatalise( word.slice( 0, -3 ) );
	}

	if ( word.length > 5 ) {
		const caseSuffixes3 = [ "och", "ich", "ích", "ého", "eho", "ami", "emi", "ému",
			"ete", "eti", "iho", "ího", "ími", "imu", "aťa" ];
		const caseSuffixes4 = [ "ách", "ata", "aty", "ých", "ami",
			"ové", "ovi", "ými" ];
		if ( caseSuffixes3.includes( word.slice( -3 ) ) ) {
			word = palatalise( word.slice( 0, -2 ) );
		} else if ( caseSuffixes4.includes( word.slice( -3 ) ) ) {
			word = word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		const caseSuffix5 = "om";
		const caseSuffixes6 = [ "es", "ém", "ím" ];
		const caseSuffixes7 = [ "úm", "at", "ám", "os", "us", "ým", "mi", "ou", "ej" ];

		if ( word.endsWith( caseSuffix5 ) ) {
			word = palatalise( word.slice( 0, -1 ) );
		} else if ( caseSuffixes6.includes( word.slice( -2 ) ) ) {
			word = palatalise( word.slice( 0, -2 ) );
		} else if ( caseSuffixes7.includes( word.slice( -2 ) ) ) {
			word = word.slice( 0, -2 );
		}
	}
	if ( word.length > 3 ) {
		const caseRegex1 = new RegExp( "[eií]$" );
		const caseRegex2 = new RegExp( "[úyaoáéý]$" );

		if ( caseRegex1.test( word ) ) {
			word =  palatalise( word );
		} else if ( caseRegex2.test( word ) ) {
			word = word.slice( 0, -1 );
		}
	}
	return word;
}

function removePossessives( word ) {
	if ( word.length > 5 ) {
		const posSuffixOv = "ov";
		if ( word.endsWith( posSuffixOv ) ) {
			return word.slice( 0, -2 );
		}
		const posSuffixIn = "in";
		if ( word.endsWith( posSuffixIn ) ) {
			return palatalise( word.slice( 0, -1 ) );
		}
	}
	return word;
}

/**
 *
 * @param word
 * @returns {string|*}
 */
function removeComparatives( word ) {
	if ( word.length > 5 ) {
		const comparativeSuffixes = [ "ejš", "ějš" ];
		if ( comparativeSuffixes.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -2 ) );
		}
	}
	return word;
}

/**
 *
 * @param word
 * @returns {string|*}
 */
function removeDiminutives( word ) {
	const diminutiveSuffix1 = "oušok";
	if ( word.length > 7 && word.endsWith( diminutiveSuffix1 ) ) {
		return word.slice( 0, -5 );
	}
	if ( word.length > 6 ) {
		const diminutiveSuffixes2 = [ "ečok", "éčok", "ičok", "íčok", "enok", "énok",
			"inok", "ínok" ];
		if ( diminutiveSuffixes2.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -3 ) );
		}
		const diminutiveSuffixes3 = [ "áčok", "ačok", "očok", "učok", "anok", "onok",
			"unok", "ánok" ];
		if ( diminutiveSuffixes3.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -4 ) );
		}
	}
	if ( word.length > 5 ) {
		const diminutiveSuffixes4 = [ "ečk", "éčk", "ičk", "íčk", "enk", "énk",
			"ink", "ínk" ];
		if ( diminutiveSuffixes4.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -3 ) );
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
			return palatalise( word.slice( 0, -1 ) );
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
 *
 * @param word
 * @returns {string|*}
 */
function removeAugmentatives( word ) {
	const augmentativeSuffix1 = "ajzn";
	if ( word.length > 6 && word.endsWith( augmentativeSuffix1 ) ) {
		return word.slice( 0, -4 );
	}
	const augmentativeSuffixes2 = [ "izn", "isk" ];
	if ( word.length > 5 && augmentativeSuffixes2.includes( word.slice( -3 ) ) ) {
		return palatalise( word.slice( 0, -2 ) );
	}
	const augmentativeSuffix3 = "ák";
	if ( word.length > 4 && word.endsWith( augmentativeSuffix3 ) ) {
		return word.slice( 0, -2 );
	}
	return word;
}

/**
 *
 * @param word
 * @returns {string|*}
 */
function stemDerivational( word ) {
	const derivationalSuffix1 = "obinec";
	if ( word.length > 8 && word.endsWith( derivationalSuffix1 ) ) {
		return word.slice( 0, -6 );
	}
	if ( word.length > 7 ) {
		const derivationalSuffix2 = "ionár";
		if ( word.endsWith( derivationalSuffix2 ) ) {
			return palatalise( word.slice( 0, -4 ) );
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
			return palatalise( word.slice( 0, -3 ) );
		}
	}
	if ( word.length > 5 ) {
		const derivationalSuffix6 = "árn";
		if ( word.endsWith( derivationalSuffix6 ) ) {
			return word.slice( 0, -3 );
		}
		const derivationalSuffixes7 = [ "enk", "ián", "ist", "isk", "išt", "itb", "írn" ];
		if ( derivationalSuffixes7.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -2 ) );
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
			return palatalise( word.slice( 0, -1 ) );
		}
	}
	const derivationalRegex = new RegExp( "[cčklnt]$" );
	if ( word.length > 3 && derivationalRegex.test( word ) ) {
		return word.slice( 0, -1 );
	}
	return word;
}

/**
 *
 * @param word
 * @returns {string|*}
 */
export default function stem( word ) {
	// Remove case
	word = removeCases( word );
	// Remove possessives
	word = removePossessives( word );
	// Remove comparative
	word = removeComparatives( word );
	// Remove diminutive
	word = removeDiminutives( word );
	// Remove augmentative
	word = removeAugmentatives( word );
	// Remove derivational
	word = stemDerivational( word );

	return word;
}
