import { useCallback, useMemo, useState } from "@wordpress/element";
import useSelectRedirects from "./use-select-redirects";
import useDispatchRedirects from "./use-dispatch-redirects";
import useGetRedirects from "./use-get-redirects";
import { ASC, DESC } from "../constants";

/**
 * Custom hook to manage redirect filters state and setters.
 *
 * @returns {{
*   filters: {
*     bulkAction,
*     filterRedirectType,
*     searchRedirects,
*   },
*   setters: {
*     setBulkAction: (value) => void,
*     setFilterRedirectType: (value) => void,
*     setSearchRedirects: (value) => void,
*   }
* }} Redirect filter values and update functions.
*/
const useRedirectFilters = () => {
	const {
		setBulkAction,
		setFilterRedirectType,
		setSearchRedirects,
		setSelectedRedirects,
		toggleSelectRedirect,
		clearSelectedRedirects,
	} = useDispatchRedirects();

	const bulkAction = useSelectRedirects( "selectBulkAction" );
	const filterRedirectType = useSelectRedirects( "selectFilterRedirectType" );
	const searchRedirects = useSelectRedirects( "selectSearchRedirects" );
	const selectedRedirects = useSelectRedirects( "selectSelectedRedirects" );
	const allRedirects = useGetRedirects();

	const [ sortOrder, setSortOrder ] = useState( ASC );

	const filteredRedirects = useMemo( () => {
		return allRedirects.filter( ( r ) => {
			const matchesType = filterRedirectType ? r.type === filterRedirectType : true;
			const matchesSearch = searchRedirects
				? r.oldUrl.includes( searchRedirects ) || r.newUrl.includes( searchRedirects )
				: true;
			return matchesType && matchesSearch;
		} );
	}, [ allRedirects, filterRedirectType, searchRedirects ] );

	const toggleSortOrder = useCallback( () => {
		setSortOrder( ( prev ) => ( prev === ASC ? DESC : ASC ) );
	}, [] );

	const sortedRedirects = useMemo( () => {
		return [ ...filteredRedirects ].sort( ( a, b ) => {
			if ( a.type < b.type ) {
				return sortOrder === ASC ? -1 : 1;
			}
			if ( a.type > b.type ) {
				return sortOrder === ASC ? 1 : -1;
			}
			return 0;
		} );
	}, [ filteredRedirects, sortOrder ] );

	return {
		sortedRedirects,
		selectedRedirects,
		toggleSortOrder,
		sortOrder,
		filters: {
			bulkAction,
			filterRedirectType,
			searchRedirects,
		},
		setters: {
			setBulkAction,
			setFilterRedirectType,
			setSearchRedirects,
			setSelectedRedirects,
			clearSelectedRedirects,
			toggleSelectRedirect,
		},
	};
};

export  default useRedirectFilters;
