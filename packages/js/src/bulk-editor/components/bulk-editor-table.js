import CheckIcon from "@heroicons/react/outline/CheckIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, SkeletonLoader, Table, Textarea } from "@yoast/ui-library";
import { noop } from "lodash";
import { PAGE_SIZE } from "../constants";

/**
 * The bulk editor selection.
 *
 * @typedef {Object} BulkEditorSelection
 * @property {number[]}  [selectedIds]   IDs of the selected rows.
 * @property {boolean}   [isAllSelected] Whether the header "select all" checkbox is checked.
 * @property {Function}  [onToggleRow]   Called with a row id when its checkbox is toggled.
 * @property {Function}  [onToggleAll]   Called when the header "select all" checkbox is toggled.
 */
/**
 * The bulk editor inline-edit seam. Editing is per field and several rows can edit at once: a row's Edit opens
 * its field-set fields, and each open field is applied (saved on its own) or discarded independently.
 *
 * @typedef {Object} BulkEditorEditing
 * @property {Object}   [editingRows]    Edit state keyed by row id: `{ [id]: { openFields, draft, savingField } }`.
 * @property {Function} [onStartEdit]    Called with a row id to enter edit mode.
 * @property {Function} [onChangeField]  Called with `{ id, key, value }` when a field changes.
 * @property {Function} [onApplyField]   Called with `{ id, key }` to save that field.
 * @property {Function} [onDiscardField] Called with `{ id, key }` to discard that field's changes.
 */
/**
 * Maps a post status to a label, or "" for published (no label shown).
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
 * The fixed columns (select + title + focus keyphrase + actions).
 *
 * @param {FieldSetField[]} fields The active field set's editable columns.
 *
 * @returns {number} The total number of columns, used for full-width rows (loading/empty).
 */
const getColumnCount = ( fields ) => 4 + fields.length;

// The edit state for a row that is not being edited (no open fields, empty draft, nothing saving).
const EMPTY_ROW_EDIT = { openFields: [], draft: {}, savingField: null };

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
	const { isAllSelected, onToggleAll } = selection;

	return (
		<Table.Head>
			<Table.Row>
				<Table.Cell colSpan={ columnCount } className="yst-bg-slate-50 yst-rounded-ss-lg yst-rounded-se-lg">
					<Checkbox
						id="bulk-editor-select-all"
						name="bulk-editor-select-all"
						value="all"
						aria-label={ __( "Select all", "wordpress-seo" ) }
						checked={ isAllSelected }
						onChange={ onToggleAll }
						disabled={ isLoading }
					/>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Header scope="col" className="yst-w-0">
					{ /* The row checkbox column: no visible header, named for assistive tech only. */ }
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
 * The title cell (the row header).
 *
 * @param {Object}        props     The props.
 * @param {BulkEditorRow} props.row The row data.
 *
 * @returns {JSX.Element} The title cell.
 */
const TitleCell = ( { row } ) => {
	const statusLabel = getStatusLabel( row.status );

	return (
		<Table.Header scope="row" className="yst-font-normal yst-text-left">
			<div className="yst-flex yst-flex-col">
				<span>{ row.title }</span>
				{ statusLabel && (
					<span className="yst-mt-1 yst-font-normal yst-text-slate-500">{ `- ${ statusLabel }` }</span>
				) }
			</div>
		</Table.Header>
	);
};

/**
 * An open field cell: the input plus its Apply and Discard actions. Each field is saved or discarded on its own.
 *
 * @param {Object}        props           The props.
 * @param {FieldSetField} props.field     The field this cell edits.
 * @param {number}        props.rowId     The row id, to keep the input id unique across rows.
 * @param {string}        props.rowTitle  The row title, for the accessible names.
 * @param {string}        props.value     The current draft value.
 * @param {boolean}       props.isSaving  Whether this field is being saved (disables the controls).
 * @param {Function}      props.onChange  Called with { key, value } when the value changes.
 * @param {Function}      props.onApply   Called with the field key to save it.
 * @param {Function}      props.onDiscard Called with the field key to discard its changes.
 *
 * @returns {JSX.Element} The cell.
 */
const EditableFieldCell = ( { field, rowId, rowTitle, value, isSaving, onChange, onApply, onDiscard } ) => {
	const handleChange = useCallback( ( event ) => onChange( { key: field.key, value: event.target.value } ), [ onChange, field.key ] );
	const handleApply = useCallback( () => onApply( field.key ), [ onApply, field.key ] );
	const handleDiscard = useCallback( () => onDiscard( field.key ), [ onDiscard, field.key ] );

	return (
		<Table.Cell>
			<div className="yst-flex yst-flex-col yst-gap-2">
				{ /* Two lines so the full value is visible without a scrollbar, per the design. */ }
				<Textarea
					id={ `bulk-editor-edit-${ rowId }-${ field.key }` }
					rows={ 2 }
					value={ value }
					onChange={ handleChange }
					disabled={ isSaving }
					className="yst-resize-none"
					/* translators: %1$s expands to the field label, %2$s to the content item title. */
					aria-label={ sprintf( __( "%1$s for %2$s", "wordpress-seo" ), field.label, rowTitle ) }
				/>
				<div className="yst-flex yst-gap-2">
					<Button
						variant="secondary"
						size="small"
						onClick={ handleApply }
						disabled={ isSaving }
						/* translators: %1$s expands to the field label, %2$s to the content item title. */
						aria-label={ sprintf( __( "Apply %1$s for %2$s", "wordpress-seo" ), field.label, rowTitle ) }
					>
						<CheckIcon className="yst-h-4 yst-w-4 yst-text-green-500" aria-hidden="true" />
						{ __( "Apply", "wordpress-seo" ) }
					</Button>
					<Button
						variant="secondary"
						size="small"
						onClick={ handleDiscard }
						disabled={ isSaving }
						/* translators: %1$s expands to the field label, %2$s to the content item title. */
						aria-label={ sprintf( __( "Discard %1$s for %2$s", "wordpress-seo" ), field.label, rowTitle ) }
					>
						<XIcon className="yst-h-4 yst-w-4 yst-text-red-500" aria-hidden="true" />
						{ __( "Discard", "wordpress-seo" ) }
					</Button>
				</div>
			</div>
		</Table.Cell>
	);
};

/**
 * A content row. Each field-set cell renders as plain text, or — when the row is in edit mode and the field is
 * open — as an editable cell with its own Apply/Discard.
 *
 * @param {Object}            props             The props.
 * @param {BulkEditorRow}     props.row         The row data.
 * @param {FieldSetField[]}   props.fields      The active field set's editable columns.
 * @param {boolean}           props.isSelected  Whether this row is selected.
 * @param {boolean}           props.isEditDisabled Whether the Edit action is disabled (a row is being edited).
 * @param {string[]}          props.openFields  The field keys open as inputs in this row (empty unless editing).
 * @param {Object}            props.draft       The open fields' draft values.
 * @param {string|null}       props.savingField The field key currently saving.
 * @param {Function}          props.onToggleRow   Called with the row id when its checkbox is toggled.
 * @param {Function}          props.onStartEdit   Called with the row id to enter edit mode.
 * @param {Function}          props.onChangeField Called with { id, key, value } when an open field changes.
 * @param {Function}          props.onApplyField  Called with { id, key } to save a field.
 * @param {Function}          props.onDiscardField Called with { id, key } to discard a field.
 *
 * @returns {JSX.Element} The row.
 */
const BulkEditorRow = ( {
	row,
	fields,
	isSelected,
	isEditDisabled,
	openFields,
	draft,
	savingField,
	onToggleRow,
	onStartEdit,
	onChangeField,
	onApplyField,
	onDiscardField,
} ) => {
	const handleToggle = useCallback( () => onToggleRow( row.id ), [ onToggleRow, row.id ] );
	const handleEdit = useCallback( () => onStartEdit( row.id ), [ onStartEdit, row.id ] );
	// Pass the row id to the handlers, so the store can track the edit state for this row.
	const handleChangeField = useCallback( ( { key, value } ) => onChangeField( { id: row.id, key, value } ), [ onChangeField, row.id ] );
	const handleApplyField = useCallback( ( key ) => onApplyField( { id: row.id, key } ), [ onApplyField, row.id ] );
	const handleDiscardField = useCallback( ( key ) => onDiscardField( { id: row.id, key } ), [ onDiscardField, row.id ] );

	return (
		<Table.Row>
			<Table.Cell>
				<Checkbox
					id={ `bulk-editor-select-${ row.id }` }
					name={ `bulk-editor-select-${ row.id }` }
					value={ String( row.id ) }
					className="yst-mt-0.5"
					/* translators: %s expands to the content item title. */
					aria-label={ sprintf( __( "Select %s", "wordpress-seo" ), row.title ) }
					checked={ isSelected }
					onChange={ handleToggle }
				/>
			</Table.Cell>
			<TitleCell row={ row } />
			<Table.Cell>{ row.focusKeyphrase }</Table.Cell>
			{ fields.map( ( field ) => ( openFields.includes( field.key )
				? (
					<EditableFieldCell
						key={ field.key }
						field={ field }
						rowId={ row.id }
						rowTitle={ row.title }
						value={ draft[ field.key ] ?? "" }
						isSaving={ savingField === field.key }
						onChange={ handleChangeField }
						onApply={ handleApplyField }
						onDiscard={ handleDiscardField }
					/>
				)
				: <Table.Cell key={ field.key }>{ row[ field.key ] }</Table.Cell>
			) ) }
			<Table.Cell>
				<Button
					variant="tertiary"
					size="small"
					onClick={ handleEdit }
					disabled={ isEditDisabled }
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
 * @param {BulkEditorEditing}   props.editing     The inline-edit seam.
 * @param {boolean}             props.isLoading   Whether to render skeleton rows.
 *
 * @returns {JSX.Element} The body rows.
 */
const BulkEditorBody = ( { rows, fields, columnCount, selection, editing, isLoading } ) => {
	const { selectedIds, onToggleRow } = selection;
	const { editingRows, onStartEdit, onChangeField, onApplyField, onDiscardField } = editing;

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

	return rows.map( ( row ) => {
		// Each row carries its own edit state; rows absent from `editingRows` render read-only.
		const isEditing = Boolean( editingRows[ row.id ] );
		const rowEdit = editingRows[ row.id ] ?? EMPTY_ROW_EDIT;

		return (
			<BulkEditorRow
				key={ row.id }
				row={ row }
				fields={ fields }
				isSelected={ selectedIds.includes( row.id ) }
				isEditDisabled={ isEditing }
				openFields={ rowEdit.openFields }
				draft={ rowEdit.draft }
				savingField={ rowEdit.savingField }
				onToggleRow={ onToggleRow }
				onStartEdit={ onStartEdit }
				onChangeField={ onChangeField }
				onApplyField={ onApplyField }
				onDiscardField={ onDiscardField }
			/>
		);
	} );
};

/**
 * The bulk editor data table.
 *
 * It renders the rows it is given for the active field set (the Search or Social tab). Selection and inline
 * editing are seams: this component is presentational and drives them through the `selection` and `editing` bags.
 *
 * @param {Object}              props             The props.
 * @param {BulkEditorRow[]}     props.rows        The rows to render.
 * @param {FieldSet}            props.fieldSet    The active field set (its `fields` drive the editable columns).
 * @param {BulkEditorSelection} [props.selection] The selection seam.
 * @param {BulkEditorEditing}   [props.editing]   The inline-edit seam.
 * @param {boolean}             [props.isLoading] Whether to render skeleton rows instead of data.
 *
 * @returns {JSX.Element} The table.
 */
export const BulkEditorTable = ( { rows, fieldSet, selection = {}, editing = {}, isLoading = false } ) => {
	const columnCount = getColumnCount( fieldSet.fields );
	// Pass the seam handlers as props, so the sub-components can read them without per-field defaults.
	const selectionState = { selectedIds: [], isAllSelected: false, onToggleRow: noop, onToggleAll: noop, ...selection };
	const editingState = {
		editingRows: {},
		onStartEdit: noop,
		onChangeField: noop,
		onApplyField: noop,
		onDiscardField: noop,
		...editing,
	};

	return (
		<>
			{ /* Announces the loading state to assistive tech (the skeleton itself is aria-hidden). */ }
			<div role="status" className="yst-sr-only">
				{ isLoading ? __( "Loading content…", "wordpress-seo" ) : "" }
			</div>
			<Table aria-label={ fieldSet.label } aria-busy={ isLoading } className="[&_td]:yst-align-top [&_th]:yst-align-top">
				<BulkEditorHeader fields={ fieldSet.fields } columnCount={ columnCount } selection={ selectionState } isLoading={ isLoading } />
				<Table.Body>
					<BulkEditorBody
						rows={ rows }
						fields={ fieldSet.fields }
						columnCount={ columnCount }
						selection={ selectionState }
						editing={ editingState }
						isLoading={ isLoading }
					/>
				</Table.Body>
			</Table>
		</>
	);
};
