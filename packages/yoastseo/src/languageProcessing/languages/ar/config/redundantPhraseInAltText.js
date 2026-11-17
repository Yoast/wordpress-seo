import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Arabic redundant openings come in four grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and an Arabic word — Arabic introduces what
 *   the image depicts by plain juxtaposition (the idafa construction, "صورة كلب" — picture of a dog, literally
 *   "picture dog"), so an alt text simply starting with the noun is the redundant opening, while a number or punctuation
 *   after it is a figure label or a clause break;
 * - the definite noun (with an optional demonstrative) and a finite verb — "الصورة تمثل" (the picture
 *   represents), "هذه الصورة تظهر" (this picture shows);
 * - the finite verb before the definite noun, Arabic's verb-first order — "تظهر الصورة" (the picture shows;
 *   literally "shows the-picture"), "توضح الصورة" (the picture illustrates; literally "illustrates the-picture");
 * - an opening saying that something appears in the image — "يظهر في الصورة", "تظهر في الصورة" (in the picture
 *   appears - masculine and feminine).
 *
 *  Every word is matched with the diacritics optional between and after its letters.
 */
const optionalDiacritics = "[\\u0640\\u064B-\\u065F\\u0670]*";

/**
 * Makes a word match with or without vocalization: tatweel and diacritics may follow any of its letters.
 *
 * @param {string} word The word, written without diacritics.
 *
 * @returns {string} The pattern for the word.
 */
const tolerateDiacritics = ( word ) => word.split( "" ).join( optionalDiacritics ) + optionalDiacritics;

/**
 * Turns a list of undiacritized words or phrases into a regex alternation of their diacritic-tolerant patterns.
 * A space in a phrase matches any whitespace.
 *
 * @param {string[]} phrases The words or phrases to combine.
 *
 * @returns {string} The alternation.
 */
const createDiacriticsTolerantAlternation = ( phrases ) =>
	phrases.map( ( phrase ) => phrase.split( " " ).map( tolerateDiacritics ).join( "\\s+" ) ).join( "|" );

// "Represents", "depicts", "shows", "demonstrates", "illustrates".
const finiteVerbs = [ "تمثل", "تصور", "تظهر", "تبين", "توضح" ];
// "Appears", in the masculine and the feminine.
const appearVerbs = [ "يظهر", "تظهر" ];

// "Picture" and "the picture".
const noun = tolerateDiacritics( "صورة" );
const definiteNoun = tolerateDiacritics( "الصورة" );
// "This" and "in".
const demonstrative = tolerateDiacritics( "هذه" );
const inPreposition = tolerateDiacritics( "في" );

/*
 * Idafa compounds that name a kind of image rather than describe what it depicts: "صورة شخصية" (profile
 * picture), "صورة الغلاف" (cover photo), "صورة الملف الشخصي" (profile picture) or "صورة أشعة" (X-ray). The
 * opening names the image type, so removing it would be wrong advice.
 */
const kindExceptions = [ "شخصية", "الغلاف", "الملف الشخصي", "أشعة" ];

// The following word is a lookahead, so the pattern's end guard still sits right after the noun.
// Matches e.g. "صورة كلب": the bare noun followed by a word, unless that word is an excepted compound.
const bareNounShape =
	`${ noun }(?=\\s+${ letter })(?!\\s+(?:${ createDiacriticsTolerantAlternation( kindExceptions ) })${ wordEnd })`;
// Matches e.g. "هذه الصورة تمثل": an optional "هذه", the definite noun, and a finite verb.
const subjectVerbShape =
	`(?:${ demonstrative }\\s+)?${ definiteNoun }\\s+(?:${ createDiacriticsTolerantAlternation( finiteVerbs ) })`;
// Matches e.g. "تظهر الصورة": a finite verb first, then the definite noun.
const verbFirstShape = `(?:${ createDiacriticsTolerantAlternation( finiteVerbs ) })\\s+${ definiteNoun }`;
// Matches e.g. "يظهر في الصورة": an appear-verb, "في", and the definite noun.
const appearShape =
	`(?:${ createDiacriticsTolerantAlternation( appearVerbs ) })\\s+${ inPreposition }\\s+${ definiteNoun }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start and ending
 * before a non-letter, so a verb with an attached suffix ("تمثلنا") is not matched.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ bareNounShape }|${ subjectVerbShape }|${ verbFirstShape }|${ appearShape })${ wordEnd }`, "iu" );
