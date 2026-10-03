import { beCarefulHarmful } from "./generalFeedbackStrings";

// Guidelines for adding feedback strings:
// 1) This file is for strings that can only be used for disability assessments. If a string can be also used for other
// assessments, add it to the generalFeedbackStrings.js file instead.
// 2) Before adding a new string, check whether a similar string that can be used instead already exists (also in generalFeedbackStrings.js).

/*
 * Used for terms that are inclusive only if you are referring to a medical condition, for example 'manic' or 'OCD'.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful. Unless you are referencing the specific medical condition, consider using another
 * alternative to describe the trait or behavior, such as %2$s. "
 */
export const orangeUnlessMedicalCondition = beCarefulHarmful +
	" Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, such as %2$s.";
