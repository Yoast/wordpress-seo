/*
 * "Avoid using <i>%1$s</i> as it is potentially harmful."
 *
 * The default first sentence of feedback strings for terms that receive a red traffic light.
 */
export const harmfulNonInclusive = "Avoid using <i>%1$s</i> as it is potentially harmful.";
/*
 * "Be careful when using <i>%1$s</i> as it is potentially harmful."
 *
 * The default first sentence of feedback strings for terms that receive an orange traffic light.
 */
export const harmfulPotentiallyNonInclusive = "Be careful when using <i>%1$s</i> as it is potentially harmful.";
/*
 * "Consider using an alternative, such as %2$s."
 *
 * The default second sentence of feedback strings for terms that receive a red traffic light.
 */
export const alternative = "Consider using an alternative, such as %2$s.";
/*
 * "Consider using an alternative, such as %2$s, unless referring to someone who explicitly wants to be referred to with this term."
 *
 * The default second sentence of feedback strings for terms that receive an orange traffic light and that some people want to be referred to with.
*/
const alternativeUnless = "Consider using an alternative, such as %2$s, unless referring to " +
	"someone who explicitly wants to be referred to with this term.";
/*
 * "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
 *
 * The default feedback string for terms that receive a red traffic light.
*/
export const potentiallyHarmful = [ harmfulNonInclusive, alternative ].join( " " );
/*
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
 *
 * Used to create some feedback strings for terms that receive an orange traffic light (usually, an explanation of contexts in which this term is
 * inclusive is appended at the end of this string).
*/
export const potentiallyHarmfulCareful = [ harmfulPotentiallyNonInclusive, alternative ].join( " " );
/*
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s, unless referring to someone who
 * explicitly wants to be referred to with this term."
 *
 * The default feedback string for terms that receive an orange traffic light and which some people may want to be referred to with.
 * For example, 'Eskimo' or 'fat'.
 */
export const potentiallyHarmfulUnless = [ harmfulPotentiallyNonInclusive, alternativeUnless ].join( " " );
// A string that's currently only used for the phrase 'aging dependants'. We have an issue to change it.
export const potentiallyHarmfulUnlessNonInclusive = [ harmfulNonInclusive, alternativeUnless ].join( " " );

/*
 * "Alternatively, if talking about a specific person, use their preferred descriptor if known."
 *
 * An additional string for offering alternatives for some terms that receive an orange traffic light, such as 'fat' or 'obese',
 */
export const preferredDescriptorIfKnown = "Alternatively, if talking about a specific person, use their preferred descriptor if known.";
