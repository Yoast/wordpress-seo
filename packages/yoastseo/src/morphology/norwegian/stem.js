/*
 * Copyright (c) 2001, Dr Martin Porter
 * Copyright (c) 2002, Richard Boulton.
 * All rights reserved.
 *
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that
 * the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and
 * the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Determines the start index of the R1 region.
 * R1 is the region after the first non-vowel following a vowel. It should include at least 3 letters.
 *
 * @param {string} word The word for which to determine the R1 region.
 * @returns {number} The start index of the R1 region.
 */
const determineR1 = function( word ) {
	// Start with matching first vowel and non-vowel.
	let r1Index = word.search( /[aeiouyøåæ][^aeiouyøåæ]/ );
	// Then add 2 since the R1 index is the index after the first vowel & non-vowel matched with the regex.
	if ( r1Index !== -1 ) {
		r1Index += 2;
	}

	// Adjust R1 so that the region preceding it includes at least 3 letters.
	if ( r1Index !== -1 && r1Index < 3 ) {
		r1Index = 3;
	}

	return r1Index;
};

/**
 *  Searches and stems these suffixes if in R1: hetene, hetens, hetens, heten, heter, endes, ande, ende, edes, enes, ede,
 *  ane, ene, ens, ers, ets, het, ast, en, ar, er, as, es, et, a, e.
 *  Searches and stems suffix -els if in R1.
 *  Searches and stems suffix -s if in R1 and if preceded by a valid precedence: b, c, d, f, g, h, j, l, m, n, o, p, r, t, v, y, z,
 *  or k not preceded by a vowel.
 *  Searches for suffixes -erte/-ert and change it to -er if in R1.
 *
 * @param {string} word             The word to check.
 * @param {number} r1Index          The start index of the R1.
 * @param {Object} morphologyData   The morphology data file.
 *
 * @returns {string}    The stemmed word.
 */
const removeSuffixesStep1 = function( word, r1Index, morphologyData ) {
	const suffixes1aIndex = word.search( new RegExp( morphologyData.externalStemmer.regexSuffixes1a ) );
	if ( suffixes1aIndex >= r1Index && r1Index !== -1 ) {
		word = word.substring( 0, suffixes1aIndex );
	}

	const suffix1bIndex = word.search( new RegExp( morphologyData.externalStemmer.regexSuffix1b ) );
	if ( suffix1bIndex >= r1Index && r1Index !== -1 ) {
		word = word.substring( 0, suffix1bIndex );
	}

	const suffixSIndex = word.search( /s$/ );
	const suffixes1cIndex = word.search( new RegExp( morphologyData.externalStemmer.regexSuffixes1c ) );
	if ( suffixSIndex >= r1Index && suffixes1cIndex !== -1 && r1Index !== -1 ) {
		word = word.slice( 0, -1 );
	}

	const suffixes1d = morphologyData.externalStemmer.regexSuffixes1d;
	const suffixes1dIndex = word.search( new RegExp( suffixes1d[ 0 ] ) );
	if ( suffixes1dIndex >= r1Index && r1Index !== -1 ) {
		word = word.replace( new RegExp( suffixes1d[ 0 ] ), ( suffixes1d[ 1 ] ) );
	}

	return word;
};

/**
 * Searches for suffixes -dt/-vt and stems -t if the suffix is in R1.
 *
 * @param {string} word             The word to check.
 * @param {number} r1Index          The start index of the R1.
 * @param {Object} morphologyData   The morphology data file.
 *
 * @returns {string}    The stemmed word.
 */
const removeSuffixesStep2 = function( word, r1Index, morphologyData ) {
	const suffixes2Index = word.search( new RegExp( morphologyData.externalStemmer.regexSuffixes2 ) );
	if ( suffixes2Index >= r1Index && r1Index !== -1 ) {
		word = word.slice( 0, -1 );
	}
	return word;
};

/**
 * Searches and stems these suffixes if in R1: hetslov, eleg, elig, elov, slov, leg, eig, lig, els, lov, ig.
 *
 * @param {string} word             The word to check.
 * @param {number} r1Index          The start index of the R1.
 * @param {Object} morphologyData   The morphology data file.
 *
 * @returns {string}    The stemmed word.
 */
const removeSuffixesStep3 = function( word, r1Index, morphologyData ) {
	const suffixes3Index = word.search( new RegExp( morphologyData.externalStemmer.regexSuffixes3 ) );
	if ( suffixes3Index >= r1Index && r1Index !== -1 ) {
		word = word.substring( 0, suffixes3Index );
	}
	return word;
};

/**
 * Stems Norwegian words.
 *
 * @param {string} word             The word to check.
 * @param {Object} morphologyData   The morphology data file.
 *
 * @returns {string}    The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Remove suffixes step 1
	let r1Index = determineR1( word );
	word =  removeSuffixesStep1( word, r1Index, morphologyData );

	// Remove suffixes step 2
	r1Index = determineR1( word );
	word =  removeSuffixesStep2( word, r1Index, morphologyData );

	// Remove suffixes step 3
	r1Index = determineR1( word );
	word = removeSuffixesStep3( word, r1Index, morphologyData );

	return word;
}
