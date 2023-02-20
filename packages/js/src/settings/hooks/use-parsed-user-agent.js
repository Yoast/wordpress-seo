import { useMemo } from "@wordpress/element";
import Bowser from "bowser";

/**
 * @returns {Object} The Bowser parsed result object.
 * @see https://lancedikson.github.io/bowser/docs/global.html#ParsedResult
 */
const useParsedUserAgent = () => {
	const parsedUserAgent = useMemo( () => Bowser.parse( window?.navigator?.userAgent ), [] );
	return parsedUserAgent;
};

export default useParsedUserAgent;
