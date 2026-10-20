import createAlternation from "../../../helpers/regex/createAlternation";
import { atMostFiveLetters } from "../../../helpers/regex/wordBoundaries";

/*
 * The English non-descriptive alt texts come in three shapes. The research strips a trailing number before testing,
 * so every shape also matches with a number after it, e.g. "image 1", "image1" or "image (1)":
 * - an optional article, an optional modifier and a noun calling the element an image — "Image", "The main photo",
 *   "A product picture";
 * - a placeholder or a default text — "Untitled", "N/A", "Alt text", "No image available";
 * - a screenshot name, followed by at most five letters — "Screenshot 2026-03-14 at 10.32.45",
 *   "Screen Shot 2026-03-14 at 10.32.45 AM", "Screenshot_20260314_103245". A number has to follow, so "Screenshot
 *   of the app" is not matched.
 */
const articles = [ "a", "an", "the" ];
const modifiers = [ "product", "gallery", "featured", "hero", "main", "background", "header" ];
const nouns = [ "picture", "photo", "image", "img", "pic", "screenshot" ];
const screenshotNames = [ "screenshot", "screen shot" ];
const placeholders = [
	// Default names that plugins and tools give to a file.
	"untitled", "untitled design", "unnamed", "file", "download",
	// Placeholder residue.
	"placeholder", "default", "none", "n/a", "na", "null", "undefined", "todo", "alt", "alt text", "add alt text",
	"alternative text", "description", "image description", "insert description here",
	// Ecommerce defaults.
	"product", "no image", "no image available", "image not found", "coming soon", "thumbnail",
	// Layout and structural defaults.
	"banner", "header", "hero", "background", "avatar", "profile picture", "slide", "divider", "line", "shape",
	// Logos without the name of the brand.
	"logo", "company logo", "site logo", "brand logo", "our logo",
];

// Matches e.g. "the main photo": an optional article, whitespace, an optional modifier, whitespace, and a noun.
const imageShape =
	`(?:(?:${ createAlternation( articles ) })\\s+)?(?:(?:${ createAlternation( modifiers ) })\\s+)?(?:${ createAlternation( nouns ) })`;
// Matches e.g. "screenshot 2026-03-14 at 10.32.45": a screenshot name, then at most five letters, with a number after the name.
const screenshotShape = `(?:${ createAlternation( screenshotNames ) })(?=.*\\p{N})${ atMostFiveLetters }`;

/**
 * The pattern the `nonDescriptiveAltText` research tests alt texts against: it matches the whole alt text and is
 * case-insensitive. See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ imageShape }|${ createAlternation( placeholders ) }|${ screenshotShape })$`, "iu" );
