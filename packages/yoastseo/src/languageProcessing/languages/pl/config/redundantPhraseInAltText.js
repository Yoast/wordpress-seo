import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Polish redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and a word — Polish has no articles and
 *   introduces what the image depicts with a genitive that no connector word marks ("Zdjęcie psa" — photo of
 *   a dog), so an alt text simply starting with the noun is the redundant opening, while a number or
 *   punctuation after it is a figure label or a clause break. A following "się", "nie" or "od" is excepted:
 *   "się" is reflexive and "nie" a negation, so a sentence about the image follows ("Obrazek się nie załadował"
 *   — the image did not load; "Zdjęcie nie jest dostępne" — the photo is not available), and "od" attributes
 *   the work to its maker or giver ("Obrazek od babci" — an image from grandma). A compound naming a kind of
 *   image is excepted too: in "zdjęcie profilu" or the more common "zdjęcie profilowe" (profile photo),
 *   "grafika tła" (background image) or "zdjęcie okładki" (cover photo) the opening names the image type, so
 *   removing it would be wrong advice. The compound list is provisional, to be reviewed by a native speaker;
 * - a demonstrative, the noun, and a finite verb, each noun with the demonstrative of its own gender —
 *   "Ten obrazek przedstawia" (this picture presents), "ta grafika pokazuje" (this graphic shows),
 *   "to zdjęcie ilustruje" (this photo illustrates);
 * - a prepositional opening placing what is shown in the image, with an optional demonstrative —
 *   "Na obrazku widać" (in the picture one can see), "na tej grafice jest" (in this graphic there is),
 *   "na tym zdjęciu są" (in this photo there are).
 */

// "Picture", "image", "graphic", "photo", as the bare-noun shape matches them.
const nouns = "(?:obrazek|obraz|grafika|zdjęcie)";
// The same nouns grouped by gender, as the demonstratives pair with them: the masculine "picture"/"image",
// the feminine "graphic", the neuter "photo".
const masculineNouns = "(?:obrazek|obraz)";
const feminineNoun = "grafika";
const neuterNoun = "zdjęcie";
// The locative forms that follow "na (tym)": the masculine "obrazku"/"obrazie" and the neuter "zdjęciu";
// the feminine "grafice" follows "na (tej)".
const masculineAndNeuterLocatives = "(?:obrazku|obrazie|zdjęciu)";
const feminineLocative = "grafice";
// "Presents", "shows", "illustrates".
const finiteVerbs = "(?:przedstawia|pokazuje|ilustruje)";
// "One can see", "is", "are", "is located", "is/are visible".
const prepositionalVerbs = "(?:widać|jest|są|znajduje\\s+się|widoczne\\s+(?:jest|są))";
/*
 * "Of the profile", "profile" (the adjective), "of the background", "in the background" (the Facebook cover
 * photo), "of the cover", "featured" (the WordPress featured image, in its masculine and neuter forms),
 * "illustrative" (the "for illustration only" type, in its neuter and masculine forms), "stock", "archival",
 * "aerial", "satellite", "ID" (the "zdjęcie legitymacyjne" ID photo).
 */
const kindExceptions =
	"(?:profilu|profilowe|tła|w\\s+tle|okładki|wyróżniający|wyróżniające|poglądowe|poglądowy" +
	"|stockowe|archiwalne|lotnicze|satelitarne|legitymacyjne)";

// The nouns are "picture", "image", "graphic", "photo".
// The following word is a lookahead, so the pattern's end guard still sits right after the noun.
// Matches e.g. "obrazek kota": a bare noun followed by a word, unless that word is "się", "od" or an excepted compound.
const bareNounShape =
	`${ nouns }(?=\\s+${ letter })` +
	`(?!\\s+(?:się|nie|od)(?!${ letter }))(?!\\s+${ kindExceptions }${ wordEnd })`;
// Matches e.g. "to zdjęcie pokazuje": the gender-matched demonstrative, a noun, and a finite verb.
const finiteVerbShape =
	`(?:ten\\s+${ masculineNouns }|ta\\s+${ feminineNoun }|to\\s+${ neuterNoun })\\s+${ finiteVerbs }`;
// Matches e.g. "na tym zdjęciu są": "na", an optional gender-matched demonstrative, a locative noun, and a verb.
const prepositionalShape =
	`na\\s+(?:(?:tym\\s+)?${ masculineAndNeuterLocatives }|(?:tej\\s+)?${ feminineLocative })\\s+${ prepositionalVerbs }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending before a non-letter so the plural "obrazy" is not matched.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ bareNounShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
