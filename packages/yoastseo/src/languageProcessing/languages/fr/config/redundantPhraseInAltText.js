import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The French redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Photo de" (photo of), "Une image représentant" (an image representing), "photo qui montre"
 *   (photo that shows);
 * - a definite determiner, the noun, and a finite verb — "L'image représente" (the image represents),
 *   "Cette photo montre" (this photo shows);
 * - an impersonal opening placing what is shown in the image — "Sur l'image, on voit" (in the image, one sees),
 *   "On voit sur la photo" (one sees in the photo).
 * Both the typewriter (') and the typographic (’) apostrophe are matched, and the elided "d'"/"l'" attaches
 * to the next word without a space.
 */
const apostrophe = "['’]";
const indefiniteArticles = [ "une" ];
const nouns = [ "photo", "image" ];
// "Of"/"of the" in its contracted forms, "representing", "showing", "that shows", "that represents", "containing".
const connectors = [ "de", "du", "des", "représentant", "montrant", "qui montre", "qui représente", "contenant" ];
// "Represents", "shows".
const finiteVerbs = [ "représente", "montre" ];

/*
 * Lexicalized compounds that name a kind of image rather than describe what it depicts: in "photo de profil"
 * (profile photo) or "image de marque" (brand image) the "de" is part of the term, and removing the opening
 * would break it. An opening that continues with one of these is not flagged.
 */
const exceptions = {
	photo: [ "de profil", "d'identité" ],
	image: [ "de marque", "de fond", "d'archives" ],
};

const nounAlternation = createAlternation( nouns );
// "l'" elides only before "image" and "la" only precedes "photo", so the articled nouns are spelled out.
const articledNouns = `(?:l${ apostrophe }image|la\\s+photo)`;

/**
 * Turns a noun into its regex alternative for the connector shape: the noun, whitespace, and a negative
 * lookahead that blocks the match when the noun's excepted compounds follow.
 *
 * @param {string} noun The noun to build the alternative for.
 *
 * @returns {string} The alternative.
 */
const addExceptionsGuard = ( noun ) => `${ noun }\\s+(?!(?:${ createAlternation( exceptions[ noun ] ).replace( /'/g, apostrophe ) })${ wordEnd })`;

// Matches e.g. "une photo de": an optional article, the noun — unless an excepted compound follows — and a connector.
// Each complete-word connector ends on `wordEnd`; the elided "d'" instead requires a letter right after the
// apostrophe, in any script — an ASCII `\b` would miss "d'élite".
const connectorShape =
	`(?:(?:${ createAlternation( indefiniteArticles ) })\\s+)?(?:${ nouns.map( addExceptionsGuard ).join( "|" ) })(?:(?:${ createAlternation( connectors ) })${ wordEnd }|d${ apostrophe }(?=\\p{L}))`;
// Matches e.g. "cette photo montre": the noun with its elided or plain article or "cette", and a finite verb.
const finiteVerbShape = `(?:${ articledNouns }|cette\\s+(?:${ nounAlternation }))\\s+(?:${ createAlternation( finiteVerbs ) })`;
// Matches "sur l'image(,) on voit" and "on voit sur la photo": the articled noun inside the impersonal "one sees".
const impersonalShape = `(?:sur\\s+${ articledNouns },?\\s+on\\s+voit|on\\s+voit\\s+sur\\s+${ articledNouns })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, with Unicode word guards and a following-letter check after elided connectors.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|(?:${ finiteVerbShape }|${ impersonalShape })${ wordEnd })`, "iu" );
