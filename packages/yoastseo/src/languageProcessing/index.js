import replaceDiacritics from "./helpers/transliterate/replaceDiacritics";
import transliterate from "./helpers/transliterate/transliterate";
import createRegexFromArray from "./helpers/regex/createRegexFromArray";
import imageInText from "./helpers/image/imageInText";
import stripSpaces from "./helpers/sanitize/stripSpaces";
import baseStemmer from "./helpers/morphology/baseStemmer";
import getWords from "./helpers/word/getWords";
import AbstractResearcher from "./AbstractResearcher";
import flattenSortLength from "./helpers/morphology/flattenSortLength";
import indices from "./helpers/word/indices";
import buildFormRule from "./helpers/morphology/buildFormRule";
import createRulesFromArrays, { createSingleRuleFromArray } from "./helpers/morphology/createRulesFromArrays";
import matchRegularParticiples from "./helpers/passiveVoice/periphrastic/matchRegularParticiples";
import directPrecedenceException from "./helpers/passiveVoice/periphrastic/directPrecedenceException";
import precedenceException from "./helpers/passiveVoice/periphrastic/precedenceException";
import nonDirectPrecedenceException from "./helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/nonDirectParticiplePrecedenceException";
import findMatchingEndingInArray from "./helpers/morphology/findMatchingEndingInArray";
import * as regexHelpers from "./helpers/morphology/regexHelpers";
import * as exceptionListHelpers from "./helpers/morphology/exceptionListHelpers";
import * as stemHelpers from "./helpers/morphology/stemHelpers";
import * as values from "./values";
import areWordsInSentence from "./helpers/word/areWordsInSentence";
import getClauses from "./helpers/passiveVoice/periphrastic/getClauses";
import getClausesSplitOnStopWords from "./helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/getClausesSplitOnStopWords";
import { stripFullTags as stripHTMLTags, stripBlockTagsAtStartEnd } from "./helpers/sanitize/stripHTMLTags";
import sanitizeString from "./helpers/sanitize/sanitizeString";
import { unifyAllSpaces } from "./helpers/sanitize/unifyWhitespace";
import removePunctuation from "./helpers/sanitize/removePunctuation";
import normalizeHTML from "./helpers/html/normalizeHTML";
import countMetaDescriptionLength from "./helpers/word/countMetaDescriptionLength";
import getLanguage from "./helpers/language/getLanguage";
import getSentences from "./helpers/sentence/getSentences";
import { getFieldsToMark } from "./helpers/html/getFieldsToMark";
import { normalizeSingle } from "./helpers/sanitize/quotes";
import parseSynonyms from "./helpers/sanitize/parseSynonyms";
import { mergeListItems } from "./helpers/sanitize/mergeListItems";
import { findWordFormsInString } from "./helpers/match/findKeywordFormsInString";
import { collectMarkingsInSentence, markWordsInSentences } from "./helpers/word/markWordsInSentences";
import * as helpers from "./helpers";
import * as researches from "./researches";

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
