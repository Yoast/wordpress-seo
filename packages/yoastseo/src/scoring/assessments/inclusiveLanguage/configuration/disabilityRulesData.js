import { formsOfToBe, negatedFormsOfToBe, formsOfToGet } from "../../../../languageProcessing/languages/en/config/internal/passiveVoiceAuxiliaries";
import { flatMap } from "lodash";

const intensifiersAndAdverbs = [ "so", "very", "a bit", "really", "pretty", "kind of", "that", "too", "totally", "completely", "absolutely", "even",
	"also", "as" ];
const formsOfToDrive = [ "driving", "drive", "drove", "drives", "driven" ];
const objectPronouns = [ "me", "you", "them", "him", "her", "someone", "somebody", "anyone", "anybody", "everyone", "everybody" ];
const formsOfToBeAndToGet = formsOfToBe.concat( formsOfToGet );

/**
 * Creates an array of all possible combinations of strings from two arrays.
 * For example, if array 1 is [ "fluffy", "cute" ] and array 2 is [ "cats", "dogs" ],
 * it creates the array [ "cute cats", "cute dogs", "fluffy cats", "fluffy dogs" ].
 *
 * @param {string[]} arrayOne The first array of strings.
 * @param {string[]} arrayTwo The second array of strings.
 *
 * @returns {string[]} An array containing all possible combinations of strings from two arrays.
 */
const createCombinationsFromTwoArrays = function( arrayOne, arrayTwo ) {
	return flatMap( arrayOne, stringFromArrayOne => flatMap( arrayTwo, stringFromArrayTwo => `${stringFromArrayOne} ${stringFromArrayTwo}` ) );
};

/*
 * Create an array of strings that should precede the non-negated version of 'crazy about'.
 * It includes all forms of 'to be/to get', optionally followed by an intensifier or a specific adverb (e.g., 'is', 'is very', 'are even').
 */
const combinationsOfToBeAndIntensifier = createCombinationsFromTwoArrays( formsOfToBeAndToGet, intensifiersAndAdverbs );
export const formsOfToBeWithOptionalIntensifier = combinationsOfToBeAndIntensifier.concat( formsOfToBeAndToGet );

/*
 * Create an array of strings that should precede the negated version of 'crazy about'.
 * It includes all forms of 'to be/to get', followed by 'not/'nt' and an optional intensifier or specific adverb (e.g., 'is not', 'aren't even').
 */
let negatedFormsOfToBeAndToGet = flatMap( formsOfToBeAndToGet, verb => `${verb} not` );
negatedFormsOfToBeAndToGet = negatedFormsOfToBeAndToGet.concat( negatedFormsOfToBe );
const combinationsOfToBeNotAndIntensifier = createCombinationsFromTwoArrays( negatedFormsOfToBeAndToGet, intensifiersAndAdverbs );
export const formsOfToBeNotWithOptionalIntensifier = combinationsOfToBeNotAndIntensifier.concat( negatedFormsOfToBeAndToGet );

/*
 * Create an array of strings that should precede 'OCD'.
 * It includes both negated and non-negated forms of 'to be/get' followed by an optional intensifier or specific adverb (e.g., 'is very', 'are not').
*/
export const formsOfToBeAndToBeNotWithOptionalIntensifier = formsOfToBeWithOptionalIntensifier.concat( formsOfToBeNotWithOptionalIntensifier );

/*
 * Create an array of strings that should precede 'crazy' to target the expression 'to drive someone crazy'.
 * It contains all possible combinations of forms of 'to drive' followed by an object pronoun.
 */
export const combinationsOfDriveAndObjectPronoun = createCombinationsFromTwoArrays( formsOfToDrive, objectPronouns );

// Create an array of strings that should precede 'crazy' to follow the expression 'to go crazy'.
export const formsOfToGo = [ "go", "goes", "going", "gone", "went" ];

/*
 * Create arrays of strings that should not follow and/or precede standalone 'crazy'.
 * This prevents showing the feedback for standalone 'crazy' when it's part of a more specific phrase that we target.
*/
export const shouldNotPrecedeStandaloneCrazy = combinationsOfDriveAndObjectPronoun.concat( formsOfToGo );
export const shouldNotFollowStandaloneCrazy = [ "in love" ];
export const shouldNotPrecedeStandaloneCrazyWhenFollowedByAbout = formsOfToBeWithOptionalIntensifier.concat( formsOfToBeNotWithOptionalIntensifier );
export const shouldNotFollowStandaloneCrazyWhenPrecededByToBe = [ "about" ];

export default {
	formsOfToBeWithOptionalIntensifier,
	formsOfToBeNotWithOptionalIntensifier,
	formsOfToBeAndToBeNotWithOptionalIntensifier,
	combinationsOfDriveAndObjectPronoun,
	formsOfToGo,
	shouldNotPrecedeStandaloneCrazy,
	shouldNotFollowStandaloneCrazy,
	shouldNotPrecedeStandaloneCrazyWhenFollowedByAbout,
	shouldNotFollowStandaloneCrazyWhenPrecededByToBe,
};
