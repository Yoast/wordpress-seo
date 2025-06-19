import { useState, useEffect, useMemo } from "@wordpress/element";

/**
 * Custom hook for paginating an array.
 *
 * @template T
 * @param {T[]} items - The full list of items to paginate.
 * @param {number} itemsPerPage - The number of items to show per page.
 *
 * @returns {{
 *   currentPage: number,
 *   totalPages: number,
 *   visibleItems: T[],
 *   setCurrentPage: (page: number) => void,
 *   goToNextPage: () => void,
 *   goToPreviousPage: () => void,
 * }}
 */
const usePagination = ( items, itemsPerPage = 10 ) => {
	const [ currentPage, setCurrentPage ] = useState( 1 );

	useEffect( () => {
		// Reset to page 1 if items change
		setCurrentPage( 1 );
	}, [ items ] );

	const totalPages = useMemo( () => Math.ceil( items.length / itemsPerPage ), [ items, itemsPerPage ] );

	const visibleItems = useMemo( () => {
		const start = ( currentPage - 1 ) * itemsPerPage;
		return items.slice( start, start + itemsPerPage );
	}, [ items, currentPage, itemsPerPage ] );

	const goToNextPage = () => {
		setCurrentPage( ( prev ) => Math.min( prev + 1, totalPages ) );
	};

	const goToPreviousPage = () => {
		setCurrentPage( ( prev ) => Math.max( prev - 1, 1 ) );
	};

	return {
		currentPage,
		totalPages,
		visibleItems,
		setCurrentPage,
		goToNextPage,
		goToPreviousPage,
	};
};

export default usePagination;
