import createAlternation from "../../../helpers/regex/createAlternation";

/*
 * The German redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - an optional indefinite article, a noun calling the element an image, and a connector introducing what it
 *   depicts — "Bild eines" (image of a), "eine Abbildung des" (an image of the), "ein Bild, das … zeigt"
 *   (an image that shows …; literally "an image that … shows"),
 *   "Abbildung, auf der … zu sehen ist" (image on which … can be seen; literally "image, on which
 *   … to see is");
 * - a definite determiner, the noun, and a finite verb — "Das Bild zeigt" (the image shows),
 *   "diese Abbildung stellt … dar" (this image depicts …; "dar" is the separated verb prefix at the end);
 * - a prepositional opening placing what is shown in the image — "Auf dem Bild ist … zu sehen"
 *   (in the image … can be seen), "auf der Abbildung sieht man" (in the image one sees).
 * Every shape exists for both nouns, each with the forms of its own gender: the neuter "Bild" takes
 * "ein"/"das"/"dieses"/"auf dem", the feminine "Abbildung" takes "eine"/"die"/"diese"/"auf der".
 * German puts the characteristic verb after what the image depicts (relative clauses are verb-final, and
 * "darstellen" is separable), so the phrases marked with "…" contain a gap: any run of words without a comma,
 * including none. The gap may be empty because the depicted content can also follow the verb as a clause
 * instead, e.g.: "Das Bild stellt dar, wie der Prozess abläuft" (the picture depicts how the process unfolds).
 * The research tests the pattern against the first sentence of the alt text only, so a gap cannot run across a sentence
 * boundary either.
 * The comma before the relative clauses is optional, because alt text often drops it.
 */
const gap = "(?:[^,]*\\s+)?";

const nounForms = [
	{ noun: "Bild", indefiniteArticle: "ein", definiteDeterminers: [ "das", "dieses" ], relativePronoun: "das", prepositionalArticle: "dem" },
	{ noun: "Abbildung", indefiniteArticle: "eine", definiteDeterminers: [ "die", "diese" ], relativePronoun: "die", prepositionalArticle: "der" },
];

// "Of a" and "of the" in their gendered forms, "of", "of the" in its contracted form.
const simpleConnectors = `\\s+(?:${ createAlternation( [ "eines", "einer", "des", "der", "von", "vom" ] ) })`;
// "Depicts", "shows": the verb-final forms inside a relative clause.
const relativeVerbs = "(?:darstellt|zeigt)";
// "… can be seen": verb-final inside the "auf der/dem" relative clause.
const canBeSeen = "zu\\s+sehen\\s+ist";
// "Depicts …" (the separable "stellt … dar"), "shows".
const finiteVerbs = `(?:stellt\\s+${ gap }dar|zeigt)`;
// "… can be seen", "one sees".
const prepositionalVerbs = `(?:ist\\s+${ gap }zu\\s+sehen|sieht\\s+man)`;

// Matches e.g. "ein Bild, das … zeigt": per noun, its optional article and one of its connectors or relative clauses.
const connectorShape = nounForms.map( ( { noun, indefiniteArticle, relativePronoun, prepositionalArticle } ) => {
	const connectors = [
		simpleConnectors,
		`,?\\s+${ relativePronoun }\\s+${ gap }${ relativeVerbs }`,
		`,?\\s+auf\\s+${ prepositionalArticle }\\s+${ gap }${ canBeSeen }`,
	];
	return `(?:${ indefiniteArticle }\\s+)?${ noun }(?:${ connectors.join( "|" ) })`;
} ).join( "|" );

// Matches e.g. "dieses Bild zeigt": per noun, its definite determiner and a finite verb, with the gap of "stellt … dar".
const finiteVerbShape = nounForms.map( ( { noun, definiteDeterminers } ) =>
	`(?:${ createAlternation( definiteDeterminers ) })\\s+${ noun }\\s+${ finiteVerbs }`
).join( "|" );

// Matches e.g. "auf dem Bild sieht man": "auf" with the noun's own article, the noun, and "ist … zu sehen" or "sieht man".
const prepositionalShape = nounForms.map( ( { noun, prepositionalArticle } ) =>
	`auf\\s+${ prepositionalArticle }\\s+${ noun }\\s+${ prepositionalVerbs }`
).join( "|" );

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending on a word boundary so "Das Bild zeigt" does not match "Das Bild zeigte".
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ connectorShape }|${ finiteVerbShape }|${ prepositionalShape })\\b`, "i" );
