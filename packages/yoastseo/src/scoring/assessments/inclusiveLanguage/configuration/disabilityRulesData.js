import { all as toBeForms, filteredAuxiliaries } from "../../../../languageProcessing/languages/en/config/internal/passiveVoiceAuxiliaries";
import { flatMap } from "lodash-es";

// Create an array used to create rules for 'OCD' and 'crazy about'. It includes all forms of 'to be/to get', optionally followed by a intensifier.
const intensifiersAndAdverbs = [ "so", "very", "a bit", "really", "pretty", "kind of", "that", "too", "totally", "completely", "absolutely", "even",
	"also", "as" ];
// Create all possible combinations of forms of 'to be/to get' and intensifiers/adverbs.
const formsOfToBePlusIntensifier = flatMap( toBeForms, verbToBe => flatMap( intensifiersAndAdverbs, intensifier => `${verbToBe} ${intensifier}` ) );
export const formsOfToBeWithOptionalIntensifier =  toBeForms.concat( formsOfToBePlusIntensifier );

/*
 * Create an array used to create the rule for the negated version of 'crazy about'.
 * It includes all forms of 'to be/to get' followed by 'not' and an optional intensifier.
 */
const auxiliaries = filteredAuxiliaries.slice( 0, 19 );
// The negated auxiliaries are: "isn't", "weren't", "wasn't", "aren't".
const negatedAuxiliaries = filteredAuxiliaries.slice( 19, 23 );

// Create combination of forms of 'to be/to get' and 'not'.
let toBeNot = flatMap( auxiliaries, verbTobe => `${verbTobe} not` );
toBeNot = toBeNot.concat( negatedAuxiliaries );

// Create all possible combinations of forms of 'to be/to get not' and intensifiers/adverbs.
const toBeNotPlusIntensifier = flatMap( toBeNot, verbToBeNot => flatMap( intensifiersAndAdverbs, intensifier => `${verbToBeNot} ${intensifier}` ) );
export const formsOfToBeNotWithOptionalIntensifier =  toBeNot.concat( toBeNotPlusIntensifier );

/*
 * Create an array used to create the rule for 'drive someone crazy'.
 * It contains all possible combinations of forms of 'to drive' followed by an object pronoun.
 */
const formsOfToDrive = [ "driving", "drive", "drove", "drives", "driven" ];
const objectPronouns = [ "me", "you", "them", "him", "her", "someone", "somebody", "anyone", "anybody", "everyone", "everybody" ];
export const toDriveSomeoneCrazy = flatMap( formsOfToDrive, form => flatMap( objectPronouns, pronoun => `${form} ${pronoun}` ) );

// Create an array used to create the rule for 'going crazy'.
export const formsOfToGo = [ "go", "goes", "going", "gone", "went" ];

/*
 * Create arrays of words/phrases that should not follow or precede standalone 'crazy'.
 * This prevents showing the feedback for standalone 'crazy' when it's part of a more specific phrase that we target.
*/
export const shouldNotPrecedeStandaloneCrazy = toDriveSomeoneCrazy.concat( formsOfToGo );
export const shouldNotFollowStandaloneCrazy = [ "in love" ];
export const shouldNotPrecedeStandaloneCrazyWhenFollowedByAbout = formsOfToBeWithOptionalIntensifier.concat( formsOfToBeNotWithOptionalIntensifier );
export const shouldNotFollowStandaloneCrazyWhenPrecededByToBe = [ "about" ];

export default {
	formsOfToBeWithOptionalIntensifier,
	formsOfToBeNotWithOptionalIntensifier,
	toDriveSomeoneCrazy,
	formsOfToGo,
	shouldNotPrecedeStandaloneCrazy,
	shouldNotFollowStandaloneCrazy,
	shouldNotPrecedeStandaloneCrazyWhenFollowedByAbout,
	shouldNotFollowStandaloneCrazyWhenPrecededByToBe,
};
