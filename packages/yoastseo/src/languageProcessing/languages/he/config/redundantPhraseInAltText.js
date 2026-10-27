import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Hebrew redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and a word — both the absolute "תמונה"
 *   ("תמונה של כלב" — picture of a dog) and the construct "תמונת", which marks the genitive by itself
 *   ("תמונת כלב" — picture of a dog, literally "picture-of dog"), so an alt text simply starting with either
 *   form is the redundant opening,
 *   while a number or punctuation after it is a figure label or a clause break;
 * - the definite noun with an optional demonstrative after it, and a finite verb — "התמונה מתארת" (the picture
 *   describes), "התמונה הזו מראה" (this picture shows), "התמונה הזאת מציגה" (this picture presents);
 * - a prepositional opening placing what is shown in the image, with the preposition prefixed to the noun —
 *   "בתמונה נראה", "בתמונה נראית", "בתמונה נראים" (in the picture is/are seen, in its agreement forms).
 */
// "Picture" in its absolute and construct forms, the definite "the picture", and "in the picture" with its
// prefixed "ב".
const noun = "תמונה";
const constructNoun = "תמונת";
const definiteNoun = "התמונה";
const prepositionalNoun = "בתמונה";
// "This" in its two spellings.
const demonstratives = "(?:הזו|הזאת)";
// "Describes", "shows", "presents".
const finiteVerbs = "(?:מתארת|מראה|מציגה)";
// "Is/are seen": the verb agrees with what is shown, so all four gender and number forms are matched.
const seenVerbs = "(?:נראה|נראית|נראים|נראות)";

/*
 * Construct compounds that name a kind of image rather than describe what it depicts: in "תמונת מסך"
 * (screenshot) or "תמונת פרופיל" (profile picture) the opening names the image type, so removing it would be
 * wrong advice. They only exist in the construct form, so the absolute "תמונה" needs no exceptions.
 */
const constructExceptions = "(?:מסך|פרופיל)";

// The following word is a lookahead, so the pattern's end guard still sits right after the noun.
// Matches e.g. "תמונה של כלב": either noun form followed by a word; the construct form refuses the excepted compounds.
const bareNounShape =
	`(?:${ noun }(?=\\s+${ letter })|${ constructNoun }(?=\\s+${ letter })(?!\\s+${ constructExceptions }${ wordEnd }))`;
// Matches e.g. "התמונה הזו מראה": the definite noun, an optional demonstrative after it, and a finite verb.
const finiteVerbShape = `${ definiteNoun }\\s+(?:${ demonstratives }\\s+)?${ finiteVerbs }`;
// Matches e.g. "בתמונה נראה": the noun with its prefixed "ב", and an agreement form of "is seen".
const prepositionalShape = `${ prepositionalNoun }\\s+${ seenVerbs }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start and ending
 * before a non-letter, so the plural "תמונות" is not matched.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ bareNounShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "u" );
