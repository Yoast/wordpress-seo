import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Italian redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Immagine di" (image of), "un'immagine che mostra" (an image that shows), "foto raffigurante"
 *   (photo depicting);
 * - a definite article or demonstrative, the noun, and a finite verb — "L'immagine rappresenta" (the image
 *   represents), "questa foto ritrae" (this photo portrays);
 * - a prepositional opening placing what is shown in the image — "Nell'immagine si vede" (in the image one
 *   sees), "nella foto è ritratto" (in the photo is portrayed).
 * All shapes apply to the nouns alike, with the forms of each noun's own article: "immagine" elides its articles
 * ("un'", "l'", "nell'") while "foto" and "fotografia" take "una"/"la"/"nella". In the prepositional shape the
 * verb agrees with what is shown: "si vede" or "si vedono", "è raffigurato" or "è raffigurata".
 * Both the typewriter (') and the typographic (’) apostrophe are matched, and an elided article attaches to the
 * next word without a space.
 */

const apostrophe = "['’]";
// "Of"/"of the" in its gendered and plural forms.
const simpleConnectors = [ "di", "del", "dello", "della", "dei", "degli", "delle" ];
// "Depicts", "shows", "portrays"; the finite verbs add "represents".
const relativeVerbs = [ "raffigura", "mostra", "ritrae" ];
const finiteVerbs = [ "rappresenta", "raffigura", "mostra", "ritrae" ];

// "Image"; "fotografia" shares all of "foto"'s forms, so it is an optional suffix on the shorter noun.
const image = "immagine";
const photo = "foto(?:grafia)?";

/*
 * Lexicalized compounds that name a kind of image rather than describe what it depicts: in "foto del profilo"
 * (profile photo) or "immagine di sfondo" (background image) the continuation is part of the term, and removing
 * the opening would break it. An opening that continues with one of these is not flagged. The "foto" exceptions
 * also apply to "fotografia". Adjective-style types ("foto aerea", "immagine satellitare", "foto tessera") need
 * no exception: the shapes require a connector right after the noun, which an adjective is not.
 */
const exceptions = {
	// "Of cover" (cover image), "of the profile" (profile image), "of background", "of repertoire" (stock).
	immagine: [ "di copertina", "del profilo", "di sfondo", "di repertorio" ],
	foto: [ "di copertina", "del profilo", "di sfondo", "di repertorio" ],
};

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

const connectors = [
	`\\s+(?:${ createAlternation( simpleConnectors ) }|dell${ apostrophe })`,
	`\\s+che\\s+(?:${ createAlternation( relativeVerbs ) })`,
	"\\s+raffigurante",
];
// "si vede"/"si vedono" and the participle agree with what is shown, so both numbers and genders are matched.
const seen = "(?:si\\s+ved(?:e|ono)|è\\s+(?:raffigurat|ritratt)[ao])";

// Matches e.g. "un'immagine che mostra": an optional article, the noun — unless an excepted compound follows — and a connector.
const connectorShape =
	`(?:${ addExceptionsGuard( `(?:un${ apostrophe })?${ image }`, exceptions.immagine ) }` +
	`|${ addExceptionsGuard( `(?:una\\s+)?${ photo }`, exceptions.foto ) })(?:${ connectors.join( "|" ) })`;
// Matches e.g. "l'immagine rappresenta": the noun with its article or demonstrative, and a finite verb.
const finiteVerbShape =
	`(?:l${ apostrophe }${ image }|questa\\s+${ image }|(?:la|questa)\\s+${ photo })\\s+(?:${ createAlternation( finiteVerbs ) })`;
// Matches e.g. "nell'immagine si vede": "nell'"/"nella" with its noun, and "si vede(no)" or the agreeing participle.
const prepositionalShape = `(?:nell${ apostrophe }${ image }|nella\\s+${ photo })\\s+${ seen }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on a word boundary so "La foto mostra" does not match "La foto mostrava".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })\\b`, "iu" );
