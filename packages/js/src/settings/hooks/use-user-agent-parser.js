import { useMemo } from "@wordpress/element";
import Bowser from "bowser";

/**
 * @returns {Object} The Bowser parsed result object.
 * @see https://lancedikson.github.io/bowser/docs/global.html#ParsedResult
 */
const useUserAgentParser = () => {
	const browser = useMemo( () => Bowser.parse( window?.navigator?.userAgent ), [] );
	return browser;
};

export default useUserAgentParser;
