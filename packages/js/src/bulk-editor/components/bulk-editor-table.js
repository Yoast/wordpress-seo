import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, SkeletonLoader, Table } from "@yoast/ui-library";
import { noop } from "lodash";
import { PAGE_SIZE } from "../constants";

/**
 * The selection seam, owned by Free-FE 9. Shaped to match a selection hook's return value so it can be passed
 * straight through. All members are optional here so Free-FE 4 renders the affordances without the behavior.
 *
 * @typedef {Object} BulkEditorSelection
 * @property {number[]}  [selectedIds]   IDs of the selected rows.
 * @property {boolean}   [isAllSelected] Whether the header "select all" checkbox is checked.
 * @property {Function}  [onToggleRow]   Called with a row id when its checkbox is toggled.
 * @property {Function}  [onToggleAll]   Called when the header "select all" checkbox is toggled.
 */
/**
 * Maps a post status to a human-readable label, or "" for published (no label shown).
 *
 * @param {string} status The post status.
 *
 * @returns {string} The label, or "" when nothing should be shown.
 */
const getStatusLabel = ( status ) => {
	switch ( status ) {
		case "draft":
			return __( "Draft", "wordpress-seo" );
		case "pending":
			return __( "Pending", "wordpress-seo" );
		case "future":
			return __( "Scheduled", "wordpress-seo" );
		default:
			return "";
	}
};

/**
 * The fixed columns (select + title + focus keyphrase + actions) around the field-set columns.
 *
 * @param {FieldSetField[]} fields The active field set's editable columns.
 *
 * @returns {number} The total number of columns, used for full-width rows (loading/empty).
 */
const getColumnCount = ( fields ) => 4 + fields.length;

/**
 * The table header: the multi-select toolbar row and the column header row.
 *
 * @param {Object}              props             The props.
 * @param {FieldSetField[]}     props.fields      The active field set's editable columns.
 * @param {number}              props.columnCount The total number of columns.
 * @param {BulkEditorSelection} props.selection   The selection seam.
 * @param {boolean}             props.isLoading   Whether the table is loading (disables "select all").
 *
 * @returns {JSX.Element} The header.
 */
const BulkEditorHeader = ( { fields, columnCount, selection, isLoading } ) => {
	const { isAllSelected = false, onToggleAll = noop } = selection;

	return (
		<Table.Head>
			{ /* The multi-select toolbar, per the design: Free-FE 9 adds the Select menu here, Free-FE 7 the Filters button. */ }
			<Table.Row>
				<Table.Cell colSpan={ columnCount } className="yst-bg-slate-50 yst-rounded-ss-lg yst-rounded-se-lg">
					<Checkbox
						id="bulk-editor-select-all"
						name="bulk-editor-select-all"
						value="all"
						aria-label={ __( "Select all pages", "wordpress-seo" ) }
						checked={ isAllSelected }
						onChange={ onToggleAll }
						disabled={ isLoading }
					/>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Header scope="col" className="yst-w-0">
					{ /* The row checkbox column: no visible header in the design, named for assistive tech only. */ }
					<span className="yst-sr-only">{ __( "Select", "wordpress-seo" ) }</span>
				</Table.Header>
				<Table.Header scope="col">{ __( "Title", "wordpress-seo" ) }</Table.Header>
				<Table.Header scope="col">{ __( "Focus keyphrase", "wordpress-seo" ) }</Table.Header>
				{ fields.map( ( field ) => (
					<Table.Header key={ field.key } scope="col">{ field.label }</Table.Header>
				) ) }
				<Table.Header scope="col">{ __( "Actions", "wordpress-seo" ) }</Table.Header>
			</Table.Row>
		</Table.Head>
	);
};

/**
 * A single content row.
 *
 * @param {Object}          props             The props.
 * @param {BulkEditorRow}   props.row         The row data.
 * @param {FieldSetField[]} props.fields      The active field set's editable columns.
 * @param {boolean}         props.isSelected  Whether this row is selected.
 * @param {Function}        props.onToggleRow Called with the row id when its checkbox is toggled.
 * @param {Function}        props.onEdit      Called with the row id when its Edit action is triggered.
 *
 * @returns {JSX.Element} The row.
 */
const BulkEditorRow = ( { row, fields, isSelected, onToggleRow, onEdit } ) => {
	const handleToggle = useCallback( () => onToggleRow( row.id ), [ onToggleRow, row.id ] );
	const handleEdit = useCallback( () => onEdit( row.id ), [ onEdit, row.id ] );
	const statusLabel = getStatusLabel( row.status );

	return (
		<Table.Row>
			<Table.Cell>
				<Checkbox
					id={ `bulk-editor-select-${ row.id }` }
					name={ `bulk-editor-select-${ row.id }` }
					value={ String( row.id ) }
					/* translators: %s expands to the content item title. */
					aria-label={ sprintf( __( "Select %s", "wordpress-seo" ), row.title ) }
					checked={ isSelected }
					onChange={ handleToggle }
				/>
			</Table.Cell>
			<Table.Header scope="row" className="yst-font-normal yst-text-left">
				<div className="yst-flex yst-flex-col">
					<span>{ row.title }</span>
					{ statusLabel && (
						<span className="yst-mt-1 yst-font-normal yst-text-slate-500">{ `- ${ statusLabel }` }</span>
					) }
				</div>
			</Table.Header>
			<Table.Cell>{ row.focusKeyphrase }</Table.Cell>
			{ fields.map( ( field ) => (
				<Table.Cell key={ field.key }>{ row[ field.key ] }</Table.Cell>
			) ) }
			<Table.Cell>
				<Button
					variant="tertiary"
					size="small"
					onClick={ handleEdit }
					/* translators: %s expands to the content item title. */
					aria-label={ sprintf( __( "Edit %s", "wordpress-seo" ), row.title ) }
				>
					{ __( "Edit", "wordpress-seo" ) }
				</Button>
			</Table.Cell>
		</Table.Row>
	);
};

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
						{ /* Hidden from assistive tech: the live status region announces loading instead. */ }
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
 * @param {BulkEditorRow[]}     props.rows        The rows to render.
 * @param {FieldSetField[]}     props.fields      The active field set's editable columns.
 * @param {number}              props.columnCount The total number of columns.
 * @param {BulkEditorSelection} props.selection   The selection seam.
 * @param {Function}            props.onEdit      Called with a row id when its Edit action is triggered.
 * @param {boolean}             props.isLoading   Whether to render skeleton rows.
 *
 * @returns {JSX.Element} The body rows.
 */
const BulkEditorBody = ( { rows, fields, columnCount, selection, onEdit, isLoading } ) => {
	const { selectedIds = [], onToggleRow = noop } = selection;

	if ( isLoading ) {
		return <SkeletonRows columnCount={ columnCount } />;
	}

	if ( rows.length === 0 ) {
		return (
			<Table.Row>
				<Table.Cell colSpan={ columnCount } className="yst-text-center yst-text-slate-500">
					{ __( "No content found.", "wordpress-seo" ) }
				</Table.Cell>
			</Table.Row>
		);
	}

	return rows.map( ( row ) => (
		<BulkEditorRow
			key={ row.id }
			row={ row }
			fields={ fields }
			isSelected={ selectedIds.includes( row.id ) }
			onToggleRow={ onToggleRow }
			onEdit={ onEdit }
		/>
	) );
};

/**
 * The bulk editor data table.
 *
 * Presentational and WordPress-agnostic: it renders the rows it is given for the active field set (the Search
 * or Social tab). Selection (`selection`) and editing (`onEdit`) are seams for Free-FE 9 and Free-FE 5; this
 * issue (Free-FE 4) renders the read-only view, the selection/edit affordances, and the loading and empty
 * states. Sorting is intentionally not implemented here — the new design's header is plain text, so it is
 * deferred until product/design confirm it (see the Free-FE 4 open question).
 *
 * @param {Object}              props             The props.
 * @param {BulkEditorRow[]}     props.rows        The rows to render.
 * @param {FieldSet}            props.fieldSet    The active field set (its `fields` drive the editable columns).
 * @param {BulkEditorSelection} [props.selection] The selection seam (logic lives in Free-FE 9).
 * @param {Function}            [props.onEdit]    Called with a row id when its Edit action is triggered.
 * @param {boolean}             [props.isLoading] Whether to render skeleton rows instead of data.
 *
 * @returns {JSX.Element} The table.
 */
export const BulkEditorTable = ( { rows, fieldSet, selection = {}, onEdit = noop, isLoading = false } ) => {
	const columnCount = getColumnCount( fieldSet.fields );

	return (
		<>
			{ /* Announces the loading state to assistive tech (the skeleton itself is aria-hidden). */ }
			<div role="status" className="yst-sr-only">
				{ isLoading ? __( "Loading content…", "wordpress-seo" ) : "" }
			</div>
			<Table aria-label={ fieldSet.label } aria-busy={ isLoading }>
				<BulkEditorHeader fields={ fieldSet.fields } columnCount={ columnCount } selection={ selection } isLoading={ isLoading } />
				<Table.Body>
					<BulkEditorBody
						rows={ rows }
						fields={ fieldSet.fields }
						columnCount={ columnCount }
						selection={ selection }
						onEdit={ onEdit }
						isLoading={ isLoading }
					/>
				</Table.Body>
			</Table>
		</>
	);
};
