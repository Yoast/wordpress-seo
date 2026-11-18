import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Farsi redundant openings come in five grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, with an optional "یک" before it, followed by a space and a
 *   word — Farsi introduces what the image depicts with an unwritten ezafe ("تصویر یک سگ" — image of a dog), so
 *   an alt text simply starting with the noun is the redundant opening, while a number or punctuation after it
 *   is a figure label or a clause break;
 * - the indefinite noun and  "از" — "تصویری از" (an image of), "عکسی از" (a photo of);
 * - the indefinite noun and a relative clause — "تصویری که نشان می‌دهد" (an image that shows),
 *   "عکسی که … نشان می‌دهد" (a photo that shows …);
 * - the noun (with an optional demonstrative), the object and its marker "را", and the verb —
 *   "این تصویر … را نشان می‌دهد" (this image shows …; literally "this image … OBJECT shows", Farsi being
 *   verb-final), "عکس … را نشان می‌دهد" (the photo shows …), plus the bare "تصویر نشان می‌دهد" (the image
 *   shows);
 * - a prepositional opening placing what is shown in the image — "در (این) تصویر … دیده می‌شود"
 *   (in (this) image … is seen).
 * Farsi is verb-final, so the phrases marked with "…" contain a gap: any run of words without a comma
 * (the Latin and the Persian one) or a question mark, including none. The research tests the pattern against
 * the first sentence of the alt text only.
 * The compound verbs are matched with the ZWNJ, a space, or nothing between "می" and the stem ("می‌دهد",
 * "می دهد", "میدهد"), because alt text uses all three spellings. The Persian "ی" and "ک" also match their
 * Arabic lookalikes "ي" and "ك", which Arabic-layout keyboards produce.
 */

/**
 * Makes a word match both the Persian and the Arabic spelling of "ی" and "ک".
 *
 * @param {string} word The word, in Persian spelling.
 *
 * @returns {string} The pattern for the word.
 */
const tolerateArabicLookalikes = ( word ) => word.replace( /ی/g, "[یي]" ).replace( /ک/g, "[کك]" );

// The joiner inside a compound verb: a ZWNJ, whitespace, or nothing.
const joiner = "(?:\\u200C|\\s+)?";
// "Shows" and "is seen".
const shows = `${ tolerateArabicLookalikes( "نشان" ) }\\s+${ tolerateArabicLookalikes( "می" ) }${ joiner }دهد`;
const isSeen = `${ tolerateArabicLookalikes( "دیده" ) }\\s+${ tolerateArabicLookalikes( "می" ) }${ joiner }شود`;

// "Image", "photo", "an image", "a photo" and the demonstrative "this".
const image = tolerateArabicLookalikes( "تصویر" );
const photo = tolerateArabicLookalikes( "عکس" );
const indefiniteImage = tolerateArabicLookalikes( "تصویری" );
const indefinitePhoto = tolerateArabicLookalikes( "عکسی" );
const demonstrative = tolerateArabicLookalikes( "این" );
// The indefinite "a"/"one" before the bare noun, and the relative "that".
const indefiniteArticle = tolerateArabicLookalikes( "یک" );
const relativePronoun = tolerateArabicLookalikes( "که" );

const gap = "(?:[^,،؟]*\\s+)?";

/*
 * Ezafe compounds that name a kind of image rather than describe what it depicts: in "عکس پروفایل" (profile
 * picture), "عکس پرسنلی" (ID photo), "تصویر پس‌زمینه" (background image) or "تصویر شاخص" (the Persian WordPress
 * term for the featured image) the opening names the image type, so removing it would be wrong advice.
 */
const kindExceptions = [ "پروفایل", "پرسنلی", "پس‌زمینه", "شاخص" ];

/**
 * Turns the excepted compounds into a regex alternation: Arabic lookalikes are tolerated, and a ZWNJ inside a
 * compound also matches a space or nothing, mirroring how the compound verbs are matched.
 *
 * @param {string[]} words The excepted compounds.
 *
 * @returns {string} The alternation.
 */
const createExceptionAlternation = ( words ) =>
	words.map( ( word ) => tolerateArabicLookalikes( word ).replace( /\u200C/g, joiner ) ).join( "|" );

// The following word is a lookahead, so the pattern's end guard still sits right after the noun.
// Matches e.g. "تصویر یک سگ": an optional "یک", a noun followed by a word, unless that word is an excepted compound.
const bareNounShape =
	`(?:${ indefiniteArticle }\\s+)?(?:${ image }|${ photo })` +
	`(?=\\s+${ letter })(?!\\s+(?:${ createExceptionAlternation( kindExceptions ) })${ wordEnd })`;
// Matches e.g. "تصویری از": an indefinite noun and "از".
const indefiniteShape = `(?:${ indefiniteImage }|${ indefinitePhoto })\\s+از`;
// Matches e.g. "عکسی که … نشان می‌دهد": an indefinite noun, "که", the gap, and "shows".
const relativeClauseShape =
	`(?:${ indefiniteImage }|${ indefinitePhoto })\\s+${ relativePronoun }\\s+${ gap }${ shows }`;
// Matches e.g. "این تصویر … را نشان می‌دهد": an optional "این", a noun, the gap, "را" and "shows" — or bare "تصویر" with "shows".
const finiteVerbShape =
	`(?:(?:${ demonstrative }\\s+)?(?:${ image }|${ photo })\\s+${ gap }را\\s+${ shows }` +
	`|${ image }\\s+${ shows })`;
// Matches e.g. "در این عکس … دیده می‌شود": "در", an optional "این", a noun, the gap, and "is seen".
const prepositionalShape = `در\\s+(?:${ demonstrative }\\s+)?(?:${ image }|${ photo })\\s+${ gap }${ isSeen }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start and ending
 * before a non-letter, so the plural "عکس‌ها" is not matched.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp(
	`^(?:${ bareNounShape }|${ indefiniteShape }|${ relativeClauseShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`,
	"iu"
);
