import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Spanish redundant openings come in three grammatical shapes, kept as separate word lists so the config
 * encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Imagen de" (image of), "Una foto que muestra" (a photo that shows), "imagen en la que se ve"
 *   (image in which one sees);
 * - a definite determiner, the noun, and a finite verb — "La imagen representa" (the image represents),
 *   "Esta foto muestra" (this photo shows);
 * - a prepositional opening placing what is shown in the image — "En la imagen se ve" (in the image one sees),
 *   "En la foto aparece" (in the photo appears).
 * The pattern is built below.
 */
/*
 * A verb is listed in singular and plural only where it agrees with what the image depicts ("en la que se ven
 * los niños" — in which the children are seen). A verb that agrees with the image itself stays singular, because
 * the nouns are singular: "la imagen muestran" or "una foto que representan" would be ungrammatical.
 */
const indefiniteArticles = [ "una" ];
const definiteDeterminers = [ "la", "esta" ];
// "Image", "photo".
const nouns = [ "imagen", "foto" ];
// "Of", "of the", "that represents/represent", "that shows/show", "showing", "representing",
// "in which is/are seen", "in which appears/appear", "where is/are seen".
const connectors = [
	"de", "del", "que representa", "que muestra", "mostrando", "representando",
	"en la que se ve", "en la que se ven", "en la que aparece", "en la que aparecen", "donde se ve", "donde se ven",
];
// "Represents", "shows".
const finiteVerbs = [ "representa", "muestra" ];
// "Is/are seen", "appears/appear", "is/are observed".
const prepositionalVerbs = [ "se ve", "se ven", "aparece", "aparecen", "se observa", "se observan" ];

/*
 * Lexicalized compounds that name a kind of image rather than describe what it depicts: in "foto de perfil"
 * (profile photo) or "imagen de marca" (brand image) the "de" is part of the term, and removing the opening
 * would break it. An opening that continues with one of these is not flagged.
 */
const exceptions = {
	foto: [ "de perfil", "de portada", "de archivo", "de fondo", "de satélite" ],
	imagen: [ "de perfil", "de portada", "de fondo", "de marca", "de archivo", "de satélite" ],
};

/**
 * Turns a noun into its regex alternative for the connector shape: the noun, whitespace, and a negative
 * lookahead that blocks the match when the noun's excepted compounds follow.
 *
 * @param {string} noun The noun to build the alternative for.
 *
 * @returns {string} The alternative.
 */
const addExceptionsGuard = ( noun ) => `${ noun }\\s+(?!(?:${ createAlternation( exceptions[ noun ] ) })${ wordEnd })`;

const nounAlternation = createAlternation( nouns );
// Matches e.g. "una imagen de": an optional "una", the noun — unless an excepted compound follows — and a connector.
const connectorShape =
	`(?:(?:${ createAlternation( indefiniteArticles ) })\\s+)?(?:${ nouns.map( addExceptionsGuard ).join( "|" ) })(?:${ createAlternation( connectors ) })`;
// Matches e.g. "esta foto muestra": a definite determiner, the noun, and a finite verb.
const finiteVerbShape = `(?:${ createAlternation( definiteDeterminers ) })\\s+(?:${ nounAlternation })\\s+(?:${ createAlternation( finiteVerbs ) })`;
// Matches e.g. "en la imagen se ve": "en la", the noun, and one of the prepositional verbs.
const prepositionalShape = `en\\s+la\\s+(?:${ nounAlternation })\\s+(?:${ createAlternation( prepositionalVerbs ) })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on a word boundary so "En la imagen se ve" does not match "En la imagen se venden".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })\\b`, "iu" );
