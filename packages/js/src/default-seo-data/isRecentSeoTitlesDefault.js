/**
 * Returns whether or not the recent SEO titles are default ones.
 *
 * @returns {boolean} Whether or not the recent SEO titles are default ones.
 */
export default function isRecentSeoTitlesDefault() {
	return !! window.wpseoScriptData.recentDefaultSeoTitles;
}
