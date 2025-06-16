import { useCallback, useMemo, useState } from "@wordpress/element";
import useSelectRedirects from "./use-select-redirects";
import useDispatchRedirects from "./use-dispatch-redirects";
import useGetRedirects from "./use-get-redirects";
import { ASC, DESC } from "../constants";
import { __ } from "@wordpress/i18n";

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
		deleteRedirectAsync,
		fetchRedirects,
		addNotification,
		deleteMultipleRedirectsAsync,
	} = useDispatchRedirects();

	const bulkAction = useSelectRedirects( "selectBulkAction" );
	const filterRedirectType = useSelectRedirects( "selectFilterRedirectType" );
	const searchRedirects = useSelectRedirects( "selectSearchRedirects" );
	const selectedRedirects = useSelectRedirects( "selectSelectedRedirects" );
	const status = useSelectRedirects( "selectRedirectsStatus" );
	const allRedirects =	useGetRedirects();
	const [ isDeleteRedirectsLoading, setIsDeleteRedirectsLoading ] = useState( false );

	const [ sortOrder, setSortOrder ] = useState( ASC );
	const filteredRedirects = useMemo( () => {
		return allRedirects.filter( ( r ) => {
			const matchesType = filterRedirectType ? r.type === filterRedirectType : true;
			const matchesSearch = searchRedirects
				? r.origin.includes( searchRedirects ) || r.target.includes( searchRedirects )
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

	const applyBulkAction = useCallback( async( localBulkAction ) => {
		setBulkAction( localBulkAction );

		if ( localBulkAction === "delete" && selectedRedirects.length ) {
			try {
				setIsDeleteRedirectsLoading( true );
				await deleteMultipleRedirectsAsync( selectedRedirects );
				clearSelectedRedirects();
			} catch ( error ) {
				addNotification( {
					id: "bulk-delete-error",
					variant: "error",
					title: `${__( "Something went wrong", "wordpress-seo" )}: ${error.message}`,
				} );
			} finally {
				setIsDeleteRedirectsLoading( false );
			}
		}
	}, [ selectedRedirects, deleteRedirectAsync, clearSelectedRedirects, fetchRedirects, setBulkAction ] );

	const onDelete = useCallback(
		async( id ) => {
			try {
				await deleteRedirectAsync( { origin: id } );
				await fetchRedirects();
				addNotification( {
					variant: "success",
					title: __( "Successfully deleted!", "wordpress-seo" ),
				} );
			} catch ( error ) {
				addNotification( {
					id: "delete-error",
					variant: "error",
					title: `${__( "Failed to delete", "wordpress-seo" )}: ${error.message}`,
				} );
			}
		},
		[ deleteRedirectAsync, fetchRedirects, addNotification ]
	);


	return {
		sortedRedirects,
		selectedRedirects,
		toggleSortOrder,
		sortOrder,
		onDelete,
		status,
		isDeleteRedirectsLoading,
		filters: {
			bulkAction,
			filterRedirectType,
			searchRedirects,
		},
		setters: {
			applyBulkAction,
			setFilterRedirectType,
			setSearchRedirects,
			setSelectedRedirects,
			clearSelectedRedirects,
			toggleSelectRedirect,
		},
	};
};

export  default useRedirectFilters;
