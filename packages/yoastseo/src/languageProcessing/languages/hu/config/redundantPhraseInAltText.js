import { letter, wordEnd, wordStart } from "../../../helpers/regex/wordBoundaries";

/*
 * The Hungarian redundant phrases come in five reviewed rules. Unlike the other languages, two of them sit at
 * the END of the alt text or of its first clause, because Hungarian puts the possessive noun last: "Egy kutya
 * képe" (a dog's image; literally "a dog picture-its"), "Egy kutyát ábrázoló kép" (an image depicting a dog;
 * literally "a dog-ACC depicting picture"). The research tests the pattern
 * against the first sentence of the alt text, so the end anchor means the end of that sentence.
 * - rule 1: "(Egy) kép" (a picture) at the start, followed by a space and a word — "Kép egy kutyáról" (picture
 *   of a dog). The following word keeps figure labels ("Kép: …", "Kép 1") and a bare "Kép" from matching;
 * - rule 2: "(Ez) a kép" (this picture) at the start, with "ábrázol(ja)" (depicts) or "mutat(ja)" (shows)
 *   anywhere later in the sentence — "A kép egy kutyát ábrázol" (the picture depicts a dog),
 *   "Ez a kép mutatja be az új irodát" (this picture presents the new office);
 * - rule 3: "(Ezen) a képen" (in this picture) at the start — "A képen egy kutya látható" (in the picture a dog
 *   can be seen);
 * - rule 4: the possessive "képe" ending the text or a clause — "Egy futó kutya képe, a háttérben fák" (image of
 *   a running dog, trees in the background);
 * - rule 5: a depicting participle and "kép" ending the text or a clause — "A Parlamentet bemutató kép, éjszaka"
 *   (picture presenting the Parliament, at night).
 * The word boundaries are explicit letter guards instead of `\b`, because `\b` only knows ASCII word characters:
 * it would never find the start of "ábrázol" after a space, and "mutat\b" would falsely match inside "mutatós"
 * (showy).
 */
// A figure label ("Kép: kapcsolási rajz") is not a redundant opening.
const notColon = "(?!\\s*:)";
// The ending of rule 4 and 5: the end of the (first) sentence, or a clause break.
const clauseEnd = "(?=[.,;]|\\s*$)";

// "Picture", its possessive "picture-its", and its locative "in the picture".
const noun = "kép";
const possessiveNoun = "képe";
const locativeNoun = "képen";
// "Depicts", "shows", each with an optional definite "-ja".
const finiteVerbs = "(?:ábrázol|mutat)(?:ja)?";
// "Depicting", "showing", "presenting".
const participles = "(?:ábrázoló|mutató|bemutató)";

// E.g. "Kép egy kutyáról": "kép" at the start, optionally after "egy", not before a colon, and followed by a word.
const rule1 = `^(?:egy\\s+)?${ noun }${ wordEnd }${ notColon }(?=\\s+${ letter })`;
// E.g. "A kép egy kutyát ábrázol": "(ez) a kép" at the start, with "ábrázol(ja)" or "mutat(ja)" later in the sentence.
const rule2 = `^(?:ez\\s+)?a\\s+${ noun }${ wordEnd }${ notColon }.*\\s${ finiteVerbs }${ wordEnd }`;
// E.g. "A képen egy kutya látható": "(ezen) a képen" at the start.
const rule3 = `^(?:ezen\\s+)?a\\s+${ locativeNoun }${ wordEnd }`;
// E.g. "Egy kutya képe": the possessive "képe" at the end of the text or of a clause.
const rule4 = `${ wordStart }${ possessiveNoun }${ clauseEnd }`;
// E.g. "Egy kutyát ábrázoló kép": a depicting participle and "kép" at the end of the text or of a clause.
const rule5 = `${ wordStart }${ participles }\\s+${ noun }${ clauseEnd }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: case-insensitive, with rules 1-3
 * anchored at the start and rules 4-5 at the end of the first sentence or a clause.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `(?:${ rule1 }|${ rule2 }|${ rule3 }|${ rule4 }|${ rule5 })`, "iu" );
