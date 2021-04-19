/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
export default function() {
	return [
		// Articles (those which are not prefixes):
		"قليل", "بعض", "واحد",
		// Numbers 1-10:
		"واحد", "إثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة",
		// Demonstrative pronouns:
		"هذا", "هذه", "ذلك", "تلك", "هذين", "هذان", "هتين", "هتان", "هؤلا", "أولائك", "هؤلاء",
	];
}
//

