import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Portuguese redundant openings come in three grammatical shapes, kept as word lists and small patterns so
 * the config encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Imagem de" (image of), "uma foto que mostra" (a photo that shows), "imagem retratando"
 *   (image portraying);
 * - a definite article or demonstrative, the noun, and a finite verb — "A imagem representa" (the image
 *   represents), "esta foto mostra" (this photo shows), "essa imagem retrata" (that image portrays);
 * - a prepositional opening and a comma, with whatever is shown following — "Na imagem, …" (in the image, …),
 *   "nesta foto, …" (in this photo, …). The comma is the shape's only gate, so it is required.
 * All shapes apply to the nouns alike, and "fotografia" shares all of "foto"'s forms, so it is an optional
 * suffix on the shorter noun. The prepositional shape ends on its comma, which `\b` cannot see, so only the
 * other shapes end on a word boundary.
 */
// "Of"/"of the" in its gendered and plural forms.
const simpleConnectors = createAlternation( [ "de", "do", "da", "dos", "das" ] );
// "Represents", "portrays", "shows"; the connectors add the "that …" and "-ing" forms of the same verbs.
const finiteVerbs = "(?:representa|retrata|mostra)";
const connectors =
	`(?:${ simpleConnectors }|que\\s+(?:mostra|representa|retrata)|mostrando|representando|retratando)`;

// "fotografia" shares all of "foto"'s forms, so it is an optional suffix on the shorter noun.
const photo = "foto(?:grafia)?";
// "Image" and the photo nouns, as every shape matches them.
const nouns = `(?:imagem|${ photo })`;

/*
 * Lexicalized compounds that name a kind of image rather than describe what it depicts: in "foto de perfil"
 * (profile photo) or "imagem de fundo" (background image) the "de" is part of the term, and removing the
 * opening would break it. An opening that continues with one of these is not flagged. All the nouns share the
 * one list: "of profile", "of cover", "of background", "of archive".
 */
const exceptions = [ "de perfil", "de capa", "de fundo", "de arquivo" ];

/**
 * Appends to an articled noun a negative lookahead that blocks the match when its excepted compounds follow.
 *
 * @param {string} articledNoun The pattern of the noun with its optional article.
 * @param {string[]} compounds The noun's excepted compounds.
 *
 * @returns {string} The pattern.
 */
const addExceptionsGuard = ( articledNoun, compounds ) =>
	`${ articledNoun }(?!\\s+(?:${ createAlternation( compounds ) })${ wordEnd })`;

// Matches e.g. "uma imagem de": an optional "uma", a noun — unless an excepted compound follows — and a connector.
const connectorShape =
	`${ addExceptionsGuard( `(?:uma\\s+)?${ nouns }`, exceptions ) }\\s+${ connectors }`;
// Matches e.g. "esta foto mostra": "a", "esta" or "essa", the noun, and a finite verb.
const finiteVerbShape = `(?:a|esta|essa)\\s+${ nouns }\\s+${ finiteVerbs }`;
// Matches e.g. "na imagem,": "na" or "nesta", the noun, and the required comma.
const prepositionalShape = `(?:na|nesta)\\s+${ nouns }\\s*,`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on a word boundary (or, for the prepositional shape, on its comma) so
 * "a foto mostra" does not match "a foto mostrava".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:(?:${ connectorShape }|${ finiteVerbShape })\\b|${ prepositionalShape })`, "iu" );
