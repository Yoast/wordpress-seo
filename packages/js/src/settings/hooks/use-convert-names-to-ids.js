import { useMemo } from "@wordpress/element";
import { reduce } from "lodash";
import { convertNameToId } from "../helpers";

/**
 * @param {string[]} names Names to convert to ids.
 * @param {string} [prefix] Prefix for id.
 * @returns {Object} Ids keyed by name.
 */
const useConvertNamesToIds = ( names, prefix = "field" ) => {
	const ids = useMemo( () => reduce(
		names,
		( acc, name ) => ( {
			...acc,
			[ name ]: `${convertNameToId( name, prefix )}`,
		} ),
		{}
	), [ names ] );

	return ids;
};

export default useConvertNamesToIds;
