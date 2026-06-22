import { __ } from "@wordpress/i18n";
import { SkeletonLoader, Table } from "@yoast/ui-library";
import { PAGE_SIZE } from "../../constants";
import { BulkEditorRow } from "./table-row";

/**
 * The placeholder rows shown while data is loading.
 *
 * @param {Object} props             The props.
 * @param {number} props.columnCount The number of cells per row.
 *
 * @returns {JSX.Element} The skeleton rows.
 */
const SkeletonRows = ( { columnCount } ) => (
	<>
		{ Array.from( { length: PAGE_SIZE }, ( _row, rowIndex ) => (
			<Table.Row key={ `skeleton-${ rowIndex }` }>
				{ Array.from( { length: columnCount }, ( _cell, cellIndex ) => (
					<Table.Cell key={ `skeleton-${ rowIndex }-${ cellIndex }` }>
						<span aria-hidden="true">
							<SkeletonLoader className="yst-w-full">&nbsp;</SkeletonLoader>
						</span>
					</Table.Cell>
				) ) }
			</Table.Row>
		) ) }
	</>
);

/**
 * The table body: skeleton rows while loading, an empty state, or the content rows.
 *
 * @param {Object}              props             The props.
 * @param {BulkEditorItem[]}    props.items       The items to render.
 * @param {FieldSetField[]}     props.fields      The active field set's editable columns.
 * @param {number}              props.columnCount The total number of columns.
 * @param {BulkEditorSelection} props.selection   The selection props.
 * @param {BulkEditorEditing}   props.editing     The inline-edit props.
 * @param {boolean}             props.isLoading   Whether to render skeleton rows.
 *
 * @returns {JSX.Element} The body rows.
 */
export const BulkEditorBody = ( { items, fields, columnCount, selection, editing, isLoading } ) => {
	const { selectedIds, onToggleRow } = selection;

	if ( isLoading && items.length === 0 ) {
		return <SkeletonRows columnCount={ columnCount } />;
	}

	if ( items.length === 0 ) {
		return (
			<Table.Row>
				<Table.Cell colSpan={ columnCount } className="yst-text-center yst-text-slate-500">
					{ __( "No content found.", "wordpress-seo" ) }
				</Table.Cell>
			</Table.Row>
		);
	}

	return items.map( ( item ) => (
		<BulkEditorRow
			key={ item.id }
			item={ item }
			fields={ fields }
			isSelected={ selectedIds.includes( item.id ) }
			onToggleRow={ onToggleRow }
			edit={ editing.editingRows[ item.id ] }
			editing={ editing }
		/>
	) );
};
