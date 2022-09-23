import { useMemo } from "@wordpress/element";
import { reduce, values } from "lodash";

/**
 * Creates ids and describedBy based on an ID and the given list of "props".
 *
 * This is a helper hook to create IDs and the `aria-describedby` for our form field components.
 *
 * @param {string} id The base ID.
 * @param {Object} list What IDs to create.
 * @returns {{ids: *, describedBy: *}} Object with `ids` and `describedBy`.
 */
const useDescribedBy = ( id, list ) => {
	const ids = useMemo(
		() => reduce(
			list,
			( result, value, key ) => {
				// Don't include an entry for falsy values.
				if ( ! value ) {
					return result;
				}
				result[ key ] = `${ id }__${ key }`;
				return result;
			},
			{} ),
		[ id, list ],
	);
	// Comma separated list, or null to not render the attribute.
	const describedBy = useMemo( () => values( ids ).join( " " ) || null, [ ids ] );

	return {
		ids,
		describedBy,
	};
};

export default useDescribedBy;
