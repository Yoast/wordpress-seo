/*
 * The Japanese redundant phrases come in two reviewed rules:
 * - rule 1, at the end of the alt text or of its first clause: the noun right after the genitive "の" (of) or a
 *   verb ending ("た" — past, "る"/"す" — non-past), and right before the copula "です" (is), its connecting
 *   form "で" (is, and …), punctuation or the end — "犬の画像" (image of a dog; literally "dog-of image"),
 *   "犬を示す写真です" (it is a photo showing a dog; literally "dog-showing photo is"), "昨日撮った写真"
 *   (a photo taken yesterday; literally "yesterday-taken photo"). The research tests the pattern against the
 *   first sentence of the alt text only, so a phrase in a later sentence does not match. The character before
 *   the noun is matched as a plain part of the pattern, not asserted with a lookbehind; the match therefore
 *   includes that character ("の画像" — "of image" — rather than "画像" — "image"), which makes no difference
 *   here, because the research only asks whether the pattern matches and never reads the match itself;
 * - rule 2, at the start: an optional "この" (this), the noun, and the topic particle — "画像は犬を示しています"
 *   (the image shows a dog), "この写真には子供が写っています" (in this photo children appear).
 */
// "Image", "photo".
const nouns = "(?:画像|写真)";

// E.g. "犬の画像です" (it is an image of a dog): the noun right after "の" (of) or a verb ending, and right
// before "です" (is), "で" (is, and …), punctuation or the end.
const endOfClauseRule = `[のたるす]${ nouns }(?=です|で|[。．.、,]|$)`;
// E.g. "この写真には" (in this photo): an optional "この" (this), the noun, and the topic particle "は" or
// "には" (as for …/in …), at the start.
const startRule = `^(?:この)?${ nouns }(?:には|は)`;

/**
 * The pattern the `redundantPhraseInAltText` research tests alt texts against: rule 2 anchored at the start and
 * rule 1 at the end of the first sentence or a clause.
 * See the research for the contract a language's pattern has to follow.
 */
export default new RegExp( `(?:${ startRule }|${ endOfClauseRule })` );
