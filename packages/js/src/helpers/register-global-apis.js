import { curry } from "lodash";

/**
 * Registers global APIs within a namespace.
 *
 * @param {string} namespace Namespace to create on global.
 * @param {Object.<string, function>[]} apis An array of global API objects.
 *
 * @returns {function} Function to register global APIs on namespace.
 */
const registerGlobalApis = curry( ( namespace, apis ) => {
	window[ namespace ] = window[ namespace ] || {};
	window[ namespace ] = {
		...window[ namespace ],
		...apis.reduce( ( globals, api ) => ( { ...globals, ...api } ), {} ),
	};
} );

export default registerGlobalApis;
