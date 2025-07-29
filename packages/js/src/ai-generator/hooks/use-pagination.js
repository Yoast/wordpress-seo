import { useCallback, useMemo, useState } from "@wordpress/element";
import { slice } from "lodash";

/**
 * @param {number} totalItems The total number of items to paginate for.
 * @param {number} perPage How many items per page.
 * @returns {Object} Pagination data and actions.
 */
export const usePagination = ( { totalItems = 0, perPage = 5 } ) => {
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const totalPages = useMemo( () => Math.ceil( totalItems / perPage ), [ totalItems, perPage ] );
	const lastOnPage = useMemo( () => currentPage * perPage, [ currentPage, perPage ] );
	const firstOnPage = useMemo( () => lastOnPage - perPage, [ lastOnPage, perPage ] );
	const isOnFirstPage = useMemo( () => currentPage === 1, [ currentPage ] );
	const isOnLastPage = useMemo( () => currentPage === totalPages, [ currentPage, totalPages ] );

	const previousPage = useCallback( () => {
		if ( currentPage > 1 ) {
			setCurrentPage( currentPage - 1 );
		}
	}, [ currentPage, setCurrentPage ] );
	const nextPage = useCallback( () => {
		if ( currentPage < totalPages ) {
			setCurrentPage( currentPage + 1 );
		}
	}, [ currentPage, setCurrentPage, totalPages ] );

	const getItemsOnCurrentPage = useCallback( ( items ) => slice( items, firstOnPage, lastOnPage ), [ firstOnPage, lastOnPage ] );

	return {
		currentPage,
		setCurrentPage,
		totalPages,
		isOnFirstPage,
		isOnLastPage,
		previousPage,
		nextPage,
		firstOnPage,
		lastOnPage,
		getItemsOnCurrentPage,
	};
};
