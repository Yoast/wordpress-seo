/**
 * Returns an array with exceptions for the sentence beginning researcher.
 *
 * @returns {string[]} The array filled with exceptions.
 */
export default function() {
	return [
		// Indefinite articles:
		"ett",
		// Definite articles:
		"det", "den", "de",
		// Numbers 1-10:
		"en", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio",
		// Demonstrative pronouns:
		"denne", "denna", "detta", "dessa",
	];
}
