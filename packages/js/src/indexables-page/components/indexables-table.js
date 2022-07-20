import apiFetch from "@wordpress/api-fetch";

import PropTypes from "prop-types";

import { Button, Table } from "@yoast/ui-library";
import { useState, useEffect, useCallback } from "@wordpress/element";

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
 * A row representing an indexables.
 *
 * @param {object} indexable The indexable.
 * @param {array} keyHeaderMap The key header map count.

 * @returns {WPElement} A table with the indexables.
 */
const IndexableRow = ( { indexable, keyHeaderMap, type } ) => {
	const [ ignored, setignored ] = useState( false );

	const handleIgnore =  useCallback( async( e ) => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/ignore_indexable",
				method: "POST",
				data: { id: e.currentTarget.dataset.indexableid, type: e.currentTarget.dataset.indexabletype },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				setignored( true );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, setignored ] );

	const handleUndo =  useCallback( async( e ) => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/restore_indexable",
				method: "POST",
				data: { id: e.currentTarget.dataset.indexableid, type: e.currentTarget.dataset.indexabletype },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				setignored( false );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, setignored ] );

	return <Table.Row
		key={ `indexable-${ indexable.id }-row` }
	>
		{
			Object.keys( keyHeaderMap ).map( ( key, index ) => {
				if ( key === "edit" ) {
					return <Table.Cell
						key="edit"
						className={ `${ ignored ? "yst-opacity-25" : "" }` }
					>
						<Button variant="secondary" disabled={ ignored } data-id={ indexable.id }>Edit</Button>
					</Table.Cell>;
				} else if ( key === "ignore" ) {
					return ignored
						? <Table.Cell key="undo"><Button variant="error" data-indexableid={ indexable.id } data-indexabletype={ type } onClick={ handleUndo }>Undo</Button></Table.Cell>
						: <Table.Cell key="ignore"><Button variant="error" data-indexableid={ indexable.id } data-indexabletype={ type } onClick={ handleIgnore }>Ignore</Button></Table.Cell>;
				}
				return <Table.Cell className={ `${ ignored ? "yst-opacity-25" : "" }` } key={ `indexable-header-${ index }` }>{ indexable[ key ] }</Table.Cell>;
			} )
		}
	</Table.Row>;
};

IndexableRow.propTypes = {
	indexable: PropTypes.object,
	keyHeaderMap: PropTypes.object,
	type: PropTypes.string,
};

/**
 * A table with indexables.
 *
 * @param {array} indexables Theindexables.
 * @param {array} keyHeaderMap The key header map count.

 * @returns {WPElement} A table with the indexables.
 */
function IndexablesTable( { indexables, keyHeaderMap, type } ) {
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		if ( indexables.length > 0 ) {
			setIsLoading( false );
		}
	}, [ indexables, setIsLoading ] );

	console.log("dio", indexables, type)

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
									return <IndexableRow
										key={ `indexable-${ indexable.id }-row` }
										indexable={ indexable }
										keyHeaderMap={ keyHeaderMap }
										type={ type }
									/>;
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
