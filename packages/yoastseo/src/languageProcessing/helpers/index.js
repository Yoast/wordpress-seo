import matchStringWithRegex from "./regex/matchStringWithRegex";
import createRegexFromArray from "./regex/createRegexFromArray";

import { filterShortcodesFromHTML } from "./sanitize/filterShortcodesFromTree";
import { mergeListItems } from "./sanitize/mergeListItems";
import { normalize, normalizeSingle } from "./sanitize/quotes";
import parseSynonyms from "./sanitize/parseSynonyms";
import removePunctuation from "./sanitize/removePunctuation";
import sanitizeString from "./sanitize/sanitizeString";
import { stripFullTags as stripHTMLTags, stripBlockTagsAtStartEnd } from "./sanitize/stripHTMLTags";
import stripSpaces from "./sanitize/stripSpaces";
import { unifyAllSpaces } from "./sanitize/unifyWhitespace";

import { getFieldsToMark } from "./html/getFieldsToMark";
import normalizeHTML from "./html/normalizeHTML";
import removeHtmlBlocks from "./html/htmlParser";

import areWordsInSentence from "./word/areWordsInSentence";
import { collectMarkingsInSentence, markWordsInSentences } from "./word/markWordsInSentences";
import countMetaDescriptionLength from "./word/countMetaDescriptionLength";
import getWords from "./word/getWords";
import indices from "./word/indices";

import directPrecedenceException from "./passiveVoice/periphrastic/directPrecedenceException";
import getClauses from "./passiveVoice/periphrastic/getClauses";
import getClausesSplitOnStopWords from "./passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/getClausesSplitOnStopWords";
import matchRegularParticiples from "./passiveVoice/periphrastic/matchRegularParticiples";
import nonDirectPrecedenceException from "./passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/nonDirectParticiplePrecedenceException";
import precedenceException from "./passiveVoice/periphrastic/precedenceException";

import getLanguage from "./language/getLanguage";
import getSentences from "./sentence/getSentences";

import { findWordFormsInString } from "./match/findKeywordFormsInString";

import baseStemmer from "./morphology/baseStemmer";
import buildFormRule from "./morphology/buildFormRule";
import createRulesFromArrays, { createSingleRuleFromArray } from "./morphology/createRulesFromArrays";
import findMatchingEndingInArray from "./morphology/findMatchingEndingInArray";
import flattenSortLength from "./morphology/flattenSortLength";
import * as regexHelpers from "./morphology/regexHelpers";
import * as exceptionListHelpers from "./morphology/exceptionListHelpers";
import * as stemHelpers from "./morphology/stemHelpers";

import replaceDiacritics from "./transliterate/replaceDiacritics";
import transliterate from "./transliterate/transliterate";

import imageInText from "./image/imageInText";

export {
	// HTML
	getFieldsToMark,
	normalizeHTML,
	removeHtmlBlocks,
	// Image
	imageInText,
	// Language
	getLanguage,
	// Match
	findWordFormsInString,
	// Morphology
	baseStemmer,
	buildFormRule,
	createRulesFromArrays,
	createSingleRuleFromArray,
	exceptionListHelpers,
	findMatchingEndingInArray,
	flattenSortLength,
	regexHelpers,
	stemHelpers,
	// Passive voice
	directPrecedenceException,
	getClauses,
	getClausesSplitOnStopWords,
	matchRegularParticiples,
	nonDirectPrecedenceException,
	precedenceException,
	// Regex
	createRegexFromArray,
	matchStringWithRegex,
	// Sanitize
	filterShortcodesFromHTML,
	mergeListItems,
	normalize,
	normalizeSingle,
	parseSynonyms,
	removePunctuation,
	sanitizeString,
	stripBlockTagsAtStartEnd,
	stripHTMLTags,
	stripSpaces,
	unifyAllSpaces,
	// Sentence
	getSentences,
	// Transliterate
	replaceDiacritics,
	transliterate,
	// Word
	areWordsInSentence,
	collectMarkingsInSentence,
	countMetaDescriptionLength,
	getWords,
	indices,
	markWordsInSentences,
};
