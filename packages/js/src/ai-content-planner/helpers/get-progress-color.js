import { META_DESCRIPTION_MAX_LENGTH, META_DESCRIPTION_RECOMMENDED_MIN_LENGTH } from "../constants";

/**
 * Returns the progress bar color based on the meta description length.
 * Matches the scoring logic and colors from the Yoast snippet editor ProgressBar:
 * - 1–120 chars: orange / $color_ok (#ee7c1b)
 * - 121–156 chars: green / $color_good (#7ad03a)
 * - >156 chars: orange / $color_ok (#ee7c1b)
 *
 * @param {number} length The current character count.
 * @returns {string} The hex color for the progress bar.
 */
export const getProgressColor = ( length ) => {
	if ( length > META_DESCRIPTION_RECOMMENDED_MIN_LENGTH && length <= META_DESCRIPTION_MAX_LENGTH ) {
		return "#7ad03a";
	}
	return "#ee7c1b";
};
