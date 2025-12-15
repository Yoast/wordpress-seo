/**
 * WordPress admin color schemes submenu background colors.
 */
const COLOR_SCHEME_BACKGROUNDS = {
	fresh: "#2c3338",
	light: "#fff",
	modern: "#1e1e1e",
	blue: "#4796b3",
	coffee: "#46403c",
	ectoplasm: "#413256",
	midnight: "#26292c",
	ocean: "#627c83",
	sunrise: "#be3631",
};

/**
 * Default color scheme used when none is detected.
 */
const DEFAULT_COLOR_SCHEME = "fresh";

/**
 * Extracts the WordPress admin color scheme from the body class names.
 *
 * @param {string} bodyClassName The body element's className string.
 *
 * @returns {string} The detected color scheme name, or "fresh" (default) if not found.
 */
export function getColorSchemeFromBodyClass( bodyClassName ) {
	if ( typeof bodyClassName !== "string" ) {
		return DEFAULT_COLOR_SCHEME;
	}
	const match = bodyClassName.match( /admin-color-(\w+)/ );
	return match ? match[ 1 ] : DEFAULT_COLOR_SCHEME;
}

/**
 * Gets the submenu background color for the WordPress admin color scheme.
 *
 * @param {string} colorScheme The color scheme name.
 *
 * @returns {string} The hex color code for the submenu background.
 */
export function getColorSchemeBackground( colorScheme ) {
	return COLOR_SCHEME_BACKGROUNDS[ colorScheme ] || COLOR_SCHEME_BACKGROUNDS[ DEFAULT_COLOR_SCHEME ];
}

/**
 * Gets the submenu background color based on the body class names.
 *
 * @param {string} bodyClassName The body element's className string.
 *
 * @returns {string} The hex color code for the submenu background.
 */
export function getAdminSubmenuBackground( bodyClassName ) {
	const colorScheme = getColorSchemeFromBodyClass( bodyClassName );
	return getColorSchemeBackground( colorScheme );
}
