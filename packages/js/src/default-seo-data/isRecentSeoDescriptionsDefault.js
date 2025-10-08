/**
 * Returns whether or not the recent meta descriptions are default ones.
 *
 * @returns {boolean} Whether or not the recent meta descriptions are default ones.
 */
export default function isRecentSeoDescriptionsDefault() {
	return !! window.wpseoScriptData.recentDefaultSeoDescriptions;
}
