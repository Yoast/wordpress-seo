import { useMemo } from "@wordpress/element";

/**
 * Detects the platform type and the operating system from a user agent.
 *
 * Only distinguishes what the settings need: desktop versus other platforms, and macOS versus other systems.
 *
 * @param {string} userAgent The user agent.
 *
 * @returns {{platform: {type: string}, os: {name: string}}} The platform type ("desktop" or "mobile") and the OS name ("macOS" or "").
 */
const parseUserAgent = ( userAgent ) => {
	const isMobile = /Mobi|Android|iPhone|iPad|iPod|FxiOS|Silk|Tablet(?! PC)/i.test( userAgent );
	const isMac = ! isMobile && /Macintosh|Mac OS X/.test( userAgent );

	return {
		platform: { type: isMobile ? "mobile" : "desktop" },
		os: { name: isMac ? "macOS" : "" },
	};
};

/**
 * @returns {{platform: {type: string}, os: {name: string}}} The platform type ("desktop" or "mobile") and the OS name ("macOS" or "").
 */
const useParsedUserAgent = () => useMemo( () => parseUserAgent( window.navigator.userAgent ), [] );

export default useParsedUserAgent;
