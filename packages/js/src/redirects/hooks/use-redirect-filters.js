import useSelectRedirects from "./use-select-redirects";
import useDispatchRedirects from "./use-dispatch-redirects";

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
