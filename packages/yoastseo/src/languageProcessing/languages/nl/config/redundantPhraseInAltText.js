import createAlternation from "../../../helpers/regex/createAlternation";
import { wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Dutch redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Afbeelding van" (image of), "een foto die … toont" (a photo that shows …; literally "a photo
 *   that … shows"), "afbeelding waarop … te zien is" (image on which … can be seen);
 * - a definite determiner, the noun, and a finite verb — "De afbeelding toont" (the image shows),
 *   "deze foto stelt … voor" (this photo depicts …; "voor" is the separated verb particle at the end);
 * - a prepositional opening placing what is shown in the image — "Op de afbeelding is … te zien"
 *   (in the image … can be seen), "op de foto zie je" (in the photo you see).
 * Dutch puts the characteristic verb after what the image depicts (relative clauses are verb-final, and several
 * verbs are separable), so the phrases marked with "…" contain a gap: any run of words, including none. The gap
 * may be empty because the depicted content can also follow the verb as a clause instead, as in
 * "de afbeelding laat zien hoe het werkt" (the image shows how it works). The research tests the pattern against
 * the first sentence of the alt text only, so a gap cannot run across a sentence boundary. A gap cannot run
 * across a comma either: the two halves of a separable verb stay in the same clause, and without this restriction
 * "De foto laat je koud, zoals je zelf kunt zien" (the photo leaves you cold, as you can see for yourself) would
 * match "laat … zien" across the clause break.
 */
const gap = "(?:[^,]*\\s+)?";

const indefiniteArticles = [ "een" ];
const definiteDeterminers = [ "de", "deze" ];
const nouns = [ "afbeelding", "foto" ];

const nounAlternation = createAlternation( nouns );

// "Een afbeelding van" (an image of), "een foto die … voorstelt/weergeeft/toont" (a photo that depicts/renders/shows …), "een afbeelding waarop … te zien is" (an image on which … can be seen).
const connectors = [
	"van",
	`die\\s+${ gap }(?:voorstelt|weergeeft|toont)`,
	`waarop\\s+${ gap }te\\s+zien\\s+is`,
];
// Matches e.g. "een foto die … toont": an optional "een", a noun, and a connector, with its gap where it has one.
const connectorShape = `(?:(?:${ createAlternation( indefiniteArticles ) })\\s+)?(?:${ nounAlternation })\\s+(?:${ connectors.join( "|" ) })`;

// "De foto beeldt … af" (the photo portrays …), "deze afbeelding stelt … voor" (this image depicts …), "de foto toont" (the photo shows), "Deze afbeelding laat … zien" (this image shows …).
const finiteVerbs = [
	`beeldt\\s+${ gap }af`,
	// In "stelt … voor", a "voor" directly followed by a determiner heads a prepositional phrase and is not the
	// separated particle: "De foto stelt mij voor een raadsel" (the photo presents me with a riddle) does not mean
	// "depicts". Only a determiner is excluded, because the particle itself can be followed by extraposed material,
	// as in "stelt een vrouw voor die lacht" (depicts a woman who is laughing). The gap is greedy, so when a later
	// "voor" is the particle, as in "stelt de haven voor de kust voor", the phrase still matches on that one.
	`stelt\\s+${ gap }voor${ wordEnd }(?!\\s+(?:de|het|een)${ wordEnd })`,
	"toont",
	`laat\\s+${ gap }zien`,
];
// Matches e.g. "deze foto stelt … voor": a determiner, a noun, and a finite verb, with the gap of the split verbs.
const finiteVerbShape = `(?:${ createAlternation( definiteDeterminers ) })\\s+(?:${ nounAlternation })\\s+(?:${ finiteVerbs.join( "|" ) })`;

// "Op de afbeelding is … te zien" (in the image … can be seen), "op de foto zie je" (in the photo you see).
const prepositionalVerbs = [ `is\\s+${ gap }te\\s+zien`, "zie\\s+je" ];
// Matches e.g. "op de foto is … te zien": "op de", a noun, and "is … te zien" or "zie je".
const prepositionalShape = `op\\s+de\\s+(?:${ nounAlternation })\\s+(?:${ prepositionalVerbs.join( "|" ) })`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on `wordEnd` so "foto van" does not match inside "Foto vandaag genomen". The guard
 * is `wordEnd` rather than `\b`, so every language's pattern treats non-ASCII letters the same way.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
