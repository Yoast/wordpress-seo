import { defaultsDeep } from "lodash-es";
import getLanguage from "./../../helpers/getLanguage";
import defaultConfig from "./default";
import it from "./it";
import ru from "./ru";
import pl from "./pl";

const configurations = {
	it: it,
	ru: ru,
	pl: pl,
};

/**
 * Returns a combined config for YoastSEO.js
 *
 * @param {string} locale The locale to retrieve the config for.
 *
 * @returns {Object} The configuration object.
 */
export default function( locale ) {
	const language = getLanguage( locale );
	if ( configurations.hasOwnProperty( language ) ) {
		return defaultsDeep( configurations[ language ], defaultConfig );
	}

	return defaultConfig;
}
