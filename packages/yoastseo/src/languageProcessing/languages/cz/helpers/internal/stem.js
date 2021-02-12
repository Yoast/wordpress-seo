/**
 * Copyright (c) 2005, Jacques Savoy
 * Copyright (c) 2013, Jakub Dundalek.
 * Authored by Ljiljana Dolamic from the University of Neuchatel.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that
 * the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
 */

/**
 * Removes derivational suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without derivational suffixes or the original word if no such suffix is found.
 */
const removeDerivational = function( word, morphologyData ) {
	const derivationalSuffixes = morphologyData.externalStemmer.derivationalSuffixes;
	const len = word.length;

	if ( ( len > 8 ) &&
		word.substring( len - 6, len ) === derivationalSuffixes.derivationalSuffixObinec ) {
		return word.slice( 0, -6 );
	}
	if ( len > 7 ) {
			// -ionář
		if ( word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixIonar ) {
			word = word.slice( 0, - 4 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvisk ||
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvstv ||
			//-ovišt
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvist ||
			//-ovník
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvnik ) {

			return word.slice( 0, - 5 );
		}
	}
	if ( len > 6 ) {
			// -ásek
		if ( word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixAsek ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixLoun ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixNost ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixTeln ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixOvec ||
			//-ovík
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvik ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixOvtv ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixOvin ||
			//-štin
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixStin ) {

			return word.slice( 0, - 4 );
		}
		if ( word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixEnic ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixInec ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixItel ) {

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
	}
	if ( len > 5 ) {
			//-árn
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixArn ) {

			return word.slice( 0, - 3 );
		}
			//-ěnk
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixEnk ) {

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
			//-ián
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIan ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIst ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIsk ||
			//-išt
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIstCaron ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixItb ||
			//-írn
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIrn ) {

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOch ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOst ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOvn ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOun ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOut ||
			//-ouš
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOus ) {

			return word.slice( 0, - 3 );
		}
			//-ušk
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixUsk ) {

			return word.slice( 0, - 3 );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixKyn ||
			//-čan
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixCan ||
			//kář
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixKar ||
			//néř
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixNer ||
			//-ník
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixNik ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixCtv ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixStv  ) {

			return word.slice( 0, - 3 );
		}
	}
	if ( len > 4 ) {
			// -áč
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAcAccented ||
			//-ač
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAc ||
			//-án
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAnAccented ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAn ||
			//-ář
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAr ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAs ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEc ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEn ||
			//-ěn
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEnCaron ||
			//-éř
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEr ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
			//-íř
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIr ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIc ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIn ||
			//-ín
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixInAccented ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIt ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIv ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOb ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOt ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOv ||
			//-oň
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOn ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixUl ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixYn ) {

			return word.slice( 0, - 2 );
		}
			//-čk
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixCk ||
			//-čn
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixCn ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixDl ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixNk ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixTv ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixTk ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixVk ) {

			return word.slice( 0, - 2 );
		}
	}
	if ( len > 3 ) {
		if ( word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixC ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixCCaron ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixK ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixL ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixN ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixT ) {

			return word.slice( 0, - 1 );
		}
	}
	return word;
};

/**
 * Removes augmentative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without augmentative suffixes or the original word if no such suffix is found.
 */
const removeAugmentative = function( word, morphologyData ) {
	const augmentativeSuffixes = morphologyData.externalStemmer.augmentativeSuffixes;
	let len = word.length;

	if ( ( len > 6 ) &&
		word.substring( len - 4, len ) === augmentativeSuffixes.augmentativeSuffixAjzn ) {

		return word.slice( 0, - 4 );
	}
	if ( ( len > 5 ) &&
		( word.substring( len - 3, len ) === augmentativeSuffixes.augmentativeSuffixIzn ) ||
		word.substring( len - 3, len ) === augmentativeSuffixes.augmentativeSuffixIsk ) {

		word = word.slice( 0, - 2 );
		return palatalise( word, morphologyData );
	}
	if ( ( len > 4 ) &&
		//-ák
		word.substring( len - 2, len ) === augmentativeSuffixes.augmentativeSuffixAk ) {

		return word.slice( 0, - 2 );
	}
	return word;
};

/**
 * Removes diminutive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without diminutive suffixes or the original word if no such suffix is found.
 */
const removeDiminutive = function( word, morphologyData ) {
	const diminutiveSuffixes = morphologyData.externalStemmer.diminutiveSuffixes;
	let len = word.length;

	if ( ( len > 7 ) &&
		//-oušek
		word.substring( len - 5, len ) === diminutiveSuffixes.diminutiveSuffixOusek ) {

		return word.slice( 0, - 5 );
	}
	if ( len > 6 ) {
			//-eček
		if ( word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEcek ||
			//-éček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEcekAccented ||
			//-iček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixIcek ||
			//íček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixIcekAccented ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEnek ||
			//-ének
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEnekAccented ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixInek ||
			//-ínek
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixInekAccented ) {

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
			//áček
		if ( word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAcekAccented ||
			//aček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAcek ||
			//oček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixOcek ||
			//uček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixUcek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAnek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixOnek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixUnek ||
			//-ánek
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAnekAccented ) {

			return word.slice( 0, - 4 );
		}
	}
	if ( len > 5 ) {
			//-ečk
		if ( word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEck ||
			//-éčk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEckAccented ||
			//-ičk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixIck ||
			//-íčk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixIckAccented ||
			//-enk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEnk ||
			//-énk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEnkAccented ||
			//-ink
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixInk ||
			//-ínk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixInkAccented ) {

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
			//-áčk
		if ( word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAckAccented ||
			//-ačk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAck ||
			//-očk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixOck ||
			//-učk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixUck ||
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAnk ||
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixOnk ||
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixUnk ) {

			return word.slice( 0, - 3 );

		}
			//-átk
		if ( word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAtk ||
			//-ánk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAnkAccented ||
			//-ušk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixUsk ) {

			return word.slice( 0, - 3 );
		}
	}
	if ( len > 4 ) {
		if ( word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixEk ||
			//-ék
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixEkAccented ||
			//-ík
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixIkAccented ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixIk ) {

			word = word.substring( 0, - 1 );
			return palatalise( word, morphologyData );
		}
			//-ák
		if ( word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixAkAccented ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixAk ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixOk ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixUk ) {

			return word.slice( 0, - 1 );
		}
	}
	if ( ( len > 3 ) &&
		word.substring( len - 1, len ) === diminutiveSuffixes.diminutiveSuffixK ) {

		return word.slice( 0, - 1 );
	}
	return word;
};

/**
 * Removes comparative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without comparative suffixes or the original word if no such suffix is found.
 */
const removeComparative = function( word, morphologyData ) {
	const comparativeSuffixes = morphologyData.externalStemmer.comparativeSuffixes;
	let len = word.length;

	if ( ( len > 5 ) &&
		//-ejš
		( word.substring( len - 3, len ) ===  comparativeSuffixes.comparativeSuffixesEjs ) ||
		//-ějš
		word.substring( len - 3, len ) === comparativeSuffixes.comparativeSuffixesEjsCaron ) {

		word = word.slice( 0, - 2 );
		return palatalise( word, morphologyData );
	}
	return word;
};

/**
 * Takes care of palatalisation.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The non-palatalised word or the original word if no such suffix is found.
 */
const palatalise = function( word, morphologyData ) {
	const palataliseSuffixes = morphologyData.externalStemmer.palataliseSuffixes;
	let len = word.length;

	if ( word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCi ||
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCe ||
		//-či
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCiCaron ||
		//-če
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCeCaron ) {

		return word.replace( len - 2, len, palataliseSuffixes.palataliseSuffixK );
	}
	if ( word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZi ||
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZe ||
		//-ži
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZiCaron ||
		//-že
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZeCaron ) {

		return word.replace( len - 2, len, palataliseSuffixes.palataliseSuffixH );
	}
		//-čtě
	if ( word.substring( len - 3, len ) === palataliseSuffixes.palataliseSuffixCte ||
		//-čti
		word.substring( len - 3, len ) === palataliseSuffixes.palataliseSuffixCti ||
		//-čtí
		word.substring( len - 3, len ) === palataliseSuffixes.palataliseSuffixCtiAccented ) {

		return word.replace( len - 3, len, palataliseSuffixes.palataliseSuffixCk );
	}
		//-ště
	if ( word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixSte ||
		//-šti
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixSti ||
		//-ští
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixStiAccented ) {

		return word.replace( len - 2, len, palataliseSuffixes.palataliseSuffixSk );
	}
	return word.slice( 0, - 1 );
};

/**
 * Removes possessive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without possessive suffixes or the original word if no such suffix is found.
 */
const removePossessives = function( word, morphologyData ) {
	const possessiveSuffixes = morphologyData.externalStemmer.possessiveSuffixes;
	let len = word.length;

	if ( len > 5 ) {
		if ( word.substring( len - 2, len ) === possessiveSuffixes.possessiveSuffixOv ) {

			return word.slice( 0, - 2 );
		}
		//-ův
		if ( word.substring( len - 2, len ) === possessiveSuffixes.possessiveSuffixesUv ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === possessiveSuffixes.possessiveSuffixIn ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
	}
	return word;
};

/**
 * Removes case suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without case suffixes or the original word if no such suffix is found.
 */
const removeCase = function( word, morphologyData ) {
	const caseSuffixes = morphologyData.externalStemmer.caseSuffixes;
	let len = word.length;

	if ( ( len > 7 ) &&
		word.substring( len - 5, len ) === caseSuffixes.caseSuffixAtech ) {

		return word.slice( 0, - 5 );
	}
	if ( len > 6 ) {
		//-ětem
		if ( word.substring( len - 4, len ) === caseSuffixes.caseSuffixEtem ) {

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
		//-atům
		if ( word.substring( len - 4, len ) === caseSuffixes.caseSuffixAtum ) {
			return word.slice( 0, - 4 );
		}
	}
	if ( len > 5 ) {
		if ( word.substring( len - 3, len ) === caseSuffixes.caseSuffixEch ||
			word.substring( len - 3, len ) ===  caseSuffixes.caseSuffixIch ||
			//-ích
			word.substring( len - 3, len ) ===  caseSuffixes.caseSuffixIchAccented ) {

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
			//-ého
		if ( word.substring( len - 3, len ) === caseSuffixes.caseSuffixEho ||
			// -ěmi
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEmiCaron ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEmi ||
			// -ému
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEmuAccented ||
			word.substring( len - 3,len ) === caseSuffixes.caseSuffixEte ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEti ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixIho ||
			//-ího
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixIhoAccented ||
			//-ími
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixImi ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixImu ) {

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
			//-ách
		if ( word.substring( len - 3, len ) === caseSuffixes.caseSuffixAchAccented ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAta ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAty ||
			//-ých
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixYch ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAma ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAmi ||
			//-ové
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixOve ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixOvi ||
			//-ými
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixYmi ) {

			return word.slice( 0, - 3 );
		}
	}
	if ( len > 4 ) {
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixEm ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixEs ||
			//-ém
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixEmAccented ||
			//-ím
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixIm ) {

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
			// -ům
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixUm ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixAt ||
			//-ám
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixAm ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixOs ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixUs ||
			//-ým
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixYm ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixMi ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixOu ) {

			return word.slice( 0, - 2 );
		}
	}
	if ( len > 3 ) {
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixE ||
			word.substring( len - 1, len ) ===  caseSuffixes.caseSuffixI ) {

			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixIAccented ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixECaron ) {

			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixU ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixY ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixURing ) {

			return word.slice( 0, - 1 );
		}
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixA ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixO ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixAAccented ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixEAccented ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixYAccented ) {

			return word.slice( 0, - 1 );
		}
	}
	return word;
};

/**
 * Stems Czech words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The stemmed word.
 */
export default function stem( word, morphologyData ) {

	word = word.toLowerCase();
	// Removes case endings from nouns and adjectives.
	word = removeCase( word, morphologyData );
	// Removes possessive -ov- and -in- endings from names.
	word = removePossessives( word, morphologyData );
	// Removes comparative endings.
	word = removeComparative( word, morphologyData );
	// Removes diminutive endings.
	word = removeDiminutive( word, morphologyData );
	// Removes augmentatives endings.
	word = removeAugmentative( word, morphologyData );
	// Removes derivational suffixes from nouns.
	word = removeDerivational( word, morphologyData );

	return word;
}
