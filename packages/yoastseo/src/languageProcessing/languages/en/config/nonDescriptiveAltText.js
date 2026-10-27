import createAlternation from "../../../helpers/regex/createAlternation";

/*
 * The English non-descriptive alt texts come in three shapes. The research strips a trailing number before testing,
 * so every shape also matches with a number after it, e.g. "image 1", "image1" or "image (1)":
 * - an optional article, an optional modifier and a noun calling the element an image — "Image", "The main photo",
 *   "A product picture";
 * - an optional article and a word that is non-descriptive on its own — "Product", "The gallery". "Hero", "featured"
 *   and "main" are not in this list: they only count with a noun after them;
 * - a placeholder or a default text — "Untitled", "N/A", "Alt text", "No image available".
 *
 * Screenshot names such as "Screenshot 2026-03-14 at 10.32.45" are not here: the research checks them in every
 * language.
 */
const articles = [ "a", "an", "the" ];
const modifiers = [ "product", "gallery", "featured", "hero", "main", "background", "header" ];
const nouns = [ "picture", "photo", "image", "img", "pic", "screenshot" ];
const standaloneWords = [ "product", "gallery", "header", "background" ];
const placeholders = [
	// Default names that plugins and tools give to a file.
	"untitled", "untitled design", "unnamed", "file", "file name", "download",
	// Placeholder residue.
	"placeholder", "default", "none", "n/a", "na", "null", "undefined", "todo", "alt", "alt text", "add alt text",
	"alternative text", "description", "image description", "picture description", "insert description here",
	// Ecommerce defaults.
	"no image", "no image available", "image not found", "coming soon", "thumbnail",
	// A default for a person's picture.
	"profile picture",
];

/*
 * Words left out of the English phrases that are checked in other languages (see `inOtherLanguages`), because they
 * are ordinary words there: "file" (Dutch "traffic jam", French "queue"), "pic" (French "peak", "woodpecker"),
 * "alt" (German, Dutch, Norwegian and Swedish "old"), "null" (German "zero"), "to do" written as one word (Spanish,
 * Portuguese and Catalan "everything") and "na" (Polish, Czech, Slovak and Portuguese "on").
 */
const ordinaryWordsInOtherLanguages = [ "file", "pic", "alt", "null", "todo", "na" ];

/**
 * Builds the pattern from the word lists: it matches the whole alt text and is case-insensitive.
 *
 * @param {string[]} [excludedWords] Words to leave out of the lists.
 *
 * @returns {RegExp} The pattern.
 */
const buildPattern = ( excludedWords = [] ) => {
	const keep = ( words ) => words.filter( ( word ) => ! excludedWords.includes( word ) );

	// Matches e.g. "the main photo": an optional article, whitespace, an optional modifier, whitespace, and a noun.
	const imageShape =
		`(?:(?:${ createAlternation( articles ) })\\s+)?(?:(?:${ createAlternation( modifiers ) })\\s+)?(?:${ createAlternation( keep( nouns ) ) })`;
	// Matches e.g. "the gallery": an optional article, whitespace, and a word that is non-descriptive on its own.
	const standaloneShape = `(?:(?:${ createAlternation( articles ) })\\s+)?(?:${ createAlternation( standaloneWords ) })`;

	return new RegExp( `^(?:${ imageShape }|${ standaloneShape }|${ createAlternation( keep( placeholders ) ) })$`, "iu" );
};

/**
 * The English phrases that are also checked in every other supported language: many languages use English terms such
 * as "alt text" or "thumbnail", and many tools that name images by default are in English ("Untitled", "Download").
 * The words in `ordinaryWordsInOtherLanguages` are left out. Languages without a researcher of their own do not use
 * this: their words are unknown, so the risk of flagging a real word is too high.
 */
export const inOtherLanguages = buildPattern( ordinaryWordsInOtherLanguages );

/**
 * The pattern the `nonDescriptiveAltText` research tests English alt texts against. See the research for the contract
 * a language's pattern has to follow.
 */
export default buildPattern();
