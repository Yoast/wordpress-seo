import getL10nObject from "./getL10nObject";

/**
 * Gets the writing direction of the current page, either term or post.
 *
 * @returns {string} The writing direction of the page.
 */
export default function() {
	let writingDirection = "LTR";

	if ( getL10nObject().isRtl ) {
		writingDirection = "RTL";
	}

	return writingDirection;
}
