import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Norwegian redundant openings come in three grammatical shapes, kept as word lists so the config encodes
 * exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, the noun, and a connector introducing what it depicts — "Bilde av" (image
 *   of), "et bilde som forestiller" (an image that depicts), "bilde som viser" (image that shows);
 * - the definite noun (with an optional demonstrative) and a finite verb — "Bildet viser" (the image shows),
 *   "dette bildet forestiller" (this image depicts). Both Bokmål spellings "framstiller" and "fremstiller"
 *   (portrays) are reviewed;
 * - a prepositional opening placing what is shown in the image — "På bildet ser vi" (in the image we see),
 *   "på bildet er det" (in the image there is).
 */
// "Image" and the definite "the image".
const noun = "bilde";
const definiteNoun = "bildet";
// A following "seg" blocks "viser": "bildet viser seg å være falskt" means "turns out", not "shows".
const shows = "viser(?!\\s+seg)";
const connectors = [ "av", "som\\s+forestiller", `som\\s+${ shows }` ];
// "Depicts", "portrays" in both Bokmål spellings, "shows".
const finiteVerbs = [ "forestiller", "framstiller", "fremstiller", shows ];
// "We see", "one sees", "there is".
const prepositionalVerbs = [ "ser vi", "ser man", "er det" ];

// Matches e.g. "et bilde som viser": an optional "et", "bilde", and a connector.
const connectorShape = `(?:et\\s+)?${ noun }\\s+(?:${ connectors.join( "|" ) })`;
// Matches e.g. "dette bildet viser": an optional "dette", the definite "bildet", and a finite verb.
const finiteVerbShape = `(?:dette\\s+)?${ definiteNoun }\\s+(?:${ finiteVerbs.join( "|" ) })`;
// Matches e.g. "på bildet ser vi": "på bildet" and a prepositional verb.
const prepositionalShape = `på\\s+${ definiteNoun }\\s+(?:${ createAlternation( prepositionalVerbs ) })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on `wordEnd` so "bildet" does not match "bildetekst". The guard is `wordEnd`
 * rather than `\b`, so every language's pattern treats non-ASCII letters the same way.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
