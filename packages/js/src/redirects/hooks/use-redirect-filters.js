import { useCallback, useMemo, useState } from "@wordpress/element";
import useSelectRedirects from "./use-select-redirects";
import useDispatchRedirects from "./use-dispatch-redirects";
import useGetRedirects from "./use-get-redirects";
import { ASC, DESC } from "../constants";
import { __ } from "@wordpress/i18n";

/**
 * useRedirectFilters — Custom React hook to manage and apply filters, sorting, and bulk actions for redirects.
 *
 * This hook handles:
 * - Fetching and filtering redirects by type and search terms.
 * - Sorting filtered redirects.
 * - Managing selected redirects for bulk actions.
 * - Handling deletion of single or multiple redirects.
 * - Managing UI state like loading indicators.
 *
 * @returns {{
*   sortedRedirects: Array<Object>, // Sorted and filtered list of redirects
*   selectedRedirects: Array<string>, // Array of selected redirect IDs
*   toggleSortOrder: () => void, // Function to toggle between ascending and descending sort order
*   sortOrder: string, // Current sort order, either 'asc' or 'desc'
*   onDelete: (id: string) => Promise<void>, // Function to delete a single redirect
*   isLoading: boolean, // Loading for get redirects
*   isDeleteRedirectsLoading: boolean, // Whether a bulk delete operation is in progress
*   filters: {
*     bulkAction: string, // Current selected bulk action
*     filterRedirectType: string|null, // Current redirect type filter
*     searchRedirects: string, // Current search string
*   },
*   setters: {
*     applyBulkAction: (action: string) => Promise<void>, // Applies the selected bulk action (e.g., delete)
*     setFilterRedirectType: (type: string|null) => void, // Sets the redirect type filter
*     setSearchRedirects: (search: string) => void, // Sets the search term
*     setSelectedRedirects: (ids: Array<string>) => void, // Sets the selected redirect IDs
*     clearSelectedRedirects: () => void, // Clears the selected redirects
*     toggleSelectRedirect: (id: string) => void, // Toggles selection for a specific redirect
*   }
* }}
*/
const useRedirectFilters = ( format ) => {
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
	const allRedirects = useGetRedirects( format );
	const [ isDeleteRedirectsLoading, setIsDeleteRedirectsLoading ] = useState( false );
	const [ sortOrder, setSortOrder ] = useState( ASC );

	const isLoading = status !== "success" || isDeleteRedirectsLoading;

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
				await deleteMultipleRedirectsAsync( selectedRedirects, format );
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
	}, [ selectedRedirects, deleteRedirectAsync, clearSelectedRedirects, setBulkAction ] );

	const onDelete = useCallback(
		async( id ) => {
			try {
				await deleteRedirectAsync( { origin: id } );
				await fetchRedirects( format );
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
		isLoading,
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
