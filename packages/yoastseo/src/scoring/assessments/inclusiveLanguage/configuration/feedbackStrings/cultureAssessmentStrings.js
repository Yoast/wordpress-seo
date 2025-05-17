import { beCarefulHarmful } from "./generalFeedbackStrings";

// Guidelines for adding feedback strings:
// 1) This file is for strings that can only be used for culture assessments. If a string can be also used for other
// assessments, add it to the generalFeedbackStrings.js file instead.
// 2) Before adding a new string, check whether a similar string that can be used instead already exists (also in generalFeedbackStrings.js).

/*
 * Used for culturally appropriative terms, such as 'spirit animal'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s instead, unless you are referring to
 * the culture in which this term originated."
 */
export const orangeUnlessCultureOfOrigin = [ beCarefulHarmful, "Consider using an alternative, such as %2$s instead," +
" unless you are referring to the culture in which this term originated." ].join( " " );

/*
 * Used for culturally appropriative terms, such as 'tribe'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s instead, unless you are referring to
 * a culture that uses this term."
 */
export const orangeUnlessCultureUsesTerm = [ beCarefulHarmful, "Consider using an alternative, such as %2$s instead," +
" unless you are referring to a culture that uses this term." ].join( " " );
