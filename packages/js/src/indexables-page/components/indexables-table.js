import apiFetch from "@wordpress/api-fetch";

import PropTypes from "prop-types";

import { makeOutboundLink } from "@yoast/helpers";
import { Button, Table } from "@yoast/ui-library";
import { useState, useEffect, useCallback } from "@wordpress/element";

const Link = makeOutboundLink();
/**
 * Renders placeholders rows while loading the indexables table.
 *
 * @param {int} conlumnCount The table's number of columns.
 * @returns {WPElement} Placeholders rows.
 */
function PlaceholderRows( { columnCount } ) {
	const cells = [];
	const rows = [];
	for ( let i = 0; i < columnCount; i++ ) {
		cells.push( <Table.Cell key={ `placeholder-column-${ i }` } className="yst-px-6 yst-py-4 yst-animate-pulse"><div className="yst-w-full yst-bg-gray-200 yst-h-3 yst-rounded" /></Table.Cell> );
	}
	for ( let i = 0; i < 5; i++ ) {
		rows.push( <Table.Row key={ `placeholder-row-${ i }` }>{ cells }</Table.Row> );
	}
	return rows;
}

/**
 * A table with indexables.
 *
 * @param {array}  indexables Theindexables.
 * @param {Object} keyHeaderMap The key header map count.

 * @returns {WPElement} A table with the indexables.
 */
function IndexablesTable( { indexables, keyHeaderMap, type } ) {
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		if ( indexables.length > 0 ) {
			setIsLoading( false );
		}
	}, [ indexables ] );

	const handleIgnore =  useCallback( async( e ) => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/ignore_indexable",
				method: "POST",
				data: { id: e.currentTarget.dataset.indexableid, type: e.currentTarget.dataset.indexabletype },
			} );

			/* eslint-disable-next-line no-unused-vars */
			const parsedResponse = await response.json;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch ] );

	return (
		<>
			<div className="yst-relative yst-overflow-x-scroll yst-border yst-border-gray-200 yst-shadow-sm yst-rounded-lg">
				<Table>
					<Table.Head>
						<Table.Row>
							{
								Object.values( keyHeaderMap ).map( ( header, index ) => {
									return <Table.Header key={ `indexable-header-${ index }` }>{ header }</Table.Header>;
								} )
							}
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{
							isLoading
								? <PlaceholderRows columnCount={ Object.keys( keyHeaderMap ).length } />
								: indexables.map( ( indexable ) => {
									return <Table.Row
										key={ `indexable-${ indexable.id }-row` }
									>
										{
											Object.keys( keyHeaderMap ).map( ( key, index ) => {
												if ( key === "edit" ) {
													return <Table.Cell key="edit">
														<Link
															href={ '/wp-admin/post.php?action=edit&post=' + indexable.object_id }
															className="yst-button yst-button--secondary yst-text-gray-500"
														>Edit</Link>
													</Table.Cell>;
												} else if ( key === "ignore" ) {
													return <Table.Cell key="ignore"><Button variant="error" data-indexableid={ indexable.id } data-indexabletype={ type } onClick={ handleIgnore }>Ignore</Button></Table.Cell>;
												}
												return <Table.Cell key={ `indexable-header-${ index }` }>{ indexable[ key ] }</Table.Cell>;
											} )
										}
									</Table.Row>;
								} )
						}
					</Table.Body>
				</Table>
			</div>
		</>
	);
}

IndexablesTable.propTypes = {
	indexables: PropTypes.array,
	keyHeaderMap: PropTypes.object,
	type: PropTypes.string,
};

export default IndexablesTable;
