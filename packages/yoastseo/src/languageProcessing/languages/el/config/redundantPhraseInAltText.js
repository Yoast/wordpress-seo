import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Greek redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "εικόνα του" (image of the), "μια φωτογραφία των" (a photo of the), "μία εικόνα που δείχνει"
 *   (an image that shows), "φωτογραφία που απεικονίζει" (photo that depicts);
 * - a definite article (with an optional demonstrative), the noun, and a finite verb — "Η εικόνα απεικονίζει"
 *   (the image depicts), "αυτή η φωτογραφία δείχνει" (this photo shows);
 * - a prepositional opening placing what is shown in the image — "Στην εικόνα φαίνεται" (in the image appears),
 *   "στη φωτογραφία απεικονίζεται" (in the photo is depicted).
 * All forms apply to both nouns alike. "Φωτογραφία" additionally accepts "στην" next to "στη": the final "ν"
 * is standardly dropped before its "φ" but often written anyway, while "εικόνα" starts with a vowel and so only
 * occurs with "στην".
 */
// "A" in its two spellings.
const indefiniteArticles = [ "μια", "μία" ];
// "Image", "photo".
const nouns = [ "εικόνα", "φωτογραφία" ];
const [ image, photo ] = nouns;
// "Of the" in its masculine, feminine and plural forms, "of a" in its masculine and feminine forms.
const genitives = [ "του", "της", "των", "ενός", "μιας" ];
// "Depicts", "shows", "presents".
const finiteVerbs = [ "απεικονίζει", "δείχνει", "παρουσιάζει" ];
// "Appears", "appear", "is depicted".
const prepositionalVerbs = [ "φαίνεται", "φαίνονται", "απεικονίζεται" ];

const nounAlternation = createAlternation( nouns );
const relativeClause = `που\\s+(?:${ createAlternation( finiteVerbs ) })`;

/*
 * Openings that name an Orthodox icon as a product rather than describe the HTML image: in
 * "Εικόνα του Αγίου Νικολάου" (icon of Saint Nicholas) the "εικόνα" is the icon being sold, so removing the opening would be wrong
 * advice.
 */
// "Of Saint" in its masculine and feminine forms, "of the Virgin Mary".
const iconExceptions = [ "του Αγίου", "της Αγίας", "της Παναγίας" ];
const nounsWithExceptions =
	`(?:${ image }\\s+(?!(?:${ createAlternation( iconExceptions ) })${ wordEnd })|${ photo }\\s+)`;

// Matches e.g. "μια εικόνα του": an optional article, a noun — "εικόνα" refusing the icon compounds — and a genitive or "που" clause.
const connectorShape =
	`(?:(?:${ createAlternation( indefiniteArticles ) })\\s+)?${ nounsWithExceptions }` +
	`(?:${ createAlternation( genitives ) }|${ relativeClause })`;
// Matches e.g. "αυτή η εικόνα δείχνει": an optional "αυτή", the definite article "η", a noun, and a finite verb.
const finiteVerbShape = `(?:αυτή\\s+)?η\\s+(?:${ nounAlternation })\\s+(?:${ createAlternation( finiteVerbs ) })`;
// Matches e.g. "στην εικόνα φαίνεται": "στη(ν)" with its noun, and a prepositional verb.
const prepositionalShape =
	`(?:στην\\s+${ image }|στην?\\s+${ photo })\\s+(?:${ createAlternation( prepositionalVerbs ) })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending before a non-letter so "δείχνει" does not match "δείχνεις".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
