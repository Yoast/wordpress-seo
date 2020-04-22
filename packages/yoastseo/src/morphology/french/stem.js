/* eslint-disable max-statements, complexity */

/*
 * MIT License
 *
 * Copyright (c) 2017 Bastien Botella
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
/*
 * Author: Kasun Gajasinghe, University of Moratuwa
 * E-Mail: kasunbg AT gmail DOT com
 * Date: 09.08.2010
 *
 * LICENSE:
 *
 * Copyright (c) 2010, Kasun Gajasinghe. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY KASUN GAJASINGHE ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL KASUN GAJASINGHE BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * Determines R1, R2 and RV.
 *
 * @param {string} word The word for which to determine the R regions.
 *
 * @returns {[number]} The R1, R2 and RV.
 */
const determineRs = function( word ) {
	let rvIndex = -1;

	if ( word.search( /^(par|col|tap)/ ) !== -1 || word.search( /^[aeiouyâàëéêèïîôûù]{2}/ ) !== -1 ) {
		rvIndex = 3;
	} else {
		rvIndex = word.substring( 1 ).search( /[aeiouyâàëéêèïîôûù]/ );

		if ( rvIndex === -1 ) {
			rvIndex = word.length;
		} else {
			// +2 is to supplement the substring(1) used to find rvIndex
			rvIndex += 2;
		}
	}

	/*
	 * R1 is the region after the first non-vowel following a vowel, or the end of the word if there is no such non-vowel.
	 * R2 is the region after the first non-vowel following a vowel in R1, or the end of the word if there is no such non-vowel.
	 */
	let r1Index = word.search( /[aeiouyâàëéêèïîôûù][^aeiouyâàëéêèïîôûù]/ );
	let r1 = "";
	if ( r1Index === -1 ) {
		r1Index = word.length;
	} else {
		r1Index += 2;
		r1 = word.substring( r1Index );
	}

	let r2Index = -1;
	if ( r1Index !== -1 ) {
		r2Index = r1.search( /[aeiouyâàëéêèïîôûù][^aeiouyâàëéêèïîôûù]/ );
		if ( r2Index === -1 ) {
			r2Index = word.length;
		} else {
			r2Index += 2;
			r2Index += r1Index;
		}
	}
	if ( r1Index !== -1 && r1Index < 3 ) {
		r1Index = 3;
	}

	return [
		r1Index,
		r2Index,
		rvIndex,
	];
};

/**
 * Removes or normalizes standard suffixes.
 *
 * @param {string} word             The word for which to remove suffixes.
 * @param {Object} morphologyData   The French morphology data.
 * @param {number} r1Index          The start index of R1.
 * @param {number} r2Index          The start index of R2.
 * @param {number} rvIndex          The start index of RV.
 *
 * @returns {string} The word with standard suffixes removed or normalized.
 */
const processStandardSuffixes = function( word, morphologyData, r1Index, r2Index, rvIndex ) {
	const standardSuffixData = morphologyData.standardSuffixes;
	const a1Index = word.search( new RegExp( standardSuffixData.standardSuffixes1 ) ),
		a2Index = word.search( new RegExp( standardSuffixData.standardSuffixes2 ) ),
		a3Index = word.search( new RegExp( standardSuffixData.standardSuffixes3 ) ),
		a4Index = word.search( new RegExp( standardSuffixData.standardSuffixes4 ) ),
		a5Index = word.search( new RegExp( standardSuffixData.standardSuffixes5 ) ),
		a6Index = word.search( new RegExp( standardSuffixData.standardSuffixes6 ) ),
		a7Index = word.search( new RegExp( standardSuffixData.standardSuffixes7 ) ),
		a8Index = word.search( new RegExp( standardSuffixData.standardSuffixes8 ) ),
		a9Index = word.search( new RegExp( standardSuffixData.standardSuffixes9 ) ),
		a10Index = word.search( new RegExp( standardSuffixData.standardSuffixes10 ) ),
		a11Index = word.search( new RegExp( standardSuffixData.standardSuffixes11 ) ),
		a12Index = word.search( new RegExp( standardSuffixData.standardSuffixes12 ) ),
		a13Index = word.search( new RegExp( standardSuffixData.standardSuffixes13 ) ),
		a14Index = word.search( new RegExp( standardSuffixData.standardSuffixes14 ) ),
		a15Index = word.search( new RegExp( standardSuffixData.standardSuffixes15 ) );

	if ( a1Index !== -1 && a1Index >= r2Index ) {
		word = word.substring( 0, a1Index );
	} else if ( a2Index !== -1 && a2Index >= r2Index ) {
		word = word.substring( 0, a2Index );
		const a2Index2 = word.search( /(ic)$/ );

		if ( a2Index2 !== -1 && a2Index2 >= r2Index ) {
			// If preceded by ic, delete if in R2
			word = word.substring( 0, a2Index2 );
		} else {
			// Else replace by iqU
			word = word.replace( /(ic)$/, "iqU" );
		}
	} else if ( a3Index !== -1 && a3Index >= r2Index ) {
		// Replace with log if in R2
		word = word.replace( /(logie|logies)$/, "log" );
	} else if ( a4Index !== -1 && a4Index >= r2Index ) {
		// Replace with u if in R2
		word = word.replace( /(usion|ution|usions|utions)$/, "u" );
	} else if ( a5Index !== -1 && a5Index >= r2Index ) {
		// Replace with ent if in R2
		word = word.replace( /(ence|ences)$/, "ent" );
	} else if ( a6Index !== -1 && a6Index >= rvIndex ) {
		word = word.substring( 0, a6Index );

		if ( word.search( /(iv)$/ ) >= r2Index ) {
			word = word.replace( /(iv)$/, "" );

			if ( word.search( /(at)$/ ) >= r2Index ) {
				word = word.replace( /(at)$/, "" );
			}
		} else if ( word.search( /(eus)$/ ) !== -1 ) {
			const a6Index2 = word.search( /(eus)$/ );

			if ( a6Index2 >= r2Index ) {
				word = word.substring( 0, a6Index2 );
			} else if ( a6Index2 >= r1Index ) {
				word = word.substring( 0, a6Index2 ) + "eux";
			}
		} else if ( word.search( /(abl|iqU)$/ ) >= r2Index ) {
			// If preceded by abl or iqU, delete if in R2
			word = word.replace( /(abl|iqU)$/, "" );
		} else if ( word.search( /(ièr|Ièr)$/ ) >= rvIndex ) {
			// If preceded by abl or iqU, delete if in R2
			word = word.replace( /(ièr|Ièr)$/, "i" );
		}
	} else if ( a7Index !== -1 && a7Index >= r2Index ) {
		// Delete if in R2
		word = word.substring( 0, a7Index );

		if ( word.search( /(abil)$/ ) !== -1 ) {
			// If preceded by abil, delete if in R2, else replace by abl, otherwise
			const a7Index2 = word.search( /(abil)$/ );

			if ( a7Index2 >= r2Index ) {
				word = word.substring( 0, a7Index2 );
			} else {
				word = word.substring( 0, a7Index2 ) + "abl";
			}
		} else if ( word.search( /(ic)$/ ) !== -1 ) {
			const a7Index3 = word.search( /(ic)$/ );

			if ( a7Index3 !== -1 && a7Index3 >= r2Index ) {
				// If preceded by ic, delete if in R2
				word = word.substring( 0, a7Index3 );
			} else {
				// Else replace by iqU
				word = word.replace( /(ic)$/, "iqU" );
			}
		} else if ( word.search( /(iv)$/ ) !== r2Index ) {
			word = word.replace( /(iv)$/, "" );
		}
	} else if ( a8Index !== -1 && a8Index >= r2Index ) {
		word = word.substring( 0, a8Index );

		if ( word.search( /(at)$/ ) >= r2Index ) {
			word = word.replace( /(at)$/, "" );

			if ( word.search( /(ic)$/ ) >= r2Index ) {
				word = word.replace( /(ic)$/, "" );
			} else {
				word = word.replace( /(ic)$/, "iqU" );
			}
		}
	} else if ( a9Index !== -1 ) {
		word = word.replace( /(eaux)/, "eau" );
	} else if ( a10Index >= r1Index ) {
		word = word.replace( /(aux)/, "al" );
	} else if ( a11Index !== -1 ) {
		const a11Index2 = word.search( /(euse|euses)$/ );

		if ( a11Index2 >= r2Index ) {
			word = word.substring( 0, a11Index2 );
		} else if ( a11Index2 >= r1Index ) {
			word = word.substring( 0, a11Index2 ) + "eux";
		}
	} else if ( a12Index !== -1 && a12Index >= r1Index ) {
		// +1- amendment to non-vowel
		word = word.substring( 0, a12Index + 1 );
	} else if ( a13Index !== -1 && a13Index >= rvIndex ) {
		word = word.replace( /(amment)$/, "ant" );
	} else if ( a14Index !== -1 && a14Index >= rvIndex ) {
		word = word.replace( /(emment)$/, "ent" );
	} else if ( a15Index !== -1 && a15Index >= rvIndex ) {
		word = word.substring( 0, a15Index + 1 );
	}

	return word;
};
/**
 * Removes verb suffixes starting with i.
 *
 * @param {string}  word                            The word for which to remove suffixes.
 * @param {string}  originalWord                    The unprocessed word.
 * @param {number}  rvIndex                         The start index of RV.
 *
 * @returns {{step2aDone: boolean, word: string}}   The word and information about whether the conditions for step 2a were met.
 */
const removeVerbSuffixesStartingWithI = function( word, originalWord, rvIndex ) {
	let step2aDone = false;
	if ( originalWord === word.toLowerCase() || originalWord.search( /(amment|emment|ment|ments)$/ ) !== -1 ) {
		step2aDone = true;
		// eslint-disable-next-line max-len
		const b1Regex = /([^aeiouyâàëéêèïîôûù])(îmes|ît|îtes|i|ie|ies|ir|ira|irai|iraIent|irais|irait|iras|irent|irez|iriez|irions|irons|iront|is|issaIent|issais|issait|issant|issante|issantes|issants|isse|issent|isses|issez|issiez|issions|issons|it)$/i;

		if ( word.search( b1Regex ) >= rvIndex ) {
			word = word.replace( b1Regex, "$1" );
		}
	}

	return { word, step2aDone };
};

/**
 * Removes other verb suffixes.
 *
 * @param {string}  word                            The word for which to remove suffixes.
 * @param {boolean} step2aDone                      Whether step 2a was done.
 * @param {string}  wordAfterStep1                  The word after step 1 was done.
 * @param {number}  r2Index                         The start index of R2.
 * @param {number}  rvIndex                         The start index of RV.
 *
 * @returns {string}                                The word after other verb suffixes were removed.
 */
const removeOtherVerbSuffixes = function( word, step2aDone, wordAfterStep1, r2Index, rvIndex ) {
	if ( step2aDone && wordAfterStep1 === word ) {
		if ( word.search( /(ions)$/ ) >= r2Index ) {
			word = word.replace( /(ions)$/, "" );
		} else {
			const b2Regex = /(é|ée|ées|és|èrent|er|era|erai|eraIent|erais|erait|eras|erez|eriez|erions|erons|eront|ez|iez)$/i;

			if ( word.search( b2Regex ) >= rvIndex ) {
				word = word.replace( b2Regex, "" );
			} else {
				const b3Regex = /e(âmes|ât|âtes|a|ai|aIent|ais|ait|ant|ante|antes|ants|as|asse|assent|asses|assiez|assions)$/i;

				if ( word.search( b3Regex ) >= rvIndex ) {
					word = word.replace( b3Regex, "" );
				} else {
					const b3Regex2 = /(âmes|ât|âtes|a|ai|aIent|ais|ait|ant|ante|antes|ants|as|asse|assent|asses|assiez|assions)$/i;
					// eslint-disable-next-line max-depth
					if ( word.search( b3Regex2 ) >= rvIndex ) {
						word = word.replace( b3Regex2, "" );
					}
				}
			}
		}
	}

	return word;
};
/**
 * Removes residual suffixes.
 *
 * @param {string}  word                            The word for which to remove residual suffixes.
 * @param {number}  rvIndex                         The start index of RV.
 * @param {number}  r2Index                         The start index of R2.
 *
 * @returns {string}                                The word after residual suffixes were removed.
 */
const removeResidualSuffixes = function( word, rvIndex, r2Index ) {
	if ( word.search( /([^aiouès])s$/ ) >= rvIndex ) {
		word = word.replace( /([^aiouès])s$/, "$1" );
	}

	const e1Index = word.search( /ion$/ );

	if ( e1Index >= r2Index && word.search( /[st]ion$/ ) >= rvIndex ) {
		word = word.substring( 0, e1Index );
	} else {
		const e2Index = word.search( /(ier|ière|Ier|Ière)$/ );

		if ( e2Index !== -1 && e2Index >= rvIndex ) {
			word = word.substring( 0, e2Index ) + "i";
		} else {
			if ( word.search( /e$/ ) >= rvIndex ) {
				// Delete last e.
				word = word.replace( /e$/, "" );
			} else if ( word.search( /guë$/ ) >= rvIndex ) {
				word = word.replace( /guë$/, "gu" );
			}
		}
	}

	return word;
};
/**
 * Stems French words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The French morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	word = word.toLowerCase();
	const originalWord = word;

	// Pre-processing steps
	word = word.replace( /qu/g, "qU" );
	word = word.replace( /([aeiouyâàëéêèïîôûù])u([aeiouyâàëéêèïîôûù])/g, "$1U$2" );
	word = word.replace( /([aeiouyâàëéêèïîôûù])i([aeiouyâàëéêèïîôûù])/g, "$1I$2" );
	word = word.replace( /([aeiouyâàëéêèïîôûù])y/g, "$1Y" );
	word = word.replace( /y([aeiouyâàëéêèïîôûù])/g, "Y$1" );

	// Determine R1, R2 & RV regions.
	const [
		r1Index,
		r2Index,
		rvIndex,
	] = determineRs( word );

	/*
	 * Step 1:
	 * Remove standard suffixes
	 */
	word = processStandardSuffixes( word, morphologyData, r1Index, r2Index, rvIndex );
	const wordAfterStep1 = word;

	/*
	 * Step 2a:
	 * Stem verb suffixes beginning with "i"
	 */
	word = removeVerbSuffixesStartingWithI( word, originalWord, rvIndex ).word;
	const step2aDone = removeVerbSuffixesStartingWithI( word, originalWord, rvIndex ).step2aDone;

	/*
	 * Step 2b:
	 * Stem other verb suffixes
	 */
	word = removeOtherVerbSuffixes( word, step2aDone, wordAfterStep1, r2Index, rvIndex );

	if ( originalWord === word.toLowerCase() ) {
		/* Step 4:
		 * Stem residual suffixes.
		 */
		word = removeResidualSuffixes( word, rvIndex, r2Index );
	} else {
		/*
		 * Step 3 (only needs to be executed if step 4 isn't executed)
		 * Replace final Y with i or final ç with c.
		 */
		if ( word.search( /Y$/ ) !== -1 ) {
			word = word.replace( /Y$/, "i" );
		} else if ( word.search( /ç$/ ) !== -1 ) {
			word = word.replace( /ç$/, "c" );
		}
	}

	/* Step 5:
	 * Undouble final consonants
	 */
	word = word.replace( /(en|on)(n)$/, "$1" );
	word = word.replace( /(ett)$/, "et" );
	word = word.replace( /(el|eil)(l)$/, "$1" );

	/* Step 6:
	 * Un-accent
	 */
	word = word.replace( /[éè]([^aeiouyâàëéêèïîôûù]+)$/, "e$1" );
	word = word.toLowerCase();

	return word;
}
