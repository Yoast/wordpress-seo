/* global globalThis */
import { curry, defaultsDeep } from "lodash";

/**
 * @param {string} namespace Namespace to create on the global.
 * @param {Object} apis The APIs to add to the global namespace.
 * @returns {function} Function to register global APIs on a namespace.
 */
const registerGlobalApis = curry( ( namespace, apis ) => {
	globalThis[ namespace ] = defaultsDeep( globalThis[ namespace ] || {}, apis );
} );

export default registerGlobalApis;
