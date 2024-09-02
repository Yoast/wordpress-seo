// Guidelines for adding feedback strings:
// 1) This file is for strings that can only be used for gender assessments. If a string can be also used for other
// assessments, add it to the generalFeedbackStrings.js file instead.
// 2) Before adding a new string, check whether a similar string that can be used instead already exists (also in generalFeedbackStrings.js).

/*
 * Used for terms that are exclusionary unless they describe a group that only consists of the people that the term mentions.
 * For example, "boys and girls".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of %1$s,
 *  use an alternative, such as %2$s."
 */
export const orangeExclusionaryUnless = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of %1$s, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless the group this term describes only consists of men, for example "firemen"."
 *
 * Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of %1$s,
 *  use an alternative, such as %2$s."
 */
export const orangeExclusionaryUnlessMen = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of men, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless the group this term describes only consists of men and women, for example "ladies and gentlemen".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of men and women,
 *  use an alternative, such as %2$s."
 */
export const orangeExclusionaryUnlessMenAndWomen = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of men and women, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless the group this term describes only consists of two genders, for example "both genders".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of two genders,
 *  use an alternative, such as %2$s."
 */
export const orangeExclusionaryUnlessTwoGenders = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of two genders, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless all members of the group use this term to refer to themselves, for example "mothers and fathers".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of people who use
 *  this term, use an alternative, such as %2$s."
 */
export const orangeExclusionaryUnlessUseTheTerm = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of people who use this term, use an alternative, such as %2$s.";


