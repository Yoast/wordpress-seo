// Guidelines for adding feedback strings:
// 1) This file is for general strings that can be used for different assessment categories. If you want to add a string
// that is specific to one of the assessment categories, do it in a separate file (e.g. disabilityAssessmentStrings).
// 2) Before adding a new string, check whether a similar string that can be used instead already exists.

// 1) STRINGS USED IN THE FIRST SENTENCE OF THE FEEDBACK.

/*
 * Used for derogatory terms, such as "he-she".
 *
 * "Avoid using <i>%1$s</i> as it is derogatory."
 */
export const avoidDerogatory = "Avoid using <i>%1$s</i> as it is derogatory.";
/*
 * The default first sentence of feedback strings for terms that receive a red traffic light.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful."
 */

export const avoidHarmful = "Avoid using <i>%1$s</i> as it is potentially harmful.";
/*
 * The default first sentence of feedback strings for terms that receive an orange traffic light.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful."
 */

export const beCarefulHarmful = "Be careful when using <i>%1$s</i> as it is potentially harmful.";
/*
 * The default second sentence of feedback strings for terms that receive a red traffic light.
 *
 * "Consider using an alternative, such as %2$s."
 */


// 2) STRINGS USED IN THE SECOND SENTENCE OF THE FEEDBACK.

export const alternative = "Consider using an alternative, such as %2$s.";
/*
 * The default second sentence of feedback strings for terms that receive an orange traffic light and that some people want to be referred to with.
 *
 * "Consider using an alternative, such as %2$s, unless referring to someone who explicitly wants to be referred to with this term."
*/

const alternativeUnless = "Consider using an alternative, such as %2$s, unless referring to " +
	"someone who explicitly wants to be referred to with this term.";


// 3) STRINGS USED IN ADDITIONAL SENTENCES OF THE FEEDBACK.
/*
 * An additional string for offering alternatives for some terms that receive an orange traffic light, such as 'fat' or 'obese'.
 *
 * "Alternatively, if talking about a specific person, use their preferred descriptor if known."
 */
export const preferredDescriptorIfKnown = "Alternatively, if talking about a specific person, use their preferred descriptor if known.";


// 4) COMPLETE FEEDBACK STRINGS.
/*
 * Used to create some feedback strings for terms that receive an orange traffic light (usually, an explanation of contexts
 * in which this term is inclusive is added at the end of this string).
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
 *
*/
export const orangeNoUnless = [ beCarefulHarmful, alternative ].join( " " );

/*
 * Used for potentially exclusionary terms that receive an orange traffic light, such as 'he or she'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially exclusionary. Consider using an alternative, such as %2$s."
 */
export const orangeExclusionaryNoUnless = [ "Be careful when using <i>%1$s</i> as it is potentially exclusionary.", alternative ].join( " " );

// An additional string to target phrases that are potentially non-inclusive unless referring to animals or objects.
export const orangeUnlessAnimalsObjects = [ beCarefulHarmful,
	"Unless you are referring to objects or animals, consider using an alternative, such as %2$s." ].join( " " );

/*
 * The default feedback string for terms that receive an orange traffic light and which some people may want to be referred to with.
 * For example, 'Eskimo' or 'fat'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s, unless referring to someone who
 * explicitly wants to be referred to with this term."
 */
export const orangeUnlessSomeoneWants = [ beCarefulHarmful, alternativeUnless ].join( " " );

/*
 * The default feedback string for terms that receive a red traffic light.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
*/
export const redHarmful = [ avoidHarmful, alternative ].join( " " );
/*
 * Used for exclusionary terms, such as 'mankind'.
 *
 * "Avoid using <i>%1$s</i> as it is exclusionary. Consider using an alternative, such as %2$s."
 */
export const redExclusionary = [ "Avoid using <i>%1$s</i> as it is exclusionary.", alternative ].join( " " );

/*
 * Used for potentially exclusionary terms that receive an orange traffic light, such as 'female-bodied'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially exclusionary. Consider using an alternative, such as %2$s."
 */
export const redPotentiallyExclusionary = [ "Avoid using <i>%1$s</i> as it is potentially exclusionary.", alternative ].join( " " );

