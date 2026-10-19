import { letter, wordEnd } from "../../../helpers/regex/wordBoundaries";

/*
 * The Russian redundant openings come in three grammatical shapes, kept as word lists and small patterns so the
 * config encodes exactly the reviewed phrases and nothing more:
 * - the bare noun calling the element an image, followed by a space and a word — Russian has no articles and
 *   introduces what the image depicts with a genitive that no connector word marks ("Изображение собаки" —
 *   image of a dog), so an alt text simply starting with the noun is the redundant opening, while a number or
 *   punctuation after it is a figure label or a clause break;
 * - a demonstrative, the noun, and a finite verb — "Это изображение показывает" (this image shows),
 *   "эта картинка изображает" (this picture depicts);
 * - a prepositional opening placing what is shown in the image, with an optional demonstrative —
 *   "На изображении изображена" (in the image is depicted), "на этом фото виден" (in this photo is visible),
 *   "на этой фотографии изображены" (in this photograph are depicted).
 * All verbs apply to all four nouns alike, with the demonstrative of each noun's own gender. The participles and
 * "виден" agree with what is shown, so all gender and number forms are matched, and "изображён" also matches the
 * spelling "изображен", because "ё" is routinely written as "е".
 */
// "Image", "picture", "photograph", "photo".
const nouns = "(?:изображение|картинка|фотография|фото)";
// "Image", "photo" (the neuter nouns); "picture", "photograph" (the feminine nouns).
const neuterNouns = "(?:изображение|фото)";
const feminineNouns = "(?:картинка|фотография)";
// The locative forms that follow "на (этом/этой)", grouped the same way.
const neuterLocatives = "(?:изображении|фото)";
const feminineLocatives = "(?:картинке|фотографии)";
// "Depicts", "shows", "presents".
const finiteVerbs = "(?:изображает|показывает|представляет)";
// "Is depicted", "is shown", "is visible": the participles and "виден" agree with what is shown, so all
// gender and number forms are matched.
const prepositionalVerbs = "(?:изображ[её]н[аоы]?|показан[аоы]?|вид(?:ен|н[аоы]))";

/*
 * Genitive compounds that name a kind of image rather than describe what it depicts: in "фото профиля" (profile
 * photo), "изображение обложки" (cover image) or "картинка фона" (background image) the opening names the image
 * type, so removing it would be wrong advice.
 * Adjective-first types ("фоновое изображение", "стоковое фото") need no exception: they do not start with the
 * noun.
 */
const kindExceptions = "(?:профиля|обложки|фона)";

// The following word is a lookahead, so the pattern's end guard still sits right after the noun.
// Matches e.g. "изображение собаки": a bare noun followed by a word, unless that word is an excepted compound.
const bareNounShape =
	`${ nouns }(?=\\s+${ letter })(?!\\s+${ kindExceptions }${ wordEnd })`;
// Matches e.g. "это фото показывает": the gender-matched demonstrative, a noun, and a finite verb.
const finiteVerbShape =
	`(?:это\\s+${ neuterNouns }|эта\\s+${ feminineNouns })\\s+${ finiteVerbs }`;
// Matches e.g. "на этом фото виден": "на", an optional gender-matched demonstrative, a locative noun, and a verb form.
const prepositionalShape =
	`на\\s+(?:(?:этом\\s+)?${ neuterLocatives }|(?:этой\\s+)?${ feminineLocatives })\\s+${ prepositionalVerbs }`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: anchored at the start,
 * case-insensitive, and ending before a non-letter so the plural "изображения" is not matched.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `^(?:${ bareNounShape }|${ finiteVerbShape }|${ prepositionalShape })${ wordEnd }`, "iu" );
