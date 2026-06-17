import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, Table } from "@yoast/ui-library";
import { EditableFieldCell, TitleCell } from "./table-cells";
import { getRowEditState } from "./table-helpers";

/**
 * A content row. Each field-set cell renders as plain text, or — when the row is in edit mode and the field is
 * open — as an editable cell with its own Apply/Discard buttons.
 *
 * @param {Object}            props             The props.
 * @param {BulkEditorItem}    props.item        The item data.
 * @param {FieldSetField[]}   props.fields      The active field set's editable columns.
 * @param {boolean}           props.isSelected  Whether this item is selected.
 * @param {Function}          props.onToggleRow Called with the item id when its checkbox is toggled.
 * @param {Object}            [props.edit]      This row's edit state ({ openFields, draft, savingFields }), or undefined when not editing.
 * @param {BulkEditorEditing} props.editing     The inline-edit props (its handlers).
 *
 * @returns {JSX.Element} The row.
 */
export const BulkEditorRow = ( { item, fields, isSelected, onToggleRow, edit, editing } ) => {
	const { isEditing, openFields, draft, savingFields } = getRowEditState( edit );
	const { onStartEdit, onChangeField, onApplyField, onDiscardField } = editing;

	const [ closing, setClosing ] = useState( () => new Set() );

	const handleToggle = useCallback( () => onToggleRow( item.id ), [ onToggleRow, item.id ] );
	const handleEdit = useCallback( () => onStartEdit( item.id ), [ onStartEdit, item.id ] );
	const handleChangeField = useCallback( ( { key, value } ) => onChangeField( { id: item.id, key, value } ), [ onChangeField, item.id ] );
	const handleApplyField = useCallback( ( key ) => onApplyField( { id: item.id, key } ), [ onApplyField, item.id ] );

	// Discard one field, or Cancel the whole row.
	const requestCloseField = useCallback( ( key ) => setClosing( ( previous ) => new Set( previous ).add( key ) ), [] );
	const handleCancel = useCallback( () => setClosing( new Set( openFields ) ), [ openFields ] );

	// Discard the field once it has finished collapsing; the row leaves edit mode when none remain.
	const commitCloseField = useCallback( ( key ) => {
		setClosing( ( previous ) => {
			const next = new Set( previous );
			next.delete( key );
			return next;
		} );
		onDiscardField( { id: item.id, key } );
	}, [ onDiscardField, item.id ] );

	// Return focus to the row's Edit/Cancel button so keyboard users keep their place.
	const toggleRef = useRef( null );
	const previousOpenCount = useRef( openFields.length );
	useEffect( () => {
		const fieldClosed = openFields.length < previousOpenCount.current;
		previousOpenCount.current = openFields.length;
		if ( fieldClosed && document.activeElement === document.body ) {
			toggleRef.current?.focus( { preventScroll: true } );
		}
	}, [ openFields.length ] );

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
						isSaving={ Boolean( savingFields[ field.key ] ) }
						isOpen={ ! closing.has( field.key ) }
						onChange={ handleChangeField }
						onApply={ handleApplyField }
						onRequestClose={ requestCloseField }
						onClosed={ commitCloseField }
					/>
				)
				: <Table.Cell key={ field.key }>{ item[ field.key ] }</Table.Cell>
			) ) }
			<Table.Cell>
				<span className="yst-flex yst-justify-end">
					<Button
						ref={ toggleRef }
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
