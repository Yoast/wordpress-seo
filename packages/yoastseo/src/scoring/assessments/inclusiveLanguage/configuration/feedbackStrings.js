/*
 * The default first sentence of feedback strings for terms that receive a red traffic light.
 * This string is used unless there is a specific reason to use a different string.
 * %1$s is a string with the non-inclusive term.
 */
export const harmfulNonInclusive = "Avoid using <i>%1$s</i> as it is potentially harmful.";
/*
 * The default first sentence of feedback strings for terms that receive an orange traffic light.
 * This string is used unless there is a specific reason to use a different string.
 * %1$s is a string with the non-inclusive term.
 */
export const harmfulPotentiallyNonInclusive = "Be careful when using <i>%1$s</i> as it is potentially harmful.";

/*
 * The default second sentence of feedback strings for terms that receive a red traffic light.
 * This string is used unless there is a specific reason to use a different string.
 * %2$s is a string with the alternative(s).
 */
export const alternative = "Consider using an alternative, such as %2$s.";
/*
 * The default second sentence of feedback strings for terms that receive an orange traffic light that are used to describe people, and which some
 * people may use in reference to themselves. For example, 'Eskimo' or 'fat'. It is inclusive to use this term if someone wants to be referred to
 * with it.
*/
const alternativeUnless = "Consider using an alternative, such as %2$s, unless referring to " +
	"someone who explicitly wants to be referred to with this term.";

/*
 * The default feedback string for terms that receive a red traffic light.
 * It says "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
*/
export const potentiallyHarmful = [ harmfulNonInclusive, alternative ].join( " " );
/*
 * A string that's used to create some strings for terms that receive an orange traffic light.
 * It says "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
 * For example, for the feedback for 'preferred name', we use this string and add 'unless referring to someone who explicitly wants to use this term
 * to describe their own name' at the end.
*/
export const potentiallyHarmfulCareful = [ harmfulPotentiallyNonInclusive, alternative ].join( " " );

/*
 * The default feedback string for terms that receive an orange traffic light that are used to describe people, and which some people may use
 * in reference to themselves.
 * It says: "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s, unless referring to
 * someone who explicitly wants to be referred to with this term.
 */
export const potentiallyHarmfulUnless = [ harmfulPotentiallyNonInclusive, alternativeUnless ].join( " " );
// A string that's currently only used for the phrase 'aging dependants'. We have an issue to change it.
export const potentiallyHarmfulUnlessNonInclusive = [ harmfulNonInclusive, alternativeUnless ].join( " " );

/*
* An additional string for offering alternatives for some terms that receive an orange traffic light. It is used for terms like 'fat' or 'obese',
* for which there are many alternatives but also a lot of individual preferences in which term people want to be described with.
*/
export const preferredDescriptorIfKnown = "Alternatively, if talking about a specific person, use their preferred descriptor if known.";
