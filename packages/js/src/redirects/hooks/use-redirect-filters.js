import useSelectRedirects from "./use-select-redirects";
import useDispatchRedirects from "./use-dispatch-redirects";

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
	} = useDispatchRedirects();

	const bulkAction = useSelectRedirects( "selectBulkAction" );
	const filterRedirectType = useSelectRedirects( "selectFilterRedirectType" );
	const searchRedirects = useSelectRedirects( "selectSearchRedirects" );

	return {
		filters: {
			bulkAction,
			filterRedirectType,
			searchRedirects,
		},
		setters: {
			setBulkAction,
			setFilterRedirectType,
			setSearchRedirects,
		},
	};
};

export  default useRedirectFilters;
