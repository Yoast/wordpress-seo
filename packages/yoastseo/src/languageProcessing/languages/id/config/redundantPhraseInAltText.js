import createAlternation from "../../../helpers/regex/createAlternation";
import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Indonesian redundant openings come in two grammatical shapes, kept as word lists so the config encodes
 * exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and a word — Indonesian introduces what the
 *   image depicts by plain juxtaposition ("gambar seekor anjing" — image of a dog), so an alt text simply
 *   starting with the noun is the redundant opening, while a number or punctuation after it is a figure label
 *   or a clause break;
 * - a prepositional opening placing what is shown in the image, with an optional demonstrative —
 *   "Pada gambar terlihat" (in the image is visible), "dalam foto ini terlihat" (in this photo is visible).
 */
// "Image", "photo"; both prepositions mean "in".
const nouns = [ "gambar", "foto" ];
const prepositions = [ "pada", "dalam" ];
// "Is visible".
const prepositionalVerb = "terlihat";

/*
 * Compounds that name a kind of image rather than describe what it depicts: in "foto profil" (profile photo),
 * "gambar latar" (background image, also "gambar latar belakang"), "gambar unggulan" (the Indonesian WordPress
 * term for the featured image), "foto sampul" (cover photo), "foto arsip" (archive photo), "foto stok" (stock
 * photo) or "foto udara" (aerial photo) the opening names the image type, so removing it would be wrong advice.
 */
const exceptions = {
	gambar: [ "latar", "profil", "sampul", "unggulan", "stok" ],
	foto: [ "profil", "sampul", "udara", "arsip", "stok" ],
};

const nounAlternation = createAlternation( nouns );

/**
 * Turns a noun into its regex alternative for the bare-noun shape: the noun, a lookahead requiring a following
 * word, and a negative lookahead that blocks the match when the noun's excepted compounds follow. Both are
 * lookaheads, so the pattern's final word boundary still sits right after the noun.
 *
 * @param {string} noun The noun to build the alternative for.
 *
 * @returns {string} The alternative.
 */
const addExceptionsGuard = ( noun ) =>
	`${ noun }(?=\\s+${ letter })(?!\\s+(?:${ createAlternation( exceptions[ noun ] ) })${ wordEnd })`;

// Matches e.g. "gambar seekor anjing": a bare noun followed by a word, unless that word is an excepted compound.
const bareNounShape = `(?:${ nouns.map( addExceptionsGuard ).join( "|" ) })`;
// Matches e.g. "pada gambar ini terlihat": a preposition, a noun, an optional "ini", and "terlihat".
const prepositionalShape =
	`(?:${ createAlternation( prepositions ) })\\s+(?:${ nounAlternation })\\s+(?:ini\\s+)?${ prepositionalVerb }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on `wordEnd` so "gambar" does not match "gambaran". The guard is `wordEnd`
 * rather than `\b`, so every language's pattern treats non-ASCII letters the same way.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ bareNounShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
