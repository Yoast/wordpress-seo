import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { useState, useCallback } from "@wordpress/element";
import { EyeOffIcon } from "@heroicons/react/outline";

import { Button, Spinner } from "@yoast/ui-library";

/**
 * Renders placeholders rows while loading the indexables table.
 *
 * @param {int} conlumnCount The table's number of columns.
 * @param {int} listSize     The number of indexables in the list.
 *
 * @returns {WPElement} Placeholders rows.
 */
function PlaceholderRows( { columnCount, listSize } ) {
	const cells = [];
	const rows = [];
	for ( let i = 0; i < columnCount; i++ ) {
		cells.push( <div key={ `placeholder-column-${ i }` } className="yst-inline-block yst-animate-pulse"><div className="yst-w-full yst-bg-gray-200 yst-h-3 yst-rounded" /></div> );
	}
	for ( let i = 0; i < listSize; i++ ) {
		rows.push( <li key={ `placeholder-row-${ i }` } className="yst-w-full yst-my-0 yst-h-14 yst-max-w-none yst-grid yst-gap-2 yst-items-center yst-grid-cols-[0.5fr_7.5fr_1fr_2fr_1fr]">{ cells }</li> );
	}
	return rows;
}

/**
 * A row representing an indexables.
 *
 * @param {object}   indexable       The indexable.
 * @param {JSX.node} children        The React children.
 * @param {string}   type            The indexable type.
 * @param {function} addToIgnoreList The indexable type.
 * @param {int}      position        The position of the indexable in the list.
 *
 * @returns {WPElement} A table with the indexables.
 */
const IndexableRow = ( { indexable, children, type, addToIgnoreList, position, setErrorMessage } ) => {
	const [ isHandlingIgnore, setIsHandlingIgnore ] = useState( false );
	const [ rowAnimationClasses, setRowAnimationClasses ] = useState( "" );

	const addToIgnoreListCallback = useCallback( () => {
		addToIgnoreList( { indexable, type, position } );
	}, [ indexable, type, position, addToIgnoreList ] );

	const handleIgnore =  useCallback( async( e ) => {
		setIsHandlingIgnore( true );
		const id = e.currentTarget.dataset.indexableid;
		const indexableType = e.currentTarget.dataset.indexabletype;

		try {
			const response = await apiFetch( {
				path: "yoast/v1/ignore_indexable",
				method: "POST",
				data: { id: id, type: indexableType },
			} );

			const parsedResponse = await response.json;

			if ( parsedResponse.success ) {
				setRowAnimationClasses( "yst-animate-slideRight" );
				return true;
			}
			setErrorMessage( __( "The request has failed.", "wordpress-seo" ) );
			return false;
		} catch ( error ) {
			setIsHandlingIgnore( false );
			setErrorMessage( error.message );
		}
	}, [ apiFetch, addToIgnoreList ] );

	return <li
		key={ `indexable-${ indexable.id }-row` }
		className={ "yst-my-0 yst-max-w-none yst-font-medium yst-text-gray-700 yst-flex yst-flex-row yst-items-center yst-gap-3 yst-h-14 " + rowAnimationClasses }
		onAnimationEnd={ addToIgnoreListCallback }
	>
		{ children }
		<div>
			<Button variant="secondary" data-indexableid={ indexable.id } data-indexabletype={ type } onClick={ handleIgnore } disabled={ isHandlingIgnore }>
				{ isHandlingIgnore ? <Spinner /> : <EyeOffIcon className="yst-w-4 yst-h-4" /> }
			</Button>
		</div>
	</li>;
};

IndexableRow.propTypes = {
	indexable: PropTypes.object,
	type: PropTypes.string,
	addToIgnoreList: PropTypes.func,
	position: PropTypes.number,
	setErrorMessage: PropTypes.func,
	children: PropTypes.node,
};

/**
 * A table with indexables.
 *
 * @param {JSX.node} children The React children.

 * @returns {WPElement} A table with the indexables.
 */
function IndexablesTable( { isLoading, children } ) {
	return (
		<ul className="yst-divide-y yst-divide-gray-200">
			{ isLoading &&
				<PlaceholderRows columnCount={ 5 } listSize={ 5 } />
			}
			{ children }
			{  ( ! isLoading && children.length === 0 ) && "nothing to see here" }
		</ul>
	);
}

IndexablesTable.propTypes = {
	isLoading: PropTypes.bool,
	children: PropTypes.node,
};

IndexablesTable.defaultProps = {
	isLoading: false,
	children: null,
};

IndexablesTable.Row = IndexableRow;

export default IndexablesTable;
