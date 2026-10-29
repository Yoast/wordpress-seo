import createAlternation from "../../../helpers/regex/createAlternation";
import { letter, wordEnd, wordStart } from "../../../helpers/regex/wordBoundaries";

/*
 * The Turkish redundant phrases come in four reviewed rules. Two sit at the END of the alt text or of its first
 * clause, because Turkish puts the possessed noun or the participle's head last:
 * - rule 1a: the possessive noun ending the text or a clause, with an optional copula — "Bir köpeğin resmi"
 *   (a dog's picture; literally "a dog-of picture-its"), "Ekibin fotoğrafıdır" (it is the team's photo;
 *   literally "team-of photo-its-is");
 * - rule 1b: a participle (-en/-an or -dığı/-diği/-duğu/-düğü and the -t- variants) and the bare noun ending the
 *   text or a clause, with an optional copula — "Koşan bir köpeği gösteren görsel" (an image showing a running
 *   dog; literally "running a dog showing image"), "Ekibin çektiği fotoğraf" (the photo the team took; literally
 *   "team-of taken photo");
 * - rule 2a, at the start: an optional "bu" (this) and the locative noun — "Görselde bir köpek var" (in the
 *   image there is a dog), "Bu fotoğrafta dağlar görünüyor" (in this photo mountains appear);
 * - rule 2b, at the start: an optional "bu", the bare noun, and a depicting verb later in the sentence —
 *   "Görsel bir köpeği gösteriyor" (the image shows a dog), "Bu resim manzarayı tasvir etmektedir" (this picture
 *   depicts the landscape).
 * The reviewed rules use `\w` and `\b`, which only know ASCII word characters and are blind to ğ, ı, ö, ş, ü
 * and ç ("\w+" can never cross the "ş" of "koşan"), so the word boundaries here are the Unicode-aware guards
 * from `wordBoundaries` instead. The research tests the pattern against the first sentence of the alt text only, so an
 * end-anchored rule cannot match past it.
 */
/**
 * Makes the i's in a word match their all-caps forms. With the `iu` flags, JavaScript folds case the simple,
 * language-neutral way: "I" folds to "i" (never to "ı") and "İ" only to itself, so "fotoğrafı" would miss
 * "FOTOĞRAFI" and "resmi" would miss "RESMİ". Each "ı" becomes "[ıi]" (the "i" also covers "I") and each "i"
 * becomes "[iİ]", in one pass so a replacement is never rewritten. As a harmless side effect, "[ıi]" also
 * accepts a plain "i" where Turkish spelling wants "ı", such as the typo "fotoğrafi".
 *
 * @param {string} word The word, or an alternation of words.
 *
 * @returns {string} The pattern.
 */
const tolerateTurkishIs = ( word ) => word.replace( /[ıi]/g, ( character ) => character === "ı" ? "[ıi]" : "[iİ]" );

// A run of letters: the word carrying a participle ending in rule 1b.
const letterRun = `${ letter }+`;
// The ending of rule 1a and 1b: the end of the (first) sentence, or a clause break. A clause break is attached
// punctuation ("fotoğrafı!", "fotoğrafı)") or a free-standing dash ("fotoğrafı - 2024"); an attached hyphen joins
// a suffix instead, so it does not count.
const clauseEnd = "(?=[.,;!?)\\]]|\\s+[-–—]|\\s*$)";

/*
 * Compounds that name a kind of image rather than describe what it depicts: in "profil resmi" (profile picture)
 * or "stok görseli" (stock image) the possessive is part of the term, so removing the opening would be wrong
 * advice. The modifier sits BEFORE the matched noun, so these are negative lookbehinds — the one construct that
 * can assert left context. That is safe here: the project targets the last two versions of each browser, all of
 * which support lookbehind. The exceptions cover the singular possessives only, as reviewed.
 */
const exceptions = {
	resmi: [ "profil", "arka plan", "yağlı boya" ],
	fotoğrafı: [ "profil", "kapak", "hava", "arşiv", "stok" ],
	görseli: [ "kapak", "arka plan", "stok" ],
};

/**
 * Prepends to a possessive noun a negative lookbehind that blocks the match when one of the noun's excepted
 * modifiers precedes it.
 *
 * @param {string} noun The possessive noun.
 *
 * @returns {string} The pattern.
 */
const addExceptionsGuard = ( noun ) =>
	`(?<!(?:${ tolerateTurkishIs( createAlternation( exceptions[ noun ] ) ) })\\s)${ tolerateTurkishIs( noun ) }`;

// "Its picture/pictures", "its image/images", "its photo/photos".
const possessiveNouns =
	`(?:${ addExceptionsGuard( "resmi" ) }|${ tolerateTurkishIs( "resimleri" ) }|${ addExceptionsGuard( "görseli" ) }` +
	`|${ tolerateTurkishIs( "görselleri" ) }|${ addExceptionsGuard( "fotoğrafı" ) }|${ tolerateTurkishIs( "fotoğrafları" ) })`;
// "Image", "picture", "photo".
const bareNouns = `(?:${ tolerateTurkishIs( "görsel|resim|fotoğraf" ) })`;
// "In the image/picture/photo".
const locativeNouns = `(?:${ tolerateTurkishIs( "görselde|resimde|fotoğrafta" ) })`;
// The "i" in the class already covers "I"; "İ" has to be listed.
const participleEndings = "(?:[ea]n|[dt][ıiİuü]ğ[ıiİuü])";
// "Shows", "depicts" and "portrays", each in a plain and a formal register.
const verbs = `(?:${ tolerateTurkishIs( createAlternation( [
	"gösteriyor", "göstermektedir", "betimliyor", "betimlemektedir", "tasvir ediyor", "tasvir etmektedir",
] ) ) })`;

// E.g. "Bir köpeğin resmi(dir)": a possessive noun and an optional copula at the end of the text or of a clause.
const rule1a = `${ wordStart }${ possessiveNouns }(?:${ tolerateTurkishIs( "dır|dir" ) })?${ clauseEnd }`;
// E.g. "köpeği gösteren görsel": a word with a participle ending, a bare noun and an optional copula at a clause end.
const rule1b = `${ letterRun }${ participleEndings }\\s+${ bareNouns }(?:${ tolerateTurkishIs( "dır|dir|tır|tir" ) })?${ clauseEnd }`;
// E.g. "Bu görselde": an optional "bu" and a locative noun at the start.
const rule2a = `^(?:bu\\s+)?${ locativeNouns }${ wordEnd }`;
// E.g. "Görsel bir köpeği gösteriyor": an optional "bu" and a bare noun at the start, with a depicting verb ending the sentence.
const rule2b = `^(?:bu\\s+)?${ bareNouns }${ wordEnd }.*\\s${ verbs }\\.?$`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: rules 2a and 2b anchored at the
 * start and rules 1a and 1b at the end of the first sentence or a clause.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `(?:${ rule2a }|${ rule2b }|${ rule1a }|${ rule1b })`, "iu" );
