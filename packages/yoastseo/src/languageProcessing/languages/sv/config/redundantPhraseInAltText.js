import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Swedish redundant openings come in three grammatical shapes, kept as word lists so the config encodes
 * exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, the noun, and a connector introducing what it depicts — "Bild på" (image
 *   of), "en bild av" (an image of), "bild som föreställer" (image that depicts), "en bild som visar" (an image
 *   that shows);
 * - the definite noun or a demonstrative form, and a finite verb — "Bilden visar" (the image shows),
 *   "den här bilden föreställer" (this image depicts), "denna bild visar" (this image shows);
 * - a prepositional opening placing what is shown in the image — "På bilden syns" (in the image is visible),
 *   "på bilden ser vi" (in the image we see), "på bilden ser man" (in the image one sees).
 */
// "Image" and the definite "the image".
const noun = "bild";
const definiteNoun = "bilden";
// A following "sig" blocks "visar": "bilden visar sig vara falsk" means "turns out", not "shows".
const shows = "visar(?!\\s+sig)";
const connectors = [ "på", "av", "som\\s+föreställer", `som\\s+${ shows }` ];
// "Depicts", "shows".
const finiteVerbs = [ "föreställer", shows ];
// "Is visible", "we see", "one sees".
const prepositionalVerbs = [ "syns", "ser vi", "ser man" ];

// Matches e.g. "en bild som visar": an optional "en", "bild", and a connector.
const connectorShape = `(?:en\\s+)?${ noun }\\s+(?:${ connectors.join( "|" ) })`;
// Matches e.g. "denna bild visar": the definite "bilden", "den här bilden" or "denna bild", and a finite verb.
const finiteVerbShape = `(?:${ definiteNoun }|den\\s+här\\s+${ definiteNoun }|denna\\s+${ noun })\\s+(?:${ finiteVerbs.join( "|" ) })`;
// Matches e.g. "på bilden syns": "på bilden" and a prepositional verb.
const prepositionalShape = `på\\s+${ definiteNoun }\\s+(?:${ createAlternation( prepositionalVerbs ) })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending before a non-letter so "visar" does not match "visare".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
