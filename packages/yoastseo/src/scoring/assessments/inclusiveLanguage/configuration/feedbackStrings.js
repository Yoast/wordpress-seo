/*
 * The default first sentence of feedback strings for terms that receive a red traffic light.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful."
 */
export const harmfulNonInclusive = "Avoid using <i>%1$s</i> as it is potentially harmful.";
/*
 * The default first sentence of feedback strings for terms that receive an orange traffic light.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful."
 */
export const harmfulPotentiallyNonInclusive = "Be careful when using <i>%1$s</i> as it is potentially harmful.";
/*
 * The default second sentence of feedback strings for terms that receive a red traffic light.
 *
 * "Consider using an alternative, such as %2$s."
 */
export const alternative = "Consider using an alternative, such as %2$s.";
/*
 * The default second sentence of feedback strings for terms that receive an orange traffic light and that some people want to be referred to with.
 *
 * "Consider using an alternative, such as %2$s, unless referring to someone who explicitly wants to be referred to with this term."
*/
const alternativeUnless = "Consider using an alternative, such as %2$s, unless referring to " +
	"someone who explicitly wants to be referred to with this term.";
/*
 * The default feedback string for terms that receive a red traffic light.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
*/
export const potentiallyHarmful = [ harmfulNonInclusive, alternative ].join( " " );
/*
 * Used to create some feedback strings for terms that receive an orange traffic light (usually, an explanation of contexts in which this term is
 * inclusive is appended at the end of this string).
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
*/
export const potentiallyHarmfulCareful = [ harmfulPotentiallyNonInclusive, alternative ].join( " " );
/*
 * The default feedback string for terms that receive an orange traffic light and which some people may want to be referred to with.
 * For example, 'Eskimo' or 'fat'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s, unless referring to someone who
 * explicitly wants to be referred to with this term."
 */
export const potentiallyHarmfulUnless = [ harmfulPotentiallyNonInclusive, alternativeUnless ].join( " " );

/*
 * An additional string for offering alternatives for some terms that receive an orange traffic light, such as 'fat' or 'obese'.
 *
 * "Alternatively, if talking about a specific person, use their preferred descriptor if known."
 */
export const preferredDescriptorIfKnown = "Alternatively, if talking about a specific person, use their preferred descriptor if known.";

// An additional string to target phrases that are potentially non-inclusive unless referring to animals or objects.
export const potentiallyHarmfulUnlessAnimalsObjects = [ harmfulPotentiallyNonInclusive,
	"Unless you are referring to objects or animals, consider using an alternative, such as %2$s." ].join( " " );
