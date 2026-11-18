import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Slovak redundant openings come in five grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and a word — Slovak has no articles and
 *   introduces what the image depicts with a genitive that no connector word marks ("Obrázok psa" — picture of
 *   a dog), so an alt text simply starting with the noun is the redundant opening, while a number or punctuation
 *   after it is a figure label or a clause break. A following "sa", "nie" or "od" is excepted:
 *   "sa" is reflexive and "nie" a negation, so a sentence about the image follows ("Obrázok sa nepodarilo
 *   načítať" — the image failed to load; "Obrázok nie je dostupný" — the image is not available), and "od"
 *   attributes the work to its maker ("Obraz od Muchu" — an image by Mucha). A genitive compound naming
 *   a kind of image is excepted too: in "fotka profilu" (profile photo), "obrázok pozadia" or "obrázok na
 *   pozadí" (background image) and "obrázok záhlavia" or "obrázok hlavičky" (header image) the opening names
 *   the image type, so removing it would be wrong advice. Slovak names most image types with an adjective
 *   before the noun ("profilová fotka", "letecká snímka"), which the noun-first pattern never matches, so only
 *   these genitive forms need an exception;
 * - the noun and a depicting participle — "Obrázok zobrazujúci proces" (a picture depicting the process),
 *   "fotka ukazujúca tím" (a photo showing the team);
 * - the noun, a comma, and a relative clause — "Obrázok, ktorý zobrazuje psa" (a picture that depicts a dog),
 *   "fotka, na ktorej je pes" (a photo on which there is a dog);
 * - the noun with an optional demonstrative and a finite verb — "Tento obrázok zobrazuje" (this picture
 *   depicts), "táto fotka ukazuje" (this photo shows);
 * - a prepositional opening placing what is shown in the image, with an optional demonstrative —
 *   "Na obrázku je" (in the picture there is), "na tejto fotke je vidieť" (in this photo one can see).
 * The forms are grouped per noun: the masculine "obrázok"/"obraz" take "tento"/"tomto"/"ktorý", the feminine
 * "fotka" takes "táto"/"tejto"/"ktorá" and the "na ktorej je" clause; the participles agree in gender and the
 * finite verbs are shared.
 */

// "Picture", "image"; the feminine noun is "photo".
const masculineNouns = "(?:obrázok|obraz)";
const feminineNoun = "fotka";
// The locative forms that follow "na": "na obrázku", "na obraze", "na fotke".
const masculineLocatives = "(?:obrázku|obraze)";
const feminineLocative = "fotke";
// "Depicting", "illustrating", "showing", in both genders.
const masculineParticiples = "(?:zobrazujúci|znázorňujúci|ukazujúci)";
const feminineParticiples = "(?:zobrazujúca|znázorňujúca|ukazujúca)";
// "Depicts", "shows", "illustrates".
const finiteVerbs = "(?:zobrazuje|ukazuje|znázorňuje)";
// "Depicts", "shows": the subset reviewed inside the relative clauses.
const relativeClauseVerbs = "(?:zobrazuje|ukazuje)";
// "One can see", "is", "are", "we see".
const prepositionalVerbs = "(?:je\\s+vidieť|je|sú|vidíme)";

// "Of the profile", "of the background", "on the background", "of the header" (both header words).
const kindExceptions = "(?:profilu|pozadia|na\\s+pozadí|záhlavia|hlavičky)";

// The following word is a lookahead, so the pattern's end guard still sits right after the noun.
// Matches e.g. "obrázok psa": a bare noun followed by a word, unless that word is "sa", "nie" or "od"
// or an excepted compound follows.
const bareNounShape =
	`(?:${ masculineNouns }|${ feminineNoun })(?=\\s+${ letter })(?!\\s+(?:sa|nie|od)(?!${ letter }))` +
	`(?!\\s+${ kindExceptions }${ wordEnd })`;
// Matches e.g. "obrázok zobrazujúci": a noun and a gender-matched depicting participle.
const participleShape =
	`(?:${ masculineNouns }\\s+${ masculineParticiples }|${ feminineNoun }\\s+${ feminineParticiples })`;
// Matches e.g. "obrázok, ktorý zobrazuje": a noun, a comma, and its gender-matched relative clause.
const relativeClauseShape =
	`(?:${ masculineNouns },\\s*ktorý\\s+${ relativeClauseVerbs }` +
	`|${ feminineNoun },\\s*(?:ktorá\\s+${ relativeClauseVerbs }|na\\s+ktorej\\s+je))`;
// Matches e.g. "tento obrázok zobrazuje": an optional gender-matched demonstrative, a noun, and a finite verb.
const finiteVerbShape =
	`(?:(?:tento\\s+)?${ masculineNouns }|(?:táto\\s+)?${ feminineNoun })\\s+${ finiteVerbs }`;
// Matches e.g. "na tejto fotke je": "na", an optional demonstrative, a locative noun, and a prepositional verb.
const prepositionalShape =
	`na\\s+(?:(?:tomto\\s+)?${ masculineLocatives }|(?:tejto\\s+)?${ feminineLocative })\\s+${ prepositionalVerbs }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending before a non-letter so "obraz" does not match "obrazec".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp(
	`^(?:${ bareNounShape }|${ participleShape }|${ relativeClauseShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`,
	"iu"
);
