/*
Copyright (c) 2017, Dogan Yazar
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
/**
 * Stems Swedish words.
 *
 * @param {string} word The word to stem.
 * @returns {string} The stemmed word.
 */
/**
 * Determines the start index of the R1 region.
 * R1 is the region after the first non-vowel following a vowel. It should include at least 3 letters.
 * @param {string} word The word for which to determine the R1 region.
 * @returns {number} The start index of the R1 region.
 */
const getRegions = function( word, morphologyData ) {
	const match = word.match( new RegExp( morphologyData.externalStemmer.regexR1region ));
	let r1 = "";
	if ( match && match[ 1 ] ) {
		r1 = match[ 1 ];
		if ( match.index + 2 < 3 ) {
			r1 = word.slice( 3 );
		}
	}
	return {
		r1,
		rest: word.slice( 0, word.length - r1.length ),
	};
};
/**
 * Search for the longest among the following suffixes,
 * (a) a   arna   erna   heterna   orna   ad   e   ade   ande   arne   are   aste   en   anden   aren   heten   ern   ar
 * er   heter   or   as   arnas   ernas   ornas   es   ades   andes   ens   arens   hetens   erns   at   andet
 * het   ast
 * @param {string} word The word to check for the suffix.
 * @param {number} regions
 * @returns {object} The word without the suffix.
 */
const removeSuffixes1a = function( word, regions, morphologyData ) {
	const r1 = regions.r1;
	if ( ! r1 ) {
		return word;
	}
	const regexSuffixes1a = new RegExp( morphologyData.externalStemmer.regexSuffixes1a );
	const match = r1.match( regexSuffixes1a );
	return match ? regions.rest + r1.slice( 0, match.index ) : word;
};
/**
 * Search for one of the following suffixes in R1, and if found delete the last letter.
 * (a) dd   gd   nn   dt   gt   kt   tt
 * (b) Define a valid s-ending as one of b, c, d, f, g, h, k, l, m, n, o, p, r, t, v, or y.
 * and delete if in R1. (The letter of the valid s-ending is not necessarily in R1.)
 * @param {string} word The word to check for the suffix.
 * @param {number} regions
 * @returns {object} The word without the suffix.
 */
const removeSuffixS1b = function( word, regions, morphologyData ) {
	if ( regions.r1 && word.match( new RegExp( morphologyData.externalStemmer.regexSuffixes1b ) ) ) {
		return word.slice( 0, -1 );
	}
	return word;
};
const removeSuffixStep2 = function( word, regions, morphologyData ) {
	const r1 = regions.r1;
	if ( r1 && r1.match( new RegExp( morphologyData.externalStemmer.regexSuffixes2 ) ) ) {
		return word.slice( 0, -1 );
	}
	return word;
};
/**
 * Search for the longest among the following suffixes in R1, and perform the action indicated.
 * delete lig   ig   els
 * remove t-ending from löst fullt
 * @param {string} word The word to check for the suffix.
 * @param {number} regions
 * @returns {object} The index of the suffix and the kind of suffix used.
 */
const removeSuffixStep3 = function( word, regions, morphologyData ) {
	const r1 = regions.r1;
	if ( r1 ) {
		if (r1.match( new RegExp( morphologyData.externalStemmer.regexSuffixes3a ) ) ) {
			return word.slice(0, -1);
		}
		const match = r1.match( new RegExp( morphologyData.externalStemmer.regexSuffixes3b ) );
		return match ? regions.rest + r1.slice( 0, match.index ) : word;
	}
	return word;
};
export default function stem( word, morphologyData ) {
	let regions = getRegions( word, morphologyData );
	const wordAfterStep1a = removeSuffixes1a( word, regions, morphologyData );
	const wordAfterStep1b = removeSuffixS1b( word, regions, morphologyData );
// Compare length of word from step 1 (a and b) and return the shorter word
	word = wordAfterStep1a.length < wordAfterStep1b.length ? wordAfterStep1a : wordAfterStep1b;
	regions = getRegions( word, morphologyData );
	word = removeSuffixStep2( word, regions, morphologyData );
	regions = getRegions( word, morphologyData );
	word = removeSuffixStep3( word, regions, morphologyData );
	return word;
}
