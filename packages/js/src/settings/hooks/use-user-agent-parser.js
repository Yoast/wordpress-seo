import { useMemo } from "@wordpress/element";
import Bowser from "bowser";

/**
 * @returns {Object} The browser object.
 * @see https://lancedikson.github.io/bowser/docs/global.html#ParsedResult
 */
const useBrowser = () => {
	const browser = useMemo( () => Bowser.parse( window?.navigator?.userAgent ), [] );
	return browser;
};

export default useBrowser;
