import { all as toBeForms, filteredAuxiliaries } from "../../../../languageProcessing/languages/en/config/internal/passiveVoiceAuxiliaries";
import { flatMap } from "lodash-es";

// Create an array used to create rules for 'OCD' and 'crazy about'. It includes all forms of 'to be/to get', optionally followed by a quantifier.
const quantifiers = [ "so", "very", "a bit", "really", "pretty", "kind of", "that",  "totally"  ];
// Create all possible combinations of forms of 'to be/to get' and quantifiers.
const formsOfToBePlusQuantifier = flatMap( toBeForms, verbToBe => flatMap( quantifiers, quantifier => `${verbToBe} ${quantifier}` ) );
export const formsOfToBeWithOptionalQuantifier =  toBeForms.concat( formsOfToBePlusQuantifier );

/*
 * Create an array used to create the rule for the negated version of 'crazy about'.
 * It includes all forms of 'to be/to get' followed by 'not' and an optional quantifier.
 */
const auxiliaries = filteredAuxiliaries.slice( 0, 19 );
// The negated auxiliaries are: "isn't", "weren't", "wasn't", "aren't".
const negatedAuxiliaries = filteredAuxiliaries.slice( 19, 23 );

// Create combination of forms of 'to be/to get' and 'not'.
let toBeNot = flatMap( auxiliaries, verbTobe => `${verbTobe} not` );
toBeNot = toBeNot.concat( negatedAuxiliaries );

// Create all possible combinations of forms of 'to be/to get not' and quantifiers.
const toBeNotPlusQuantifier = flatMap( toBeNot, verbToBeNot => flatMap( quantifiers, quantifier => `${verbToBeNot} ${quantifier}` ) );
export const formsOfToBeNotWithOptionalQuantifier =  toBeNot.concat( toBeNotPlusQuantifier );

/*
 * Create an array used to create the rule for 'drive someone crazy'.
 * It contains all possible combinations of forms of 'to drive' followed by an object pronoun.
 */
const formsOfToDrive = [ "driving", "drive", "drove", "driven" ];
const objectPronouns = [ "me", "you", "them", "him", "her", "someone", "somebody", "anyone", "anybody", "everyone", "everybody" ];
export const toDriveSomeoneCrazy = flatMap( formsOfToDrive, form => flatMap( objectPronouns, pronoun => `${form} ${pronoun}` ) );



/*
 * Create an array that combines all the words/phrases used to create rules for phrases containing 'crazy'.
 * It is used to create a rule for 'crazy' on its own. We should not show the feedback for 'crazy' when 'crazy' is part of a more specific phrase.
*/
export const shouldNotPrecedeStandaloneCrazy = formsOfToBeWithOptionalQuantifier.concat( formsOfToBeNotWithOptionalQuantifier, toDriveSomeoneCrazy );

export default {
	formsOfToBeWithOptionalQuantifier,
	formsOfToBeNotWithOptionalQuantifier,
	toDriveSomeoneCrazy,
	shouldNotPrecedeStandaloneCrazy,
};
