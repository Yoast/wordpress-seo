import { curry } from "lodash";

/**
 *
 * @param {string} namespace Namespace to create on global.
 * @param {Object[]} apis An array of global API objects.
 * @returns {function} Function to register global APIs on namespace.
 */
const registerGlobalAPIs = curry( ( namespace, apis ) => {
	window[ namespace ] = window[ namespace ] || {};
	window[ namespace ] = {
		...window[ namespace ],
		...apis.reduce( ( globals, api ) => ( { ...globals, ...api } ), {} ),
	};
} );

export default registerGlobalAPIs;
