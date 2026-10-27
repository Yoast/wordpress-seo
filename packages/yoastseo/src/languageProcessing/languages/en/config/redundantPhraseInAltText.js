import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The English redundant openings come in two grammatical shapes, kept as separate word lists so the config
 * encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Image of", "An image showing", "A picture which shows";
 * - a definite determiner, the noun, and a finite verb — "The image shows", "This picture depicts".
 * The pattern is built below.
 */
const indefiniteArticles = [ "a", "an" ];
const definiteDeterminers = [ "the", "this" ];
const nouns = [ "image", "picture" ];
const connectors = [ "of", "showing", "that shows", "which shows", "depicting", "that depicts", "which depicts",
	"portraying", "that portrays", "which portrays" ];
const finiteVerbs = [ "shows", "depicts", "portrays" ];

const nounAlternation = createAlternation( nouns );
// Matches e.g. "an image of": an optional article, whitespace, a noun, whitespace, and one of the connectors.
const connectorShape =
	`(?:(?:${ createAlternation( indefiniteArticles ) })\\s+)?(?:${ nounAlternation })\\s+(?:${ createAlternation( connectors ) })`;
// Matches e.g. "this picture shows": a definite determiner, whitespace, a noun, whitespace, and a finite verb.
const finiteVerbShape = `(?:${ createAlternation( definiteDeterminers ) })\\s+(?:${ nounAlternation })\\s+(?:${ createAlternation( finiteVerbs ) })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on `wordEnd` so "Image of" does not match "Image offering". The guard is `wordEnd`
 * rather than `\b`, so every language's pattern treats non-ASCII letters the same way.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape })${ wordEnd }`, "iu" );
