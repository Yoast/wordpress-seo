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
 * @property {number[]}  [selectedIds]   IDs of the selected items.
 * @property {boolean}   [isAllSelected] Whether the header "select all" checkbox is checked.
 * @property {Function}  [onToggleRow]   Called with an item id when its checkbox is toggled.
 * @property {Function}  [onToggleAll]   Called when the header "select all" checkbox is toggled.
 */
/**
 * The bulk editor inline-edit seam. Editing is per field and several rows can edit at once: a row's Edit opens
 * its field-set fields, and each open field is applied (saved on its own) or discarded independently.
 *
 * @typedef {Object} BulkEditorEditing
 * @property {Object}   [editingRows]    Edit state keyed by item id: `{ [id]: { openFields, draft, savingField } }`.
 * @property {Function} [onStartEdit]    Called with an item id to enter edit mode.
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
 * The fixed columns (select + title + actions); the field set supplies the rest, including the focus keyphrase.
 *
 * @param {FieldSetField[]} fields The active field set's editable columns.
 *
 * @returns {number} The total number of columns, used for full-width rows (loading/empty).
 */
const getColumnCount = ( fields ) => 3 + fields.length;

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
				<Table.Header scope="col">
					<span className="yst-sr-only">{ __( "Select", "wordpress-seo" ) }</span>
				</Table.Header>
				<Table.Header scope="col">{ __( "Title", "wordpress-seo" ) }</Table.Header>
				{ fields.map( ( field ) => (
					<Table.Header key={ field.key } scope="col">{ field.label }</Table.Header>
				) ) }
				<Table.Header scope="col"><span className="yst-flex yst-justify-end">{ __( "Actions", "wordpress-seo" ) }</span></Table.Header>
			</Table.Row>
		</Table.Head>
	);
};

/**
 * The title cell (the row header).
 *
 * @param {Object}         props      The props.
 * @param {BulkEditorItem} props.item The item data.
 *
 * @returns {JSX.Element} The title cell.
 */
const TitleCell = ( { item } ) => {
	const statusLabel = getStatusLabel( item.status );

	return (
		<Table.Header scope="row" className="yst-text-left">
			<div className="yst-flex yst-flex-col">
				<span>{ item.title }</span>
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
 * @param {number}        props.itemId    The item id, to keep the input id unique across rows.
 * @param {string}        props.itemTitle The item title, for the accessible names.
 * @param {string}        props.value     The current draft value.
 * @param {boolean}       props.isSaving  Whether this field is being saved (disables the controls).
 * @param {Function}      props.onChange  Called with { key, value } when the value changes.
 * @param {Function}      props.onApply   Called with the field key to save it.
 * @param {Function}      props.onDiscard Called with the field key to discard its changes.
 *
 * @returns {JSX.Element} The cell.
 */
const EditableFieldCell = ( { field, itemId, itemTitle, value, isSaving, onChange, onApply, onDiscard } ) => {
	const handleChange = useCallback( ( event ) => onChange( { key: field.key, value: event.target.value } ), [ onChange, field.key ] );
	const handleApply = useCallback( () => onApply( field.key ), [ onApply, field.key ] );
	const handleDiscard = useCallback( () => onDiscard( field.key ), [ onDiscard, field.key ] );

	return (
		<Table.Cell>
			<div className="yst-flex yst-flex-col yst-gap-2">
				{ /* Two lines so the full value is visible without a scrollbar, per the design. */ }
				<Textarea
					id={ `bulk-editor-edit-${ itemId }-${ field.key }` }
					rows={ 2 }
					value={ value }
					onChange={ handleChange }
					disabled={ isSaving }
					className="yst-resize-none"
					/* translators: %1$s expands to the field label, %2$s to the content item title. */
					aria-label={ sprintf( __( "%1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
				/>
				<div className="yst-flex yst-gap-2">
					<Button
						variant="secondary"
						size="small"
						onClick={ handleApply }
						disabled={ isSaving }
						/* translators: %1$s expands to the field label, %2$s to the content item title. */
						aria-label={ sprintf( __( "Apply %1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
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
						aria-label={ sprintf( __( "Discard %1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
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
 * @param {Object}          props                The props.
 * @param {BulkEditorItem}  props.item           The item data.
 * @param {FieldSetField[]} props.fields         The active field set's editable columns.
 * @param {boolean}         props.isSelected     Whether this item is selected.
 * @param {boolean}         props.isEditDisabled Whether the Edit action is disabled (a row is being edited).
 * @param {string[]}        props.openFields     The field keys open as inputs in this row (empty unless editing).
 * @param {Object}          props.draft          The open fields' draft values.
 * @param {string|null}     props.savingField    The field key currently saving.
 * @param {Function}        props.onToggleRow    Called with the item id when its checkbox is toggled.
 * @param {Function}        props.onStartEdit    Called with the item id to enter edit mode.
 * @param {Function}        props.onChangeField  Called with { id, key, value } when an open field changes.
 * @param {Function}        props.onApplyField   Called with { id, key } to save a field.
 * @param {Function}        props.onDiscardField Called with { id, key } to discard a field.
 *
 * @returns {JSX.Element} The row.
 */
const BulkEditorRow = ( {
	item,
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
	const handleToggle = useCallback( () => onToggleRow( item.id ), [ onToggleRow, item.id ] );
	const handleEdit = useCallback( () => onStartEdit( item.id ), [ onStartEdit, item.id ] );
	// Pass the item id to the handlers, so the store can track the edit state for this row.
	const handleChangeField = useCallback( ( { key, value } ) => onChangeField( { id: item.id, key, value } ), [ onChangeField, item.id ] );
	const handleApplyField = useCallback( ( key ) => onApplyField( { id: item.id, key } ), [ onApplyField, item.id ] );
	const handleDiscardField = useCallback( ( key ) => onDiscardField( { id: item.id, key } ), [ onDiscardField, item.id ] );

	return (
		<Table.Row>
			<Table.Cell>
				<Checkbox
					id={ `bulk-editor-select-${ item.id }` }
					name={ `bulk-editor-select-${ item.id }` }
					value={ String( item.id ) }
					className="yst-mt-0.5"
					/* translators: %s expands to the content item title. */
					aria-label={ sprintf( __( "Select %s", "wordpress-seo" ), item.title ) }
					checked={ isSelected }
					onChange={ handleToggle }
				/>
			</Table.Cell>
			<TitleCell item={ item } />
			{ fields.map( ( field ) => ( openFields.includes( field.key )
				? (
					<EditableFieldCell
						key={ field.key }
						field={ field }
						itemId={ item.id }
						itemTitle={ item.title }
						value={ draft[ field.key ] ?? "" }
						isSaving={ savingField === field.key }
						onChange={ handleChangeField }
						onApply={ handleApplyField }
						onDiscard={ handleDiscardField }
					/>
				)
				: <Table.Cell key={ field.key }>{ item[ field.key ] }</Table.Cell>
			) ) }
			<Table.Cell>
				<span className="yst-flex yst-justify-end">
					<Button
						variant="tertiary"
						size="small"
						className="yst--me-2.5"
						onClick={ handleEdit }
						disabled={ isEditDisabled }
						/* translators: %s expands to the content item title. */
						aria-label={ sprintf( __( "Edit %s", "wordpress-seo" ), item.title ) }
					>
						{ __( "Edit", "wordpress-seo" ) }
					</Button>
				</span>
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
 * @param {BulkEditorSelection} props.selection   The selection seam.
 * @param {BulkEditorEditing}   props.editing     The inline-edit seam.
 * @param {boolean}             props.isLoading   Whether to render skeleton rows.
 *
 * @returns {JSX.Element} The body rows.
 */
const BulkEditorBody = ( { items, fields, columnCount, selection, editing, isLoading } ) => {
	const { selectedIds, onToggleRow } = selection;
	const { editingRows, onStartEdit, onChangeField, onApplyField, onDiscardField } = editing;

	if ( isLoading ) {
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

	return items.map( ( item ) => {
		// Each row carries its own edit state; items absent from `editingRows` render read-only.
		const isEditing = Boolean( editingRows[ item.id ] );
		const itemEdit = editingRows[ item.id ] ?? EMPTY_ROW_EDIT;

		return (
			<BulkEditorRow
				key={ item.id }
				item={ item }
				fields={ fields }
				isSelected={ selectedIds.includes( item.id ) }
				isEditDisabled={ isEditing }
				openFields={ itemEdit.openFields }
				draft={ itemEdit.draft }
				savingField={ itemEdit.savingField }
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
 * It renders the items it is given for the active field set (the Search or Social tab). Selection and inline
 * editing are seams: this component is presentational and drives them through the `selection` and `editing` bags.
 *
 * @param {Object}              props             The props.
 * @param {BulkEditorItem[]}    props.items       The items to render.
 * @param {FieldSet}            props.fieldSet    The active field set (its `fields` drive the editable columns).
 * @param {BulkEditorSelection} [props.selection] The selection seam.
 * @param {BulkEditorEditing}   [props.editing]   The inline-edit seam.
 * @param {boolean}             [props.isLoading] Whether to render skeleton rows instead of data.
 *
 * @returns {JSX.Element} The table.
 */
export const BulkEditorTable = ( { items, fieldSet, selection = {}, editing = {}, isLoading = false } ) => {
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
			<Table aria-label={ fieldSet.label } aria-busy={ isLoading } className="yst-table-auto sm:yst-table-fixed yst-w-full [&_thead]:!yst-border-t-0 [&_td]:yst-align-top [&_th]:yst-align-top [&_th]:yst-font-medium">
				<colgroup>
					<col className="sm:yst-w-[4%]" />
					<col className="sm:yst-w-[20%]" />
					{ fieldSet.fields.map( ( field ) => (
						<col key={ field.key } className={ field.width } />
					) ) }
					<col className="sm:yst-w-[5%]" />
				</colgroup>
				<BulkEditorHeader fields={ fieldSet.fields } columnCount={ columnCount } selection={ selectionState } isLoading={ isLoading } />
				<Table.Body>
					<BulkEditorBody
						items={ items }
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
