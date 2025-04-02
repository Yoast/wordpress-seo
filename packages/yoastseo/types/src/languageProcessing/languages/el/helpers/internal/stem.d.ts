/**
 * MIT License
 *
 * Copyright (c) 2015 apmats <amatsagkas@gmail.com>
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
 *
 * https://github.com/Apmats/greekstemmerjs
 */
/**
 * Matches word with an array of regexes and stems the word if there is any match. Further processes the stemmed word
 * if it matches one of the regexes in the second array by attaching an additional ending.
 *
 * @param {string}  word        The word to check.
 * @param {Array}   regexes1    The first array of regexes to check.
 * @param {Array}   regexes2    The second array of regexes to check.
 * @param {Array}   endings     The array of endings to attach to the stemmed word
 *                              if the previously stemmed word matches one of the regexes in the second array.
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWordWithRegexArray(word: string, regexes1: any[], regexes2: any[], endings: any[]): string;
/**
 * Matches word with a regex and stems the word if there is any match.
 *
 * @param {string}  word     The word to check.
 * @param {string}   regex    The regex to match.
 *
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWordWithOneRegex(word: string, regex: string): string;
/**
 * Matches word with a regex and stems the word if there is any match. Further processes the stemmed word
 * if it matches one of the two regexes in the second check by attaching an additional ending.
 *
 * @param {string}  word    The word to check.
 * @param {string}  regex1  The first regex to match.
 * @param {string}  regex2  The second regex to match.
 * @param {string}  regex3  The third regex to match.
 * @param {string}  ending  The ending to attach to the stemmed word
 *                          if the previously stemmed word matches one of the conditions in the second check.
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWord(word: string, regex1: string, regex2: string, regex3: string, ending: string): string;
/**
 * Stems Greek words
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Greek stemming.
 *
 * @returns {string} The stem of a Greek word.
 */
export default function stem(word: string, morphologyData: Object): string;
