import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, Table } from "@yoast/ui-library";
import { EditableFieldCell, TitleCell } from "./table-cells";

/**
 * A content row. Each field-set cell renders as plain text, or — when the row is in edit mode and the field is
 * open — as an editable cell with its own Apply/Discard.
 *
 * @param {Object}          props                The props.
 * @param {BulkEditorItem}  props.item           The item data.
 * @param {FieldSetField[]} props.fields         The active field set's editable columns.
 * @param {boolean}         props.isSelected     Whether this item is selected.
 * @param {boolean}         props.isEditing      Whether this row is in edit mode (its Edit action becomes Cancel).
 * @param {string[]}        props.openFields     The field keys open as inputs in this row (empty unless editing).
 * @param {Object}          props.draft          The open fields' draft values.
 * @param {string|null}     props.savingField    The field key currently saving.
 * @param {Function}        props.onToggleRow    Called with the item id when its checkbox is toggled.
 * @param {Function}        props.onStartEdit    Called with the item id to enter edit mode.
 * @param {Function}        props.onChangeField  Called with { id, key, value } when an open field changes.
 * @param {Function}        props.onApplyField   Called with { id, key } to save a field.
 * @param {Function}        props.onDiscardField Called with { id, key } to discard a field.
 * @param {Function}        props.onCancelEdit   Called with the item id to cancel all of the row's open fields.
 *
 * @returns {JSX.Element} The row.
 */
export const BulkEditorRow = ( {
	item,
	fields,
	isSelected,
	isEditing,
	openFields,
	draft,
	savingField,
	onToggleRow,
	onStartEdit,
	onChangeField,
	onApplyField,
	onDiscardField,
	onCancelEdit,
} ) => {
	const handleToggle = useCallback( () => onToggleRow( item.id ), [ onToggleRow, item.id ] );
	const handleEdit = useCallback( () => onStartEdit( item.id ), [ onStartEdit, item.id ] );
	const handleCancel = useCallback( () => onCancelEdit( item.id ), [ onCancelEdit, item.id ] );
	const handleChangeField = useCallback( ( { key, value } ) => onChangeField( { id: item.id, key, value } ), [ onChangeField, item.id ] );
	const handleApplyField = useCallback( ( key ) => onApplyField( { id: item.id, key } ), [ onApplyField, item.id ] );
	const handleDiscardField = useCallback( ( key ) => onDiscardField( { id: item.id, key } ), [ onDiscardField, item.id ] );

	/* translators: %s expands to the content item title. */
	const editLabel = sprintf( __( "Edit %s", "wordpress-seo" ), item.title );
	/* translators: %s expands to the content item title. */
	const cancelLabel = sprintf( __( "Cancel editing %s", "wordpress-seo" ), item.title );

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
						onClick={ isEditing ? handleCancel : handleEdit }
						aria-label={ isEditing ? cancelLabel : editLabel }
					>
						{ isEditing ? __( "Cancel", "wordpress-seo" ) : __( "Edit", "wordpress-seo" ) }
					</Button>
				</span>
			</Table.Cell>
		</Table.Row>
	);
};
