import createAlternation from "../../../helpers/regex/createAlternation";
import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Czech redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and a word — Czech has no articles and
 *   introduces what the image depicts with a genitive that no connector word marks ("Obrázek psa" — picture of
 *   a dog). The noun alone is not enough: a number or punctuation after it is a figure label ("Obrázek 1:
 *   schéma" — picture 1: diagram) or a clause break ("Obrázek, který…" — a picture that …), not a redundant
 *   opening. A genitive compound naming a kind of image is excepted: in "fotka profilu" (profile photo),
 *   "obrázek pozadí" or "obrázek na pozadí" (background image) and "obrázek záhlaví" (header image) the opening
 *   names the image type, so removing it would be wrong advice. Czech names most image types with an adjective
 *   before the noun ("profilová fotka", "náhledový obrázek", "letecký snímek"), which the noun-first pattern
 *   never matches, so only these genitive forms need an exception.
 * - a demonstrative, the noun, and a finite verb — "Tento obrázek zobrazuje" (this picture depicts),
 *   "tato fotka ukazuje" (this photo shows);
 * - a prepositional opening placing what is shown in the image, with an optional demonstrative —
 *   "Na obrázku je" (in the picture there is), "na tomto obraze vidíme" (in this image we see),
 *   "na této fotce je vidět" (in this photo one can see).
 *
 * The forms are grouped per noun: the masculine "obrázek"/"obraz" take "tento"/"tomto", the feminine
 * "fotka"/"fotografie" take "tato"/"této" and the extra "je vidět"; the finite verbs are shared.
 */
// "Picture", "image".
const masculineNouns = [ "obrázek", "obraz" ];
// "Photo", "photograph".
const feminineNouns = [ "fotka", "fotografie" ];
// The locative forms that follow "na" ("on").
const masculineLocatives = [ "obrázku", "obraze" ];
const feminineLocatives = [ "fotce", "fotografii" ];
// "Depicts", "shows", "illustrates".
const finiteVerbs = [ "zobrazuje", "ukazuje", "znázorňuje" ];
// "Is", "are", "we see".
const prepositionalVerbs = [ "je", "jsou", "vidíme" ];
// "One can see": only reviewed after the feminine locatives.
const canBeSeen = "je vidět";

/*
 * Following words after which the bare noun is not a redundant opening: "se" is reflexive and "není" the negated
 * "is", so a verb clause follows and the noun is the subject of a sentence about the image ("Obrázek se
 * nepodařilo načíst" — the image failed to load; "Obrázek není k dispozici" — the image is not available), and
 * "od" attributes the work to its maker rather than introducing what it depicts ("Obraz od Muchy" — an image
 * by Mucha).
 */
const exceptedFollowers = [ "se", "není", "od" ];
// "Of the profile", "of the background", "on the background", "of the header".
const kindExceptions = "(?:profilu|(?:na\\s+)?pozadí|záhlaví)";

// The following word is a lookahead, so the pattern's final word boundary still sits right after the noun.
// Matches e.g. "obrázek psa": a bare noun followed by a word, unless that word is "se", "není" or "od"
// or an excepted compound follows.
const bareNounShape =
	`(?:${ createAlternation( [ ...masculineNouns, ...feminineNouns ] ) })` +
	`(?=\\s+${ letter })(?!\\s+(?:${ createAlternation( exceptedFollowers ) })(?!${ letter }))` +
	`(?!\\s+${ kindExceptions }${ wordEnd })`;
// Matches e.g. "tento obrázek zobrazuje": the gender-matched demonstrative, a noun, and one of its finite verbs.
const finiteVerbShape =
	`(?:tento\\s+(?:${ createAlternation( masculineNouns ) })|tato\\s+(?:${ createAlternation( feminineNouns ) }))` +
	`\\s+(?:${ createAlternation( finiteVerbs ) })`;
// Matches e.g. "na tomto obrázku je": "na", an optional demonstrative, a locative noun, and a prepositional verb.
const prepositionalShape =
	`na\\s+(?:(?:tomto\\s+)?(?:${ createAlternation( masculineLocatives ) })\\s+(?:${ createAlternation( prepositionalVerbs ) })` +
	`|(?:této\\s+)?(?:${ createAlternation( feminineLocatives ) })\\s+(?:${ createAlternation( [ ...prepositionalVerbs, canBeSeen ] ) }))`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on a word boundary so "obraz" does not match "obrazec".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ bareNounShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
