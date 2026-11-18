import replaceDiacritics from "./helpers/transliterate/replaceDiacritics.js";
import transliterate from "./helpers/transliterate/transliterate.js";
import createRegexFromArray from "./helpers/regex/createRegexFromArray.js";
import imageInText from "./helpers/image/imageInText.js";
import stripSpaces from "./helpers/sanitize/stripSpaces.js";
import baseStemmer from "./helpers/morphology/baseStemmer.js";
import getWords from "./helpers/word/getWords.js";
import AbstractResearcher from "./AbstractResearcher.js";
import flattenSortLength from "./helpers/morphology/flattenSortLength.js";
import indices from "./helpers/word/indices.js";
import buildFormRule from "./helpers/morphology/buildFormRule.js";
import createRulesFromArrays, { createSingleRuleFromArray } from "./helpers/morphology/createRulesFromArrays.js";
import matchRegularParticiples from "./helpers/passiveVoice/periphrastic/matchRegularParticiples.js";
import directPrecedenceException from "./helpers/passiveVoice/periphrastic/directPrecedenceException.js";
import precedenceException from "./helpers/passiveVoice/periphrastic/precedenceException.js";
import nonDirectPrecedenceException from "./helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/nonDirectParticiplePrecedenceException.js";
import findMatchingEndingInArray from "./helpers/morphology/findMatchingEndingInArray.js";
import * as regexHelpers from "./helpers/morphology/regexHelpers.js";
import * as exceptionListHelpers from "./helpers/morphology/exceptionListHelpers.js";
import * as stemHelpers from "./helpers/morphology/stemHelpers.js";
import * as values from "./values/index.js";
import areWordsInSentence from "./helpers/word/areWordsInSentence.js";
import getClauses from "./helpers/passiveVoice/periphrastic/getClauses.js";
import getClausesSplitOnStopWords from "./helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/getClausesSplitOnStopWords.js";
import { stripFullTags as stripHTMLTags, stripBlockTagsAtStartEnd } from "./helpers/sanitize/stripHTMLTags.js";
import sanitizeString from "./helpers/sanitize/sanitizeString.js";
import { unifyAllSpaces } from "./helpers/sanitize/unifyWhitespace.js";
import removePunctuation from "./helpers/sanitize/removePunctuation.js";
import normalizeHTML from "./helpers/html/normalizeHTML.js";
import countMetaDescriptionLength from "./helpers/word/countMetaDescriptionLength.js";
import getLanguage from "./helpers/language/getLanguage.js";
import getSentences from "./helpers/sentence/getSentences.js";
import { getFieldsToMark } from "./helpers/html/getFieldsToMark.js";
import { normalizeSingle } from "./helpers/sanitize/quotes.js";
import parseSynonyms from "./helpers/sanitize/parseSynonyms.js";
import { mergeListItems } from "./helpers/sanitize/mergeListItems.js";
import { findWordFormsInString } from "./helpers/match/findKeywordFormsInString.js";
import { collectMarkingsInSentence, markWordsInSentences } from "./helpers/word/markWordsInSentences.js";
import * as helpers from "./helpers/index.js";
import * as researches from "./researches/index.js";

export {
	AbstractResearcher,
	transliterate,
	replaceDiacritics,
	createRegexFromArray,
	imageInText,
	stripSpaces,
	baseStemmer,
	getWords,
	flattenSortLength,
	indices,
	buildFormRule,
	createRulesFromArrays,
	createSingleRuleFromArray,
	matchRegularParticiples,
	directPrecedenceException,
	precedenceException,
	nonDirectPrecedenceException,
	findMatchingEndingInArray,
	regexHelpers,
	exceptionListHelpers,
	stemHelpers,
	areWordsInSentence,
	values,
	getClauses,
	getClausesSplitOnStopWords,
	stripHTMLTags,
	stripBlockTagsAtStartEnd,
	countMetaDescriptionLength,
	sanitizeString,
	removePunctuation,
	getLanguage,
	getSentences,
	getFieldsToMark,
	unifyAllSpaces,
	normalizeHTML,
	collectMarkingsInSentence,
	normalizeSingle,
	parseSynonyms,
	mergeListItems,
	findWordFormsInString,
	markWordsInSentences,
	helpers,
	researches,
};
