
/**
 * @author Ljiljana Dolamic  University of Neuchatel
 * -removes case endings form nouns and adjectives, possesive adj. endings from names,
 *  diminutive, augmentative, comparative suffixes and derivational suffixes from nouns,
 *  takes care of palatalisation
 */

const removeDerivational = function( word ) {
	var len = word.length;

		if ( ( len > 8 ) &&
			word.substring( len - 6, len ) === "obinec" ) {

			return word.slice( 0, -6 );
		}//len >8
		if ( len > 7 ) {
			if ( word.substring( len - 5, len )=== "ion\u00e1\u0159" ) { // -ionář

				word = word.slice( 0, - 4 );
				return palatalise( word );
			}
			if ( word.substring( len - 5, len )=== "ovisk" ||
				word.substring( len - 5, len )=== "ovstv" ||
				word.substring( len - 5, len )=== "ovi\u0161t" ||  //-ovišt
				word.substring( len - 5, len )=== "ovn\u00edk" ) { //-ovník

				return word.slice( 0, - 5 );
			}
		}//len>7
		if ( len > 6 ) {
			if ( word.substring( len - 4, len )=== "\u00e1sek" || // -ásek
				word.substring( len - 4, len )=== "loun" ||
				word.substring( len - 4, len )=== "nost" ||
				word.substring( len - 4, len )=== "teln" ||
				word.substring( len - 4, len )=== "ovec" ||
				word.substring( len - 5, len )=== "ov\u00edk" || //-ovík
				word.substring( len - 4, len )=== "ovtv" ||
				word.substring( len - 4, len )=== "ovin" ||
				word.substring( len - 4, len )=== "\u0161tin" ) { //-štin

				return word.slice( 0, - 4 );
			}
			if ( word.substring( len - 4, len )=== "enic" ||
				word.substring( len - 4, len )=== "inec" ||
				word.substring( len - 4, len )=== "itel" ) {

				word = word.slice( 0, - 3 );
				return palatalise( word );
			}
		}//len>6
		if ( len > 5 ) {
			if ( word.substring( len - 3, len )=== "\u00e1rn" ) { //-árn

				return word.slice( 0, - 3 );
			}
			if ( word.substring( len - 3, len )=== "\u011bnk" ) { //-ěnk

				word = word.slice( 0, - 2 );
				return palatalise( word );
			}
			if ( word.substring( len - 3, len )=== "i\u00e1n" || //-ián
				word.substring( len - 3, len )=== "ist" ||
				word.substring( len - 3, len )=== "isk" ||
				word.substring( len - 3, len )=== "i\u0161t" || //-išt
				word.substring( len - 3, len )=== "itb" ||
				word.substring( len - 3, len )=== "\u00edrn" ) {  //-írn

				word = word.slice( 0, - 2 );
				return palatalise( word );
			}
			if ( word.substring( len - 3, len )=== "och" ||
				word.substring( len - 3, len )=== "ost" ||
				word.substring( len - 3, len )=== "ovn" ||
				word.substring( len - 3, len )=== "oun" ||
				word.substring( len - 3, len )=== "out" ||
				word.substring( len - 3, len )=== "ou\u0161" ) {  //-ouš

				return word.slice( 0, - 3 );
			}
			if ( word.substring( len - 3, len )=== "u\u0161k" ) { //-ušk

				return word.slice( 0, - 3 );
			}
			if ( word.substring( len - 3, len )=== "kyn" ||
				word.substring( len - 3, len )=== "\u010dan" ||    //-čan
				word.substring( len - 3, len )=== "k\u00e1\u0159" || //kář
				word.substring( len - 3, len )=== "n\u00e9\u0159" || //néř
				word.substring( len - 3, len )=== "n\u00edk" ||      //-ník
				word.substring( len - 3, len )=== "ctv" ||
				word.substring( len - 3, len )=== "stv" ) {

				return word.slice( 0, - 3 );
			}
		}//len>5
		if ( len > 4 ) {
			if ( word.substring( len - 2, len )=== "\u00e1\u010d" || // -áč
				word.substring( len - 2, len )=== "a\u010d" ||      //-ač
				word.substring( len - 2, len )=== "\u00e1n" ||      //-án
				word.substring( len - 2, len )=== "an" ||
				word.substring( len - 2, len )=== "\u00e1\u0159" || //-ář
				word.substring( len - 2, len )=== "as" ) {

				return word.slice( 0, - 2 );
			}
			if ( word.substring( len - 2, len )=== "ec" ||
				word.substring( len - 2, len )=== "en" ||
				word.substring( len - 2, len )=== "\u011bn" ||   //-ěn
				word.substring( len - 2, len )=== "\u00e9\u0159" ) {  //-éř

				word = word.slice( 0, - 1 );
				return palatalise( word );
			}
			if ( word.substring( len - 2, len )=== "\u00ed\u0159" || //-íř
				word.substring( len - 2, len )=== "ic" ||
				word.substring( len - 2, len )=== "in" ||
				word.substring( len - 2, len )=== "\u00edn" ||  //-ín
				word.substring( len - 2, len )=== "it" ||
				word.substring( len - 2, len )=== "iv" ) {

				word = word.slice( 0, - 1 );
				return palatalise( word );
			}
			if ( word.substring( len - 2, len )=== "ob" ||
				word.substring( len - 2, len )=== "ot" ||
				word.substring( len - 2, len )=== "ov" ||
				word.substring( len - 2, len )=== "o\u0148" ) { //-oň

				return word.slice( 0, - 2 );
			}
			if ( word.substring( len - 2, len )=== "ul" ) {

				return word.slice( 0, - 2 );
			}
			if ( word.substring( len - 2, len )=== "yn" ) {

				return word.slice( 0, - 2 );
			}
			if ( word.substring( len - 2, len )=== "\u010dk" || //-čk
				word.substring( len - 2, len )=== "\u010dn" ||  //-čn
				word.substring( len - 2, len )=== "dl" ||
				word.substring( len - 2, len )=== "nk" ||
				word.substring( len - 2, len )=== "tv" ||
				word.substring( len - 2, len )=== "tk" ||
				word.substring( len - 2, len )=== "vk" ) {

				return word.slice( 0, - 2 );
			}
		}//len>4
		if ( len > 3 ) {
			if ( word.charAt( word.length - 1 ) === 'c' ||
				word.charAt( word.length - 1 ) === '\u010d' || //-č
				word.charAt( word.length - 1 ) === 'k' ||
				word.charAt( word.length - 1 ) === 'l' ||
				word.charAt( word.length - 1 ) === 'n' ||
				word.charAt( word.length - 1 ) === 't' ) {

				return word.slice( 0, - 1 );
			}
		}//len>3
	return word;
}//removeDerivational

const removeAugmentative = function( word ) {
	var len = word.length;

	if ( ( len > 6 ) &&
		word.substring( len - 4, len )=== "ajzn" ) {

		return word.slice( 0, - 4 );
	}
	if ( ( len > 5 ) &&
		( word.substring( len - 3, len )=== "izn" ) ||
			word.substring( len - 3, len )=== "isk" ) {

		word = word.slice( 0, - 2 );
		return palatalise( word );
	}
	if ( ( len > 4 ) &&
		word.substring( len - 2, len )=== "\u00e1k" ) { //-ák

		return word.slice( 0, - 2 );
	}
	return word;
}

const removeDiminutive = function( word ) {
	var len = word.length;

	if ( ( len > 7 ) &&
		word.substring( len - 5, len )=== "ou\u0161ek" ) {  //-oušek

		return word.slice( 0, - 5 );
	}
	if ( len > 6 ) {
		if ( word.substring( len - 4, len )=== "e\u010dek" ||      //-eček
			word.substring( len - 4, len )=== "\u00e9\u010dek" ||    //-éček
			word.substring( len - 4, len )=== "i\u010dek" ||         //-iček
			word.substring( len - 4, len )=== "\u00ed\u010dek" ||    //íček
			word.substring( len - 4, len )=== "enek" ||
			word.substring( len - 4, len )=== "\u00e9nek" ||      //-ének
			word.substring( len - 4, len )=== "inek" ||
			word.substring( len - 4, len )=== "\u00ednek" ) {      //-ínek

			word = word.slice( 0, - 3 );
			return palatalise( word );
		}
		if ( word.substring( len - 4, len )=== "\u00e1\u010dek" || //áček
			word.substring( len - 4, len )=== "a\u010dek" ||   //aček
			word.substring( len - 4, len )=== "o\u010dek" ||   //oček
			word.substring( len - 4, len )=== "u\u010dek" ||   //uček
			word.substring( len - 4, len )=== "anek" ||
			word.substring( len - 4, len )=== "onek" ||
			word.substring( len - 4, len )=== "unek" ||
			word.substring( len - 4, len )=== "\u00e1nek" ) {   //-ánek

			return word.slice( 0, - 4 );
		}
	}//len>6
	if ( len > 5 ) {
		if ( word.substring( len - 3, len )=== "e\u010dk" ||   //-ečk
			word.substring( len - 3, len )=== "\u00e9\u010dk" ||  //-éčk
			word.substring( len - 3, len )=== "i\u010dk" ||   //-ičk
			word.substring( len - 3, len )=== "\u00ed\u010dk" ||    //-íčk
			word.substring( len - 3, len )=== "enk" ||   //-enk
			word.substring( len - 3, len )=== "\u00e9nk" ||  //-énk
			word.substring( len - 3, len )=== "ink" ||   //-ink
			word.substring( len - 3, len )=== "\u00ednk" ) {   //-ínk

			word = word.slice( 0, - 3 );
			return palatalise( word );
		}
		if ( word.substring( len - 3, len )=== "\u00e1\u010dk" ||  //-áčk
			word.substring( len - 3, len )=== "au010dk" || //-ačk
			word.substring( len - 3, len )=== "o\u010dk" ||  //-očk
			word.substring( len - 3, len )=== "u\u010dk" ||   //-učk
			word.substring( len - 3, len )=== "ank" ||
			word.substring( len - 3, len )=== "onk" ||
			word.substring( len - 3, len )=== "unk" ) {

			return word.slice( 0, - 3 );

		}
		if ( word.substring( len - 3, len )=== "\u00e1tk" || //-átk
			word.substring( len - 3, len )=== "\u00e1nk" ||  //-ánk
			word.substring( len - 3, len )=== "u\u0161k" ) {   //-ušk

			return word.slice( 0, - 3 );
		}
	}//len>5
	if ( len > 4 ) {
		if ( word.substring( len - 2, len )=== "ek" ||
			word.substring( len - 2, len )=== "\u00e9k" ||  //-ék
			word.substring( len - 2, len )=== "\u00edk" ||  //-ík
			word.substring( len - 2, len )=== "ik" ) {

			word = word.substring( 0, - 1 );
			return palatalise( word );
		}
		if ( word.substring( len - 2, len )=== "\u00e1k" ||  //-ák
			word.substring( len - 2, len )=== "ak" ||
			word.substring( len - 2, len )=== "ok" ||
			word.substring( len - 2, len )=== "uk" ) {

			return word.slice( 0, - 1 );
		}
	}
	if ( ( len > 3 ) &&
		word.substring( len - 1, len )=== "k" ) {

		return word.slice( 0 - 1 );
	}
	return word;
}//removeDiminutives

const removeComparative = function( word ) {
	var len = word.length;

	if ( ( len > 5 ) &&
		( word.substring( len - 3, len )=== "ej\u0161" ) ||  //-ejš
			word.substring( len - 3, len )=== "\u011bj\u0161" ) {   //-ějš

		word = word.slice( 0, - 2 );
		return palatalise( word );
	}
	return word;
}

const palatalise = function( word ) {
	var len = word.length;

	if ( word.substring( len - 2, len )=== "ci" ||
		word.substring( len - 2, len )=== "ce" ||
		word.substring( len - 2, len )=== "\u010di" ||      //-či
		word.substring( len - 2, len )=== "\u010de" ) {   //-če

		return word.replace( len - 2, len, "k" );
	}
	if ( word.substring( len - 2, len )=== "zi" ||
		word.substring( len - 2, len )=== "ze" ||
		word.substring( len - 2, len )=== "\u017ei" ||    //-ži
		word.substring( len - 2, len )=== "\u017ee" ) {  //-že

		return word.replace( len - 2, len, "h" );
	}
	if ( word.substring( len - 3, len )=== "\u010dt\u011b" ||     //-čtě
		word.substring( len - 3, len )=== "\u010dti" ||   //-čti
		word.substring( len - 3, len )=== "\u010dt\u00ed" ) {   //-čtí

		return word.replace( len - 3, len, "ck" );
	}
	if ( word.substring( len - 2, len )=== "\u0161t\u011b" ||   //-ště
		word.substring( len - 2, len )=== "\u0161ti" ||   //-šti
		word.substring( len - 2, len )=== "\u0161t\u00ed" ) {  //-ští

		return word.replace( len - 2, len, "sk" );
	}
	return word.slice( 0, - 1 );
}//palatalise

const removePossessives = function( word ) {
	var len = word.length;

	if ( len > 5 ) {
		if ( word.substring( len - 2, len ) === "ov" ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len )=== "\u016fv" ) { //-ův

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len )=== "in" ) {

			word = word.slice( 0, - 1 );
			return palatalise( word );
		}
	}
		return word;
}//removePossessives

const removeCase = function( word ) {
	var len = word.length;

	if ( ( len > 7 ) &&
		word.substring( len - 5, len ) === "atech" ) {

		return word.slice( 0, - 5 );
	}//len>7
	if ( len > 6 ) {
		if ( word.substring( len - 4, len ) === "\u011btem" ) {   //-ětem

			word = word.slice( 0, - 3 );
			return palatalise( word );
		}
		if ( word.substring( len - 4, len )=== "at\u016fm" ) {  //-atům
				return word.slice( 0, - 4 );
		}
	}
	if ( len > 5 ) {
		if ( word.substring( len - 3, len )=== "ech" ||
			word.substring( len - 3, len )=== "ich" ||
			word.substring( len - 3, len )=== "\u00edch" ) { //-ích

			word = word.slice( 0, - 2 );
			return palatalise( word );
		}
		if ( word.substring( len - 3, len )=== "\u00e9ho" || //-ého
			word.substring( len - 3, len )=== "\u011bmi" ||  //-ěmu
			word.substring( len - 3, len )=== "emi" ||
			word.substring( len - 3, len )=== "\u00e9mu" ||  // -ému				                                                                word.substring( len-3,len)==="ete")||
			word.substring( len - 3, len )=== "eti" ||
			word.substring( len - 3, len )=== "iho" ||
			word.substring( len - 3, len )=== "\u00edho" ||  //-ího
			word.substring( len - 3, len )=== "\u00edmi" ||  //-ími
			word.substring( len - 3, len )=== "imu" ) {

			word = word.slice( 0, - 2 );
			return palatalise( word );
		}
		if ( word.substring( len - 3, len )=== "\u00e1ch" || //-ách
			word.substring( len - 3, len )=== "ata" ||
			word.substring( len - 3, len )=== "aty" ||
			word.substring( len - 3, len )=== "\u00fdch" ||   //-ých
			word.substring( len - 3, len )=== "ama" ||
			word.substring( len - 3, len )=== "ami" ||
			word.substring( len - 3, len )=== "ov\u00e9" ||   //-ové
			word.substring( len - 3, len )=== "ovi" ||
			word.substring( len - 3, len )=== "\u00fdmi" ) {  //-ými

			return word.slice( 0, - 3 );
		}
	}
	if ( len > 4 ) {
		if ( word.substring( len - 2, len )=== "em" ) {

			word = word.slice( 0, - 1 );
			return palatalise( word );
		}
		if ( word.substring( len - 2, len )=== "es" ||
			word.substring( len - 2, len )=== "\u00e9m" ||    //-ém
			word.substring( len - 2, len )=== "\u00edm" ) {   //-ím

			word = word.slice( 0, - 2 );
			return palatalise( word );
		}
		if ( word.substring( len - 2, len )=== "\u016fm" ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len )=== "at" ||
			word.substring( len - 2, len )=== "\u00e1m" ||    //-ám
			word.substring( len - 2, len )=== "os" ||
			word.substring( len - 2, len )=== "us" ||
			word.substring( len - 2, len )=== "\u00fdm" ||     //-ým
			word.substring( len - 2, len )=== "mi" ||
			word.substring( len - 2, len )=== "ou" ) {

			return word.slice( 0, - 2 );
		}
	}//len>4
	if ( len > 3 ) {
		if ( word.substring( len - 1, len )=== "e" ||
			word.substring( len - 1, len )=== "i" ) {

			return palatalise( word );
		}
		if ( word.substring( len - 1, len )=== "\u00ed" || //-é
			word.substring( len - 1, len )=== "\u011b" ) { //-ě

			return palatalise( word );
		}
		if ( word.substring( len - 1, len )=== "u" ||
			word.substring( len - 1, len )=== "y" ||
			word.substring( len - 1, len )=== "\u016f" ) { //-ů

			return word.slice( 0, - 1 );
			}
		if ( word.substring( len - 1, len )=== "a" ||
			word.substring( len - 1, len )=== "o" ||
			word.substring( len - 1, len )=== "\u00e1" ||  //-á
			word.substring( len - 1, len )=== "\u00e9" ||  //-é
			word.substring( len - 1, len )=== "\u00fd" ) { //-ý

			return word.slice( 0, - 1 );
		}
	}//len>3
	return word;
}

/**
 * Stems Czech words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The stemmed word.
 */
export default function stem( word ) {

	word = word.toLowerCase();
	//removes case endings from nouns and adjectives
	word = removeCase( word );
	//removes possessive endings from names -ov- and -in-
	word = removePossessives( word );
	//removes comparative endings
	word = removeComparative( word );
	//removes diminutive endings
	word = removeDiminutive( word );
	//removes augmentatives endings
	word = removeAugmentative( word );
	//removes derivational suffixes from nouns
	word = removeDerivational( word );

	return word;
}
